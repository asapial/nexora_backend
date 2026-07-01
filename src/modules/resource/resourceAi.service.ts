import crypto from "crypto";
import zlib from "zlib";
import { z } from "zod";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { getAiResponse } from "../../utils/aiResponse";

const SUMMARY_PROMPT_VERSION = 1;
const CITATION_PARSER_VERSION = 1;
const MAX_TEXT_CHARS = 60000;
const MAX_AI_CONTEXT_CHARS = 22000;

const summarySchema = z.object({
  professionalSummary: z.string().min(1),
  goals: z.string().optional().nullable(),
  methods: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  conclusions: z.string().optional().nullable(),
  keyContributions: z.array(z.string()).default([]),
  limitations: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
});

const aiReferenceSchema = z.object({
  title: z.string().optional().nullable(),
  authors: z.array(z.string()).optional().default([]),
  year: z.number().int().optional().nullable(),
  doi: z.string().optional().nullable(),
  venue: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  rawReference: z.string().optional().nullable(),
  confidenceScore: z.number().min(0).max(1).optional().default(0.7),
});

type SummaryOutput = z.infer<typeof summarySchema>;
type ParsedReference = z.infer<typeof aiReferenceSchema>;

const hash = (value: Buffer | string) => crypto.createHash("sha256").update(value).digest("hex");

const normalizeText = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/-\s*\n\s*/g, "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*\d+\s*$/gm, "")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .trim();

const cleanPdfString = (value: string) =>
  value
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\n|\\r|\\t/g, " ")
    .replace(/\\[0-7]{1,3}/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractPdfStringText = (raw: string): string[] => {
  const out: string[] = [];
  const literalPattern = /\((?:\\.|[^\\)]){2,}\)\s*(?:Tj|'|")/g;
  const arrayPattern = /\[((?:\s*(?:\((?:\\.|[^\\)])*\)|<[\da-fA-F\s]+>|-?\d+(?:\.\d+)?)\s*)+)\]\s*TJ/g;
  const hexPattern = /<([\da-fA-F\s]{4,})>\s*Tj/g;

  for (const match of raw.matchAll(literalPattern)) {
    out.push(cleanPdfString(match[0].replace(/\)\s*(?:Tj|'|")$/, "").slice(1)));
  }

  for (const match of raw.matchAll(arrayPattern)) {
    const segment = match[1] ?? "";
    for (const part of segment.matchAll(/\((?:\\.|[^\\)])*\)/g)) out.push(cleanPdfString(part[0].slice(1, -1)));
    for (const part of segment.matchAll(/<([\da-fA-F\s]{4,})>/g)) {
      const hexValue = (part[1] ?? "").replace(/\s+/g, "");
      try {
        out.push(cleanPdfString(Buffer.from(hexValue, "hex").toString("utf8")));
      } catch {
        // Ignore malformed PDF hex strings.
      }
    }
  }

  for (const match of raw.matchAll(hexPattern)) {
    const hexValue = (match[1] ?? "").replace(/\s+/g, "");
    try {
      out.push(cleanPdfString(Buffer.from(hexValue, "hex").toString("utf8")));
    } catch {
      // Ignore malformed PDF hex strings.
    }
  }

  return out.filter((item) => /[a-zA-Z]{3,}/.test(item));
};

const inflatePdfStream = (stream: Buffer): string | null => {
  for (const inflate of [zlib.inflateSync, zlib.inflateRawSync, zlib.unzipSync]) {
    try {
      return inflate(stream).toString("latin1");
    } catch {
      // Try the next stream encoding.
    }
  }
  return null;
};

const extractPdfText = (buffer: Buffer) => {
  const raw = buffer.toString("latin1");
  const chunks: string[] = [];
  const pageCount = Math.max(1, (raw.match(/\/Type\s*\/Page\b/g) ?? []).length);
  chunks.push(...extractPdfStringText(raw));

  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  for (const match of raw.matchAll(streamPattern)) {
    if (chunks.join(" ").length > MAX_TEXT_CHARS) break;
    const streamBody = match[1];
    if (!streamBody) continue;
    const streamText = inflatePdfStream(Buffer.from(streamBody, "latin1"));
    if (streamText) chunks.push(...extractPdfStringText(streamText));
  }

  const fullText = normalizeText(chunks.join("\n")).slice(0, MAX_TEXT_CHARS);
  return { fullText, cleanedText: fullText, pageCount };
};

const fetchResourcePdf = async (fileUrl: string): Promise<Buffer> => {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error(`Could not fetch PDF: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.slice(0, 5).toString() !== "%PDF-") throw new Error("Resource file is not a valid PDF.");
  return bytes;
};

const fallbackSummary = (resource: { title: string; description: string | null; tags: string[] }, cleanedText: string): SummaryOutput => {
  const firstParagraph = cleanedText.split(/\n{2,}/).find((part) => part.length > 140) ?? resource.description ?? cleanedText.slice(0, 700);
  return {
    professionalSummary: firstParagraph ? firstParagraph.slice(0, 1100) : "Not clearly stated in the paper.",
    goals: resource.description || "Not clearly stated in the paper.",
    methods: "Not clearly stated in the paper.",
    results: "Not clearly stated in the paper.",
    conclusions: "Not clearly stated in the paper.",
    keyContributions: [],
    limitations: [],
    keywords: resource.tags.slice(0, 10),
  };
};

type ResourceForAi = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  tags: string[];
  authors: string[];
};

const getOrCreateSummary = async (resource: ResourceForAi, cleanedText: string, textHash: string, regenerate: boolean) => {
  const cacheKey = `summary:v${SUMMARY_PROMPT_VERSION}:${textHash}`;
  const cached = !regenerate
    ? await prisma.aiCache.findUnique({ where: { cacheKey } }).catch(() => null)
    : null;

  let modelName = cached?.modelName ?? "local-fallback";
  let parsed = cached?.outputJson ? summarySchema.safeParse(cached.outputJson).data : null;

  if (!parsed) {
    const aiResult = await getAiResponse<SummaryOutput>({
      context: `Paper/resource title: ${resource.title}\nAuthors: ${resource.authors?.join(", ") || "Unknown"}\nDescription: ${resource.description || ""}\n\nExtracted text:\n${cleanedText.slice(0, MAX_AI_CONTEXT_CHARS)}`,
      responseStyle: `Return JSON with keys professionalSummary, goals, methods, results, conclusions, keyContributions, limitations, keywords.`,
      restrictedAnswer: `Summarize only facts present in the supplied text. If a field is missing, write "Not clearly stated in the paper."`,
      responseTime: 12000,
      maxTokens: 1300,
      concurrency: 1,
      retryNumber: 1,
      maxModelBatches: 1,
    });
    modelName = aiResult.model;
    parsed = summarySchema.safeParse(aiResult.data).data ?? fallbackSummary(resource, cleanedText);
    await prisma.aiCache.upsert({
      where: { cacheKey },
      create: { cacheKey, taskType: "summary", modelName, promptVersion: SUMMARY_PROMPT_VERSION, inputHash: textHash, outputJson: parsed },
      update: { modelName, outputJson: parsed },
    });
  }

  return prisma.resourceSummary.upsert({
    where: { resourceId: resource.id },
    create: {
      resource: { connect: { id: resource.id } },
      modelName,
      promptVersion: SUMMARY_PROMPT_VERSION,
      inputTextHash: textHash,
      professionalSummary: parsed.professionalSummary,
      goals: parsed.goals ?? null,
      methods: parsed.methods ?? null,
      results: parsed.results ?? null,
      conclusions: parsed.conclusions ?? null,
      keyContributions: parsed.keyContributions.slice(0, 8),
      limitations: parsed.limitations.slice(0, 8),
      keywords: parsed.keywords.slice(0, 12),
      generationStatus: "COMPLETED",
    },
    update: {
      modelName,
      promptVersion: SUMMARY_PROMPT_VERSION,
      inputTextHash: textHash,
      professionalSummary: parsed.professionalSummary,
      goals: parsed.goals ?? null,
      methods: parsed.methods ?? null,
      results: parsed.results ?? null,
      conclusions: parsed.conclusions ?? null,
      keyContributions: parsed.keyContributions.slice(0, 8),
      limitations: parsed.limitations.slice(0, 8),
      keywords: parsed.keywords.slice(0, 12),
      generationStatus: "COMPLETED",
      generationError: null,
    },
  });
};

const detectReferenceSection = (text: string) => {
  const match = text.match(/\n\s*(references|bibliography|works cited)\s*\n/i);
  return match?.index ? text.slice(match.index) : "";
};

const splitReferences = (referenceSection: string) =>
  referenceSection
    .replace(/^\s*(references|bibliography|works cited)\s*/i, "")
    .split(/\n(?=(?:\[\d+\]|\d+\.|\w.+\(\d{4}\)))/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length > 25)
    .slice(0, 80);

const normalizeDoi = (value?: string | null) =>
  value?.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0].replace(/[.,;]+$/, "").toLowerCase() ?? null;

const titleFromReference = (raw: string) => {
  const quoted = raw.match(/[“"]([^”"]{12,220})[”"]/);
  if (quoted?.[1]) return quoted[1].trim();
  const afterYear = raw.match(/\b(?:19|20)\d{2}\b[)., ]+(.{12,220}?)(?:\.|, [A-Z][a-z]+,|\sdoi:|$)/i);
  return afterYear?.[1]?.trim() ?? raw.slice(0, 180);
};

const fallbackReferences = (references: string[]): ParsedReference[] =>
  references.map((raw) => ({
    title: titleFromReference(raw),
    authors: [],
    year: Number(raw.match(/\b(19|20)\d{2}\b/)?.[0]) || null,
    doi: normalizeDoi(raw),
    venue: null,
    url: raw.match(/https?:\/\/\S+/)?.[0]?.replace(/[).,]+$/, "") ?? null,
    rawReference: raw,
    confidenceScore: normalizeDoi(raw) ? 0.82 : 0.58,
  }));

const parseReferences = async (references: string[], textHash: string) => {
  if (!references.length) return [];
  const referencesHash = hash(references.join("\n"));
  const cacheKey = `citations:v${CITATION_PARSER_VERSION}:${textHash}:${referencesHash}`;
  const cached = await prisma.aiCache.findUnique({ where: { cacheKey } }).catch(() => null);
  const cachedParsed = cached?.outputJson ? z.array(aiReferenceSchema).safeParse(cached.outputJson).data : null;
  if (cachedParsed) return cachedParsed;

  const aiResult = await getAiResponse<ParsedReference[]>({
    context: references.slice(0, 40).map((ref, index) => `${index + 1}. ${ref}`).join("\n"),
    responseStyle: `Return a JSON array. Each item has title, authors, year, doi, venue, url, rawReference, confidenceScore.`,
    restrictedAnswer: "Do not invent DOI or URL. Use null when unavailable.",
    responseTime: 12000,
    maxTokens: 2200,
    concurrency: 1,
    retryNumber: 1,
    maxModelBatches: 1,
  });
  const parsed = z.array(aiReferenceSchema).safeParse(aiResult.data).data ?? fallbackReferences(references);
  await prisma.aiCache.upsert({
    where: { cacheKey },
    create: { cacheKey, taskType: "citation", modelName: aiResult.model, promptVersion: CITATION_PARSER_VERSION, inputHash: referencesHash, outputJson: parsed },
    update: { modelName: aiResult.model, outputJson: parsed },
  });
  return parsed;
};

const normalizeTitle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const lookupCrossref = async (reference: ParsedReference) => {
  const doi = normalizeDoi(reference.doi);
  const cacheKey = doi ? `crossref:doi:${doi}` : `crossref:title:${normalizeTitle(reference.title ?? "")}:${reference.year ?? ""}`;
  const cached = await prisma.metadataCache.findUnique({ where: { cacheKey } }).catch(() => null);
  if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) return cached.resultJson as Record<string, any>;

  let url = "";
  if (doi) {
    url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  } else if (reference.title) {
    url = `https://api.crossref.org/works?query.title=${encodeURIComponent(reference.title)}&rows=1`;
  } else {
    return null;
  }

  try {
    const response = await fetch(url, { headers: { "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)" } });
    if (!response.ok) return null;
    const json: any = await response.json();
    const item = doi ? json.message : json.message?.items?.[0];
    if (!item) return null;
    const result = {
      title: item.title?.[0],
      authors: Array.isArray(item.author) ? item.author.map((author: any) => [author.given, author.family].filter(Boolean).join(" ")).filter(Boolean).join(", ") : undefined,
      publicationYear: item.published?.["date-parts"]?.[0]?.[0] ?? item.created?.["date-parts"]?.[0]?.[0],
      venue: item["container-title"]?.[0],
      doi: item.DOI?.toLowerCase(),
      url: item.URL,
      metadataSource: "crossref",
      metadataConfidence: doi ? 0.96 : 0.78,
    };
    await prisma.metadataCache.upsert({
      where: { cacheKey },
      create: { cacheKey, source: "crossref", query: doi ?? reference.title ?? "", resultJson: result, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      update: { resultJson: result, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });
    return result;
  } catch {
    return null;
  }
};

const resolveCitationTarget = async (reference: ParsedReference) => {
  const doi = normalizeDoi(reference.doi);
  const title = reference.title?.trim() || reference.rawReference?.slice(0, 180) || "Unresolved reference";
  const hosted = doi
    ? await prisma.resource.findFirst({ where: { tags: { has: doi } }, select: { id: true } })
    : null;
  if (hosted) return { targetResourceId: hosted.id, externalTargetId: null, resolverSource: "hosted-resource-tag" };

  const metadata = await lookupCrossref(reference);
  const data = {
    title: metadata?.title ?? title,
    authors: metadata?.authors ?? (reference.authors?.length ? reference.authors.join(", ") : null),
    publicationYear: metadata?.publicationYear ?? reference.year ?? null,
    venue: metadata?.venue ?? reference.venue ?? null,
    doi: metadata?.doi ?? doi,
    url: metadata?.url ?? reference.url ?? null,
    metadataSource: metadata?.metadataSource ?? (doi ? "doi-parser" : "local-parser"),
    metadataConfidence: metadata?.metadataConfidence ?? reference.confidenceScore ?? 0.55,
  };

  const external = data.doi
    ? await prisma.externalCitationTarget.upsert({
        where: { doi: data.doi },
        create: data,
        update: data,
      })
    : await prisma.externalCitationTarget.create({ data });

  return { targetResourceId: null, externalTargetId: external.id, resolverSource: data.metadataSource };
};

const audit = async (resourceId: string, jobType: string, status: "PROCESSING" | "COMPLETED" | "FAILED", error?: string) => {
  const data: {
    resourceId: string;
    jobType: string;
    status: "PROCESSING" | "COMPLETED" | "FAILED";
    startedAt?: Date;
    finishedAt?: Date;
    error?: string | null;
  } = { resourceId, jobType, status };
  if (status === "PROCESSING") data.startedAt = new Date();
  if (status !== "PROCESSING") data.finishedAt = new Date();
  if (error) data.error = error;
  return prisma.resourceProcessingJobAudit.create({ data });
};

export const processResourceAi = async (resourceId: string, options: { regenerateSummary?: boolean; reanalyzeCitations?: boolean } = {}) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError(404, "Resource not found.");
  if (!resource.fileType.toLowerCase().includes("pdf") && !resource.fileUrl.toLowerCase().endsWith(".pdf")) {
    throw new AppError(400, "AI processing is available for PDF resources only.");
  }

  try {
    await audit(resourceId, "resource-ai", "PROCESSING");
    const { extracted, textHash } = await extractAndStoreResourceText(resource);
    await generateResourceSummary(resource, extracted.cleanedText, textHash, Boolean(options.regenerateSummary));

    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "CITATION_PROCESSING" } });
    const referenceSection = detectReferenceSection(extracted.cleanedText);
    const referenceLines = splitReferences(referenceSection);
    const parsedReferences = await parseReferences(referenceLines, textHash);

    if (options.reanalyzeCitations || parsedReferences.length) {
      await prisma.resourceCitationEdge.deleteMany({ where: { sourceResourceId: resourceId } });
    }

    for (const [index, reference] of parsedReferences.entries()) {
      const resolved = await resolveCitationTarget(reference);
      await prisma.resourceCitationEdge.create({
        data: {
          sourceResourceId: resourceId,
          targetResourceId: resolved.targetResourceId,
          externalTargetId: resolved.externalTargetId,
          rawReference: reference.rawReference ?? referenceLines[index] ?? null,
          referenceIndex: index + 1,
          confidenceScore: reference.confidenceScore ?? 0.7,
          resolverSource: resolved.resolverSource,
          parserVersion: CITATION_PARSER_VERSION,
        },
      });
    }

    const finalStatus = parsedReferences.length ? "GRAPH_READY" : "CITATIONS_READY";
    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: { aiProcessingStatus: finalStatus, lastProcessedAt: new Date(), processingError: null },
      include: { extractedText: true, aiSummary: true, citationsFrom: true },
    });
    await audit(resourceId, "resource-ai", "COMPLETED");
    return updated;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "FAILED", processingError: message } });
    await audit(resourceId, "resource-ai", "FAILED", message);
    throw error;
  }
};

const extractAndStoreResourceText = async (resource: ResourceForAi) => {
  await prisma.resource.update({ where: { id: resource.id }, data: { aiProcessingStatus: "TEXT_PROCESSING", processingError: null } });

  const pdf = await fetchResourcePdf(resource.fileUrl);
  const fileHash = hash(pdf);
  const extracted = extractPdfText(pdf);
  const textHash = hash(extracted.cleanedText);

  await prisma.resourceText.upsert({
    where: { resourceId: resource.id },
    create: { resourceId: resource.id, ...extracted, textHash, extractionMethod: "pdf-stream-parser" },
    update: { ...extracted, textHash, extractionMethod: "pdf-stream-parser" },
  });
  await prisma.resource.update({ where: { id: resource.id }, data: { fileHash, aiProcessingStatus: "TEXT_EXTRACTED" } });
  return { extracted, textHash };
};

const generateResourceSummary = async (resource: ResourceForAi, cleanedText: string, textHash: string, regenerate: boolean) => {
  await prisma.resource.update({ where: { id: resource.id }, data: { aiProcessingStatus: "SUMMARY_PROCESSING", processingError: null } });
  const summary = await getOrCreateSummary(resource, cleanedText, textHash, regenerate);
  await prisma.resource.update({
    where: { id: resource.id },
    data: { aiProcessingStatus: "SUMMARY_READY", lastProcessedAt: new Date(), processingError: null },
  });
  return summary;
};

export const processResourceSummary = async (resourceId: string, regenerate = false) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError(404, "Resource not found.");
  if (!resource.fileType.toLowerCase().includes("pdf") && !resource.fileUrl.toLowerCase().endsWith(".pdf")) {
    throw new AppError(400, "AI summary is available for PDF resources only.");
  }

  try {
    await audit(resourceId, "resource-summary", "PROCESSING");
    const { extracted, textHash } = await extractAndStoreResourceText(resource);
    const summary = await generateResourceSummary(resource, extracted.cleanedText, textHash, regenerate);
    await audit(resourceId, "resource-summary", "COMPLETED");
    return summary;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "FAILED", processingError: message } });
    await audit(resourceId, "resource-summary", "FAILED", message);
    throw error;
  }
};

export const getProcessingStatus = async (resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      aiProcessingStatus: true,
      lastProcessedAt: true,
      processingError: true,
      extractedText: { select: { id: true, pageCount: true, updatedAt: true } },
      aiSummary: { select: { id: true, isVisible: true, generationStatus: true, updatedAt: true } },
      _count: { select: { citationsFrom: true } },
    },
  });
  if (!resource) throw new AppError(404, "Resource not found.");
  return {
    resourceId,
    status: resource.aiProcessingStatus,
    lastProcessedAt: resource.lastProcessedAt,
    processingError: resource.processingError,
    text: resource.extractedText ? { status: "READY", pageCount: resource.extractedText.pageCount, updatedAt: resource.extractedText.updatedAt } : { status: "PENDING" },
    summary: resource.aiSummary ? { status: resource.aiSummary.generationStatus, isVisible: resource.aiSummary.isVisible, updatedAt: resource.aiSummary.updatedAt } : { status: "PENDING" },
    citations: { status: resource._count.citationsFrom > 0 ? "READY" : "PENDING", count: resource._count.citationsFrom },
  };
};

export const getSummary = async (resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      aiProcessingStatus: true,
      aiSummary: true,
    },
  });
  if (!resource) throw new AppError(404, "Resource not found.");
  return {
    resourceId,
    status: resource.aiProcessingStatus,
    summary: resource.aiSummary?.isVisible ? resource.aiSummary : null,
  };
};

export const setSummaryVisibility = async (resourceId: string, isVisible: boolean) =>
  prisma.resourceSummary.update({ where: { resourceId }, data: { isVisible } });

export const getCitations = async (resourceId: string) => {
  const edges = await prisma.resourceCitationEdge.findMany({
    where: { sourceResourceId: resourceId },
    include: {
      targetResource: { select: { id: true, title: true, authors: true, year: true, fileUrl: true } },
      externalTarget: true,
    },
    orderBy: [{ referenceIndex: "asc" }, { createdAt: "asc" }],
  });
  return edges.map((edge) => ({
    id: edge.id,
    relationType: edge.relationType,
    confidenceScore: edge.confidenceScore,
    rawReference: edge.rawReference,
    referenceIndex: edge.referenceIndex,
    resolverSource: edge.resolverSource,
    target: edge.targetResource
      ? { type: "internal", ...edge.targetResource }
      : edge.externalTarget
        ? { type: "external", ...edge.externalTarget }
        : { type: "unresolved", title: edge.rawReference ?? "Unresolved reference" },
  }));
};

export const getGraph = async (resourceId: string, query: Record<string, string | undefined>) => {
  const includeExternal = query.includeExternal !== "false";
  const minConfidence = Math.max(0, Math.min(1, Number(query.minConfidence ?? 0) || 0));
  const limit = Math.max(1, Math.min(200, Number(query.limit ?? 50) || 50));
  const current = await prisma.resource.findUnique({ where: { id: resourceId }, select: { id: true, title: true, authors: true, year: true } });
  if (!current) throw new AppError(404, "Resource not found.");

  const edges = await prisma.resourceCitationEdge.findMany({
    where: {
      sourceResourceId: resourceId,
      confidenceScore: { gte: minConfidence },
      ...(includeExternal ? {} : { externalTargetId: null }),
    },
    include: {
      targetResource: { select: { id: true, title: true, authors: true, year: true } },
      externalTarget: true,
    },
    take: limit,
    orderBy: [{ confidenceScore: "desc" }, { referenceIndex: "asc" }],
  });

  const nodes = new Map<string, any>();
  nodes.set(`resource:${current.id}`, { id: `resource:${current.id}`, type: "current-resource", label: current.title, data: current });
  const graphEdges = edges.flatMap((edge) => {
    const target = edge.targetResource
      ? { id: `resource:${edge.targetResource.id}`, type: "internal-resource", label: edge.targetResource.title, data: edge.targetResource }
      : edge.externalTarget
        ? { id: `external:${edge.externalTarget.id}`, type: "external-resource", label: edge.externalTarget.title, data: edge.externalTarget }
        : null;
    if (!target) return [];
    nodes.set(target.id, target);
    return [{
      id: edge.id,
      source: `resource:${resourceId}`,
      target: target.id,
      type: edge.relationType,
      confidenceScore: edge.confidenceScore,
      label: edge.relationType,
    }];
  });

  return { resourceId, nodes: [...nodes.values()], edges: graphEdges };
};
