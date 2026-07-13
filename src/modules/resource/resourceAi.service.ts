import crypto from "crypto";
import { extractText, getDocumentProxy } from "unpdf";
import { z } from "zod";
import AppError from "../../errorHelpers/AppError";
import { ResourceProcessingStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { getAiResponse, repairModelJson } from "../../utils/aiResponse";
import { cloudinaryUpload } from "../../config/cloudinary.config";

const SUMMARY_PROMPT_VERSION = 4;
const CITATION_PARSER_VERSION = 1;
const RESEARCH_GRAPH_VERSION = 2;
const RESEARCH_GRAPH_FIRST_LAYER_LIMIT = 10;
const RESEARCH_GRAPH_SECOND_LAYER_PARENTS = 4;
const RESEARCH_GRAPH_SECOND_LAYER_LIMIT = 3;
const RESEARCH_GRAPH_RELATED_LIMIT = 8;
const MAX_TEXT_CHARS = 60000;
const MAX_AI_CONTEXT_CHARS = 22000;
const MIN_EXTRACTED_TEXT_CHARS = 80;
const OCR_REQUIRED_MESSAGE =
  "This PDF does not contain enough selectable text for AI reading. Upload an OCR-enabled PDF or a text-based PDF.";
const PDF_EXTRACTION_METHOD = "unpdf-pdfjs";

const summarySchema = z.object({
  // English (canonical) — required
  professionalSummary: z.string().min(1),
  goals: z.string().optional().nullable(),
  methods: z.string().optional().nullable(),
  results: z.string().optional().nullable(),
  conclusions: z.string().optional().nullable(),
  keyContributions: z.array(z.string()).default([]),
  limitations: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  // Native Bangla mirror — optional but always requested from the LLM
  professionalSummaryBn: z.string().optional().nullable(),
  goalsBn: z.string().optional().nullable(),
  methodsBn: z.string().optional().nullable(),
  resultsBn: z.string().optional().nullable(),
  conclusionsBn: z.string().optional().nullable(),
  keyContributionsBn: z.array(z.string()).default([]),
  limitationsBn: z.array(z.string()).default([]),
  keywordsBn: z.array(z.string()).default([]),
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

const aiReferenceListSchema = z.preprocess((value) => {
  if (value && typeof value === "object" && !Array.isArray(value) && "references" in value) {
    return (value as { references?: unknown }).references;
  }
  return value;
}, z.array(aiReferenceSchema));

type SummaryOutput = z.infer<typeof summarySchema>;
type ParsedReference = z.infer<typeof aiReferenceSchema>;

type ResearchGraphNode = {
  id: string;
  type: "current-resource" | "reference-paper" | "citing-paper" | "second-layer-paper" | "related-paper";
  label: string;
  data: Record<string, unknown>;
};

type ResearchGraphEdge = {
  id: string;
  source: string;
  target: string;
  type: "REFERENCES" | "CITED_BY" | "RELATED";
  label: "References" | "Cited by" | "Related work";
  confidenceScore: number;
};

type SemanticScholarPaper = {
  paperId?: string | null;
  title?: string | null;
  authors?: Array<{ authorId?: string | null; name?: string | null }> | null;
  year?: number | null;
  externalIds?: { DOI?: string | null; ArXiv?: string | null; [key: string]: unknown } | null;
  openAccessPdf?: { url?: string | null; status?: string | null } | null;
  url?: string | null;
  venue?: string | null;
  abstract?: string | null;
  citationCount?: number | null;
};

type SemanticScholarCitation = {
  citingPaper?: SemanticScholarPaper | null;
  contexts?: string[] | null;
  isInfluential?: boolean | null;
};

type SemanticScholarReference = {
  citedPaper?: SemanticScholarPaper | null;
  contexts?: string[] | null;
  isInfluential?: boolean | null;
};

type OpenAlexWork = {
  id?: string | null;
  doi?: string | null;
  title?: string | null;
  display_name?: string | null;
  publication_year?: number | null;
  cited_by_count?: number | null;
  referenced_works?: string[] | null;
  related_works?: string[] | null;
  authorships?: Array<{ author?: { display_name?: string | null } | null }> | null;
  primary_location?: {
    landing_page_url?: string | null;
    pdf_url?: string | null;
    source?: { display_name?: string | null } | null;
  } | null;
  abstract_inverted_index?: Record<string, number[]> | null;
};

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

const extractPdfText = async (buffer: Buffer) => {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const extracted = await extractText(pdf, { mergePages: true });
  const fullText = normalizeText(extracted.text).slice(0, MAX_TEXT_CHARS);
  const meaningfulTextLength = fullText.replace(/\s/g, "").length;

  if (meaningfulTextLength < MIN_EXTRACTED_TEXT_CHARS) {
    throw new Error(OCR_REQUIRED_MESSAGE);
  }

  return { fullText, cleanedText: fullText, pageCount: extracted.totalPages };
};

/**
 * Resolve a Cloudinary delivery URL into something we can actually GET from the
 * backend. PDFs are uploaded as `resource_type: "raw"`, and Cloudinary protects
 * raw URLs by default — a plain `fetch()` against them returns 401. The frontend
 * avoids this by going through `/api/resource/cloudinary-sign`, so we mirror
 * that here by asking the SDK for a short-lived signed URL.
 *
 * Some stored `fileUrl` values are corrupted (URL-encoded when they shouldn't
 * have been, with spurious `%20` sequences that replace real characters in the
 * public_id). Naively regex-extracting the public_id from such a URL can yield
 * a string that Cloudinary's strict `private_download_url` lookup rejects with
 * 404. We therefore look the resource up in Cloudinary using the Admin API
 * (by folder + first filename token) to recover the canonical public_id,
 * then sign that. If the lookup fails we fall back to local-extracted
 * candidate public_ids.
 *
 * Non-Cloudinary URLs (memory-storage uploads, dev fixtures, etc.) are
 * returned unchanged.
 */
const cloudinarySignCache = new Map<string, string>(); // fileUrl → signedUrl

const resolveSignedCloudinaryUrl = async (fileUrl: string): Promise<string> => {
  if (!fileUrl || !fileUrl.includes("res.cloudinary.com")) return fileUrl;

  const cached = cloudinarySignCache.get(fileUrl);
  if (cached) return cached;

  let pathname = "";
  let isRaw = false;
  let extension = "pdf";
  let candidates: string[] = [];
  let adminVerifiedPublicIds = new Set<string>();
  try {
    const urlObj = new URL(fileUrl);
    pathname = urlObj.pathname;

    // Raw vs image vs video
    isRaw = pathname.includes("/raw/upload/");
    extension = pathname.match(/\.([a-zA-Z0-9]{1,5})$/)?.[1]?.toLowerCase() ?? "pdf";

    // Pull the suffix after /v<version>/ from each variant.
    const variantSuffixes: string[] = [];
    const rawMatch = pathname.match(/\/(?:image|raw|video)\/upload(?:\/[^/]+)*\/v\d+\/(.+)$/);
    if (rawMatch?.[1]) variantSuffixes.push(rawMatch[1]);
    const decodedPath = decodeURIComponent(pathname);
    const decodedMatch = decodedPath.match(/\/(?:image|raw|video)\/upload(?:\/[^/]+)*\/v\d+\/(.+)$/);
    if (decodedMatch?.[1] && decodedMatch[1] !== rawMatch?.[1]) {
      variantSuffixes.push(decodedMatch[1]);
    }

    for (const suffix of variantSuffixes) {
      candidates.push(suffix.replace(/\.[a-zA-Z0-9]{1,5}$/, ""));
      candidates.push(suffix.replace(/\.[a-zA-Z0-9]{1,5}$/, "").replace(/\s+/g, ""));
    }
    candidates = Array.from(new Set(candidates)).filter(Boolean);

    // ── Cloudinary Admin API lookup ──────────────────────────────────────────
    // Try to discover the canonical public_id by searching Cloudinary with the
    // folder + the first stable token (UUID prefix) from the URL. This handles
    // cases where the URL was mangled during URL-encoding.
    try {
      const folderMatch = pathname.match(/\/v\d+\/([^/]+)\//);
      const folder = folderMatch?.[1] ?? "nexora/pdfs";
      const idToken = candidates[0]?.match(/^([^/]+\/[^/-]+-[^-]+-)/)?.[1]; // <folder>/<uuid>-<timestamp>-
      const searchExpr = idToken
        ? `public_id:${idToken}*`
        : `resource_type:${isRaw ? "raw" : "image"} AND public_id:${folder}/*`;
      const search = await (cloudinaryUpload as any).search
        .expression(searchExpr)
        .max_results(5)
        .execute();
      for (const r of search.resources ?? []) {
        if (r.public_id && !candidates.includes(r.public_id)) {
          candidates.unshift(r.public_id);
          adminVerifiedPublicIds.add(r.public_id);
        }
      }
      candidates = Array.from(new Set(candidates)).filter(Boolean);
    } catch {
      // Admin API unavailable — proceed with heuristic candidates.
    }

    if (candidates.length === 0) return fileUrl;

    for (const publicId of candidates) {
      const expiresAt = Math.floor(Date.now() / 1000) + 600; // 10 min
      const signedUrl = cloudinaryUpload.utils.private_download_url(
        publicId,
        extension || "pdf",
        {
          resource_type: isRaw ? "raw" : "image",
          type: "upload",
          expires_at: expiresAt,
        },
      );
      if (!signedUrl) continue;
      // Admin-API-discovered public_ids are trusted outright; heuristic
      // candidates get a quick 1-byte probe first.
      if (!adminVerifiedPublicIds.has(publicId)) {
        try {
          const probe = await fetch(signedUrl, {
            method: "GET",
            headers: { Range: "bytes=0-0" },
          });
          if (!probe.ok && probe.status !== 206) continue;
        } catch {
          continue;
        }
      }
      cloudinarySignCache.set(fileUrl, signedUrl);
      return signedUrl;
    }

    // Nothing matched — return first candidate for debuggability.
    return (
      cloudinaryUpload.utils.private_download_url(candidates[0]!, extension || "pdf", {
        resource_type: isRaw ? "raw" : "image",
        expires_at: Math.floor(Date.now() / 1000) + 600,
      }) || fileUrl
    );
  } catch {
    return fileUrl;
  }
};

const fetchResourcePdf = async (fileUrl: string): Promise<Buffer> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000); // 90 s hard limit for signed PDF download
  try {
    const signedUrl = await resolveSignedCloudinaryUrl(fileUrl);
    const response = await fetch(signedUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`Could not fetch PDF: ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.slice(0, 5).toString() !== "%PDF-") throw new Error("Resource file is not a valid PDF.");
    return bytes;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") throw new Error("PDF fetch timed out after 90 seconds. Check the file URL.");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};

type PaperIdentity = {
  detectedTitle: string;
  detectedAuthors: string[];
  sourceType: "FULL_PAPER" | "RESEARCH_SUMMARY" | "EXTRACTED_TEXT";
  titleMismatch: boolean;
};

const normalizeIdentityText = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const identityTitleSimilarity = (left: string, right: string) => {
  const a = new Set(normalizeIdentityText(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalizeIdentityText(right).split(" ").filter((token) => token.length > 2));
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / Math.max(a.size, b.size);
};

/** Remove page-break boilerplate from prepared research packs while preserving
 * the actual paper title and numbered analytical sections. */
const prepareAcademicText = (text: string) => text
  .replace(/Paper\s+\d+\s*(?:•|·|â€¢|Â·)\s*Premium Research Summary\s+Prepared as separate paper-wise summary\s*(?:•|·|â€¢|Â·)\s*[^•\n]{0,120}?Research Pack\s*/gi, "")
  .replace(/[—-]+\s*End of Paper Summary\s*[—-]+/gi, "")
  .replace(/\s*[▪◦]\s*/g, "\n• ")
  .replace(/\s+([০-৯0-9]{1,2}\.\s+(?:Quick Research Profile|Executive Summary|Problem Statement|Dataset|Methodology|Experiments|Results|Limitations|Future Research|Graph|Chart|Presentation|Literature Review))/gi, "\n$1")
  .replace(/[ \t]+/g, " ")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const inferPaperIdentity = (
  cleanedText: string,
  resource: { title: string; authors?: string[] },
): PaperIdentity => {
  const sourceType: PaperIdentity["sourceType"] = /Premium Research Summary|Quick Research Profile|Executive Summary/i.test(cleanedText)
    ? "RESEARCH_SUMMARY"
    : /\bAbstract\b[\s\S]{50,}\b(?:Introduction|Methods?|Methodology)\b/i.test(cleanedText)
      ? "FULL_PAPER"
      : "EXTRACTED_TEXT";
  let detectedTitle = resource.title.trim();
  let detectedAuthors = resource.authors?.filter(Boolean) ?? [];

  const packMarker = /Research Pack\s+/i.exec(cleanedText);
  if (packMarker?.index !== undefined) {
    const afterMarker = cleanedText.slice(packMarker.index + packMarker[0].length, packMarker.index + packMarker[0].length + 900);
    const authorStart = /\s+([A-Z][\p{L}.'’\-]+\s+[A-Z][\p{L}.'’\-]+),\s+(?=[A-Z])/u.exec(afterMarker);
    if (authorStart?.index !== undefined) {
      const candidate = afterMarker.slice(0, authorStart.index).replace(/\s+/g, " ").trim();
      if (candidate.length >= 20 && candidate.length <= 350) detectedTitle = candidate;
      const authorBlock = afterMarker.slice(authorStart.index, afterMarker.search(/Accepted author version|\bAbstract\b|\bComputer Vision\b|\bQuick Research Profile\b/i) > authorStart.index
        ? afterMarker.search(/Accepted author version|\bAbstract\b|\bComputer Vision\b|\bQuick Research Profile\b/i)
        : Math.min(afterMarker.length, authorStart.index + 300));
      detectedAuthors = authorBlock
        .split(/,|\band\b/)
        .map((author) => author.replace(/\s+/g, " ").trim())
        .filter((author) => /^[A-Z][\p{L}.'’\-]+(?:\s+[A-Z][\p{L}.'’\-]+)+$/u.test(author))
        .slice(0, 20);
    }
  }

  return {
    detectedTitle,
    detectedAuthors,
    sourceType,
    titleMismatch: identityTitleSimilarity(resource.title, detectedTitle) < 0.42,
  };
};

const extractLabeledValue = (text: string, label: string, nextLabels: string[]) => {
  const lower = text.toLowerCase();
  const startLabel = lower.indexOf(label.toLowerCase());
  if (startLabel < 0) return null;
  const start = startLabel + label.length;
  const ends = nextLabels
    .map((next) => lower.indexOf(next.toLowerCase(), start))
    .filter((index) => index > start);
  const end = ends.length ? Math.min(...ends) : Math.min(text.length, start + 900);
  const value = text.slice(start, end).replace(/^\s*[:\-–—]\s*/, "").replace(/\s+/g, " ").trim();
  return value.length >= 8 ? value.slice(0, 1200) : null;
};

const structuredPackFallback = (
  resource: { title: string; description: string | null; tags: string[]; authors?: string[] },
  cleanedText: string,
): SummaryOutput | null => {
  const prepared = prepareAcademicText(cleanedText);
  if (!/Quick Research Profile|Paper Focus|Core Problem|Main Method/i.test(prepared)) return null;
  const paperFocus = extractLabeledValue(prepared, "Paper Focus", ["Core Problem", "Main Method"]);
  const coreProblem = extractLabeledValue(prepared, "Core Problem", ["Main Method", "Dataset / Evaluation"]);
  const mainMethod = extractLabeledValue(prepared, "Main Method", ["Dataset / Evaluation", "Main Takeaway"]);
  const evaluation = extractLabeledValue(prepared, "Dataset / Evaluation", ["Main Takeaway", "Executive Summary"]);
  const takeaway = extractLabeledValue(prepared, "Main Takeaway", ["Executive Summary", "Problem Statement"]);
  const identity = inferPaperIdentity(cleanedText, resource);
  const statements = [paperFocus, coreProblem, mainMethod, evaluation, takeaway].filter((value): value is string => Boolean(value));
  if (statements.length < 2) return null;
  const limitationsBlock = extractLabeledValue(prepared, "Limitations and Open Gaps", ["Future Research Suggestions", "Graph / Chart"]);
  const limitations = limitationsBlock
    ? limitationsBlock.split(/\s*•\s*|;\s+/).map((item) => item.trim()).filter((item) => item.length > 12).slice(0, 6)
    : [];
  const keywordTokens = identity.detectedTitle
    .split(/[:\-–—,]/)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 3);
  return {
    professionalSummary: statements.join(" ").slice(0, 2400),
    goals: [paperFocus, coreProblem].filter(Boolean).join(" ") || "Not clearly stated in the supplied text.",
    methods: mainMethod ?? "Not clearly stated in the supplied text.",
    results: [evaluation, takeaway].filter(Boolean).join(" ") || "Not clearly stated in the supplied text.",
    conclusions: takeaway ?? "Not clearly stated in the supplied text.",
    keyContributions: [mainMethod, evaluation].filter((value): value is string => Boolean(value)).slice(0, 6),
    limitations,
    keywords: [...new Set([...keywordTokens, ...resource.tags])].slice(0, 10),
    professionalSummaryBn: null,
    goalsBn: null,
    methodsBn: null,
    resultsBn: null,
    conclusionsBn: null,
    keyContributionsBn: [],
    limitationsBn: [],
    keywordsBn: [],
  };
};

/**
 * Deterministic local fallback when the AI response is unusable. Builds a
 * visibly useful summary from whatever signals we DO have (title, description,
 * tags, and the first real paragraph of extracted text) and populates BOTH
 * English and Bangla columns so the UI never renders empty.
 *
 * The Bangla version is the English mirror — that's a deliberate degradation
 * of quality when AI is unavailable, not a translation. We mark it with the
 * "EN (mirrored)" suffix in the UI to set user expectations correctly.
 */
const fallbackSummary = (resource: { title: string; description: string | null; tags: string[] }, cleanedText: string): SummaryOutput => {
  const structured = structuredPackFallback(resource, cleanedText);
  if (structured) return structured;
  const prepared = prepareAcademicText(cleanedText);
  const firstParagraph = prepared.split(/\n{2,}/).find((part) => part.length > 140) ?? resource.description ?? prepared.slice(0, 700);
  const english = firstParagraph ? firstParagraph.slice(0, 1100) : "Not clearly stated in the paper.";
  const banglaNote = "\n\n(বাংলা সারাংশ AI দ্বারা তৈরি করা যায়নি — ইংরেজি সারাংশ দেখানো হচ্ছে।)";
  return {
    professionalSummary: english,
    goals: resource.description || "Not clearly stated in the paper.",
    methods: "Not clearly stated in the paper.",
    results: "Not clearly stated in the paper.",
    conclusions: "Not clearly stated in the paper.",
    keyContributions: [],
    limitations: [],
    keywords: resource.tags.slice(0, 10),
    // Bangla mirrors English so we never render a blank panel.
    professionalSummaryBn: english + banglaNote,
    goalsBn: resource.description ? resource.description + banglaNote : null,
    methodsBn: null,
    resultsBn: null,
    conclusionsBn: null,
    keyContributionsBn: [],
    limitationsBn: [],
    keywordsBn: [],
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
  aiProcessingStatus: ResourceProcessingStatus;
};

type SharedAiLookup = {
  fileHash?: string | null;
  textHash?: string | null;
  skipSummary?: boolean;
  skipCitations?: boolean;
};

const findSharedAiSource = async (resourceId: string, lookup: SharedAiLookup) => {
  const lookupOr: Record<string, unknown>[] = [];
  if (lookup.fileHash) lookupOr.push({ fileHash: lookup.fileHash });
  if (lookup.textHash) lookupOr.push({ extractedText: { is: { textHash: lookup.textHash } } });
  if (!lookupOr.length) return null;

  const candidates = await prisma.resource.findMany({
    where: { id: { not: resourceId }, OR: lookupOr },
    include: {
      extractedText: true,
      aiSummary: true,
      citationsFrom: true,
    },
    orderBy: [{ lastProcessedAt: "desc" }, { updatedAt: "desc" }],
    take: 10,
  });

  return candidates.find((resource) =>
    resource.extractedText || resource.aiSummary || resource.citationsFrom.length > 0
  ) ?? null;
};

const copySharedAiArtifacts = async (
  targetResourceId: string,
  source: NonNullable<Awaited<ReturnType<typeof findSharedAiSource>>>,
  options: SharedAiLookup = {},
) => {
  let copiedText = false;
  let copiedSummary = false;
  let copiedCitations = 0;

  if (source.extractedText) {
    const {
      fullText,
      cleanedText,
      textHash,
      pageCount,
      language,
      extractionMethod,
      extractionVersion,
    } = source.extractedText;
    await prisma.resourceText.upsert({
      where: { resourceId: targetResourceId },
      create: {
        resourceId: targetResourceId,
        fullText,
        cleanedText,
        textHash,
        pageCount,
        language,
        extractionMethod,
        extractionVersion,
      },
      update: {
        fullText,
        cleanedText,
        textHash,
        pageCount,
        language,
        extractionMethod,
        extractionVersion,
      },
    });
    copiedText = true;
  }

  if (source.aiSummary && !options.skipSummary) {
    const {
      modelName,
      promptVersion,
      inputTextHash,
      professionalSummary,
      goals,
      methods,
      results,
      conclusions,
      keyContributions,
      limitations,
      keywords,
      professionalSummaryBn,
      goalsBn,
      methodsBn,
      resultsBn,
      conclusionsBn,
      keyContributionsBn,
      limitationsBn,
      keywordsBn,
      generationStatus,
      generationError,
    } = source.aiSummary;
    await prisma.resourceSummary.upsert({
      where: { resourceId: targetResourceId },
      create: {
        resourceId: targetResourceId,
        modelName,
        promptVersion,
        inputTextHash,
        professionalSummary,
        goals,
        methods,
        results,
        conclusions,
        keyContributions,
        limitations,
        keywords,
        professionalSummaryBn,
        goalsBn,
        methodsBn,
        resultsBn,
        conclusionsBn,
        keyContributionsBn,
        limitationsBn,
        keywordsBn,
        isVisible: true,
        generationStatus,
        generationError,
      },
      update: {
        modelName,
        promptVersion,
        inputTextHash,
        professionalSummary,
        goals,
        methods,
        results,
        conclusions,
        keyContributions,
        limitations,
        keywords,
        professionalSummaryBn,
        goalsBn,
        methodsBn,
        resultsBn,
        conclusionsBn,
        keyContributionsBn,
        limitationsBn,
        keywordsBn,
        isVisible: true,
        generationStatus,
        generationError,
      },
    });
    copiedSummary = true;
  }

  if (source.citationsFrom.length && !options.skipCitations) {
    await prisma.resourceCitationEdge.deleteMany({ where: { sourceResourceId: targetResourceId } });
    await prisma.resourceCitationEdge.createMany({
      data: source.citationsFrom.map((edge) => ({
        sourceResourceId: targetResourceId,
        targetResourceId: edge.targetResourceId,
        externalTargetId: edge.externalTargetId,
        relationType: edge.relationType,
        confidenceScore: edge.confidenceScore,
        rawReference: edge.rawReference,
        contextSnippet: edge.contextSnippet,
        referenceIndex: edge.referenceIndex,
        resolverSource: edge.resolverSource ? `shared:${edge.resolverSource}` : "shared-cache",
        parserVersion: edge.parserVersion,
      })),
    });
    copiedCitations = source.citationsFrom.length;
  }

  const nextStatus = copiedCitations
    ? "GRAPH_READY"
    : copiedSummary
      ? "SUMMARY_READY"
      : copiedText
        ? "TEXT_EXTRACTED"
        : null;

  if (nextStatus) {
    await prisma.resource.update({
      where: { id: targetResourceId },
      data: {
        ...(options.fileHash ? { fileHash: options.fileHash } : {}),
        aiProcessingStatus: nextStatus,
        lastProcessedAt: new Date(),
        processingError: null,
      },
    });
  }

  return {
    sourceResourceId: source.id,
    copiedText,
    copiedSummary,
    copiedCitations,
  };
};

export const hydrateResourceAiFromExisting = async (resourceId: string, lookup: SharedAiLookup = {}) => {
  // Always persist the fileHash on the resource so that re-uploads of the same
  // PDF (or future callers with the same hash) can be matched against this row,
  // even when nothing was copied from a sibling. Without this, the second uploader
  // can never benefit from the first uploader's cached AI artifacts.
  if (lookup.fileHash) {
    await prisma.resource.update({
      where: { id: resourceId },
      data: { fileHash: lookup.fileHash },
    }).catch(() => undefined);
  }

  const source = await findSharedAiSource(resourceId, lookup);
  if (!source) {
    return {
      hydrated: false,
      sourceResourceId: null,
      copiedText: false,
      copiedSummary: false,
      copiedCitations: 0,
    };
  }

  const copied = await copySharedAiArtifacts(resourceId, source, lookup);
  return {
    hydrated: copied.copiedText || copied.copiedSummary || copied.copiedCitations > 0,
    ...copied,
  };
};

const getOrCreateSummary = async (resource: ResourceForAi, cleanedText: string, textHash: string, regenerate: boolean) => {
  const cacheKey = `summary:v${SUMMARY_PROMPT_VERSION}:${textHash}`;
  const cached = !regenerate
    ? await prisma.aiCache.findUnique({ where: { cacheKey } }).catch(() => null)
    : null;

  let modelName = cached?.modelName ?? "local-fallback";
  let parsed: (SummaryOutput & { __model?: string }) | null = cached?.outputJson
    ? (summarySchema.safeParse(cached.outputJson).data as SummaryOutput & { __model?: string } | undefined) ?? null
    : null;

  if (!parsed) {
    const result = await generateBilingualSummary(resource, cleanedText);
    parsed = result;
    modelName = result.__model ?? modelName;

    // If the AI call came back with English but no Bangla (common — not every
    // model respects bilingual output), run a focused, smaller translation
    // pass that only translates the English fields. This keeps the panel
    // useful for Bangla-first users without retrying the whole 22000-char
    // context pass.
    if (
      parsed &&
      (!parsed.professionalSummaryBn || parsed.professionalSummaryBn.trim().length < 40) &&
      parsed.professionalSummary
    ) {
      const translated = await translateSummaryToBangla(parsed, modelName);
      parsed = { ...parsed, ...translated };
    }
    if (parsed && (!parsed.professionalSummaryBn || parsed.professionalSummaryBn.trim().length < 20)) {
      parsed = withBnMirror(parsed, modelName);
    }
  }

  await prisma.aiCache.upsert({
    where: { cacheKey },
    create: {
      cacheKey,
      taskType: "summary",
      modelName,
      promptVersion: SUMMARY_PROMPT_VERSION,
      inputHash: textHash,
      outputJson: parsed,
    },
    update: { modelName, outputJson: parsed },
  });

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
      professionalSummaryBn: parsed.professionalSummaryBn ?? null,
      goalsBn: parsed.goalsBn ?? null,
      methodsBn: parsed.methodsBn ?? null,
      resultsBn: parsed.resultsBn ?? null,
      conclusionsBn: parsed.conclusionsBn ?? null,
      keyContributionsBn: parsed.keyContributionsBn.slice(0, 8),
      limitationsBn: parsed.limitationsBn.slice(0, 8),
      keywordsBn: parsed.keywordsBn.slice(0, 12),
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
      professionalSummaryBn: parsed.professionalSummaryBn ?? null,
      goalsBn: parsed.goalsBn ?? null,
      methodsBn: parsed.methodsBn ?? null,
      resultsBn: parsed.resultsBn ?? null,
      conclusionsBn: parsed.conclusionsBn ?? null,
      keyContributionsBn: parsed.keyContributionsBn.slice(0, 8),
      limitationsBn: parsed.limitationsBn.slice(0, 8),
      keywordsBn: parsed.keywordsBn.slice(0, 12),
      generationStatus: "COMPLETED",
      generationError: null,
    },
  });
};

/**
 * Run the bilingual summary generation against the free-model pool with the
 * retry/repair/recover pipeline. Returns either a fully populated
 * SummaryOutput or a `fallbackSummary` row tagged with `__model` so we know
 * it was the deterministic local path.
 */
const generateBilingualSummary = async (resource: ResourceForAi, cleanedText: string): Promise<SummaryOutput & { __model?: string }> => {
  const preparedText = prepareAcademicText(cleanedText);
  const identity = inferPaperIdentity(cleanedText, resource);
  const groundingAnchor = {
    title: identity.detectedTitle,
    authors: identity.detectedAuthors,
    description: preparedText.slice(0, 2200),
  };
  const prompt = [
    `Stored resource title (may be inaccurate): ${resource.title}`,
    `Detected paper title from the document: ${identity.detectedTitle}`,
    `Detected authors: ${identity.detectedAuthors.join(", ") || resource.authors?.join(", ") || "Unknown"}`,
    `Source type: ${identity.sourceType}`,
    identity.titleMismatch
      ? `IMPORTANT: The stored resource title conflicts with the document. Summarize the detected paper only.`
      : `The stored title and document identity are consistent.`,
    `\nPrepared extracted text:\n${preparedText.slice(0, MAX_AI_CONTEXT_CHARS)}`,
  ].join("\n");

  // High-quality academic-style response. Demands concrete, dense prose in
  // both English and native বাংলা, with hard limits on field sizes to keep the
  // JSON small enough to fit in a single response.
  const responseStyle = [
    `Return a single JSON object only. No markdown fences, no prose, no commentary, no code-block wrappers.`,
    `All fields must be present (use null or [] when a fact is genuinely absent — never omit a key).`,
    ``,
    `── Quality bar (apply to every field) ──`,
    `Write in the voice of a careful academic reviewer, not a generic press release. Every sentence must add new information; no filler. Prefer concrete terms (dataset names, model names, metrics, sample sizes) over vague ones. Quote or paraphrase actual content from the supplied text — never invent facts.`,
    ``,
    `── English fields ──`,
    `- "professionalSummary"  : 4-6 sentences, dense academic prose, ONE paragraph. State the problem, the approach, the headline result (with metric if available), and the implication. No headings, no bullet points.`,
    `- "goals"               : 1-3 sentences. The specific research question / objective the paper sets out to answer. May be null if the paper does not state one.`,
    `- "methods"             : 1-3 sentences. The core technique, dataset, or experimental setup. Name the method, the data, and the evaluation protocol.`,
    `- "results"             : 1-3 sentences. The main quantitative or qualitative findings, with at least one concrete number, percentage, or named outcome if the paper provides one.`,
    `- "conclusions"         : 1-3 sentences. The authors' interpretation and the broader significance.`,
    `- "keyContributions"    : 3-6 short noun phrases (each ≤ 9 words). Each phrase should name ONE concrete contribution (a method, a dataset, a finding). Do not duplicate the professionalSummary.`,
    `- "limitations"         : 2-5 short noun phrases. Honest limitations the paper itself acknowledges OR that are directly visible from the text. Do not invent generic ones.`,
    `- "keywords"            : 5-10 short noun phrases. Domain-specific terms, technique names, dataset names. Lowercase.`,
    ``,
    `── Bangla (বাংলা) mirror fields ──`,
    `These must be a true native-Bangla translation of the English field, NOT transliteration and NOT Latin-script Bangla. Use the Bengali script (অ-ঔ, ক-হ) throughout. The tone, length, and information density must match the English field.`,
    `- "professionalSummaryBn" : same 4-6 sentences as the English professionalSummary, rewritten in fluent native বাংলা.`,
    `- "goalsBn" / "methodsBn" / "resultsBn" / "conclusionsBn" : same length and meaning as the English counterpart, in native বাংলা. May be null only if the English counterpart is null.`,
    `- "keyContributionsBn" : 3-6 বাংলা noun phrases, one per English contribution, same order.`,
    `- "limitationsBn"      : 2-5 বাংলা noun phrases, one per English limitation, same order.`,
    `- "keywordsBn"         : 5-10 বাংলা words/phrases, one per English keyword, same order.`,
  ].join("\n");

  const restrictedAnswer = [
    `Summarize ONLY facts present in the supplied text. If a field is genuinely missing, write the English sentinel "Not clearly stated in the paper." and the Bangla sentinel "সুস্পষ্টভাবে উল্লেখ নেই।" for the Bn field.`,
    `Never leave professionalSummary empty. Never return an empty object. Never invent citations, authors, or numerical results that do not appear in the supplied text.`,
    `For all Bn fields, use natural native Bangla script (অ-ঔ, ক-হ). Do not write Bangla in Latin letters. Do not transliterate English terms letter-by-letter into Bengali script. Technical terms that have an established Bangla convention (e.g. "তথ্যসেট", "নিউরাল নেটওয়ার্ক", "ক্লাস্টারিং") may be used, otherwise keep the English term in Latin script inside the Bangla sentence.`,
    `For Bangla array fields (keyContributionsBn, limitationsBn, keywordsBn), each item must be a single short phrase, not a full sentence.`,
  ].join(" ");

  try {
    const aiResult = await getAiResponse<SummaryOutput & { __model?: string }>({
      context: prompt,
      responseStyle,
      restrictedAnswer,
      // Generous timeout — the bilingual prompt is large and the new
      // quality bar demands dense academic prose, so the response can be long.
      responseTime: 25_000,
      maxTokens: 3200,
      concurrency: 2,
      // Try each free model up to 2 times before moving to the next.
      retryNumber: 2,
      // Try up to 3 batches of models so we don't burn through the whole
      // list on the first failure but we also don't give up too early.
      maxModelBatches: 3,
    });

    if (aiResult.data) {
      const validated = summarySchema.safeParse(aiResult.data).data;
      // Hallucination guard: if the validated summary shares near-zero lexical
      // overlap with the resource's title/description/authors, the model almost
      // certainly returned content for a different paper. Discard and fall back
      // to the deterministic local summary (which is built from the real
      // extracted text and will look honest next to the title).
      if (validated && !looksLikeHallucination(validated, groundingAnchor)) {
        return { ...validated, __model: aiResult.model };
      }
      console.warn("[resource-ai] summary rejected by hallucination guard", {
        model: aiResult.model,
        title: resource.title,
      });
    }

    // AI came back but the JSON couldn't be coerced into the schema even
    // after repair. Try a one-shot manual repair from the raw text.
    const raw = (aiResult as { rawText?: string }).rawText;
    if (raw) {
      const repaired = repairModelJson<SummaryOutput>(raw);
      const validated = repaired ? summarySchema.safeParse(repaired).data : null;
      if (validated && !looksLikeHallucination(validated, groundingAnchor)) {
        return { ...validated, __model: aiResult.model };
      }
    }

    // Last-ditch: derive the schema from the loose object the model returned,
    // accepting whatever shape we got and filling the Bn fields with English
    // as a visible-but-clearly-mirror fallback so the UI never renders empty.
    return { ...fallbackSummary(resource, cleanedText), __model: `${aiResult.model}:grounded-fallback` };
  } catch {
    return { ...fallbackSummary(resource, cleanedText), __model: "local-grounded-fallback" };
  }
};

/**
 * Translate the English fields of a parsed summary to native Bangla in a
 * single small pass. Only invoked when the primary call didn't produce Bangla.
 */
const translateSummaryToBangla = async (
  parsed: SummaryOutput,
  _sourceModel: string,
): Promise<Partial<SummaryOutput>> => {
  const translations: Partial<SummaryOutput> = {};

  const stringFields: Array<[keyof SummaryOutput, string | null | undefined]> = [
    ["professionalSummary", parsed.professionalSummary],
    ["goals", parsed.goals],
    ["methods", parsed.methods],
    ["results", parsed.results],
    ["conclusions", parsed.conclusions],
  ];

  for (const [enKey, value] of stringFields) {
    if (!value) continue;
    const bnKey = `${String(enKey)}Bn` as keyof SummaryOutput;
    try {
      const aiResult = await getAiResponse<{ bn: string | null }>({
        context: `Translate the following English text into fluent native Bangla (বাংলা). Use natural Bengali script — never transliteration, never Latin letters for Bangla. Preserve technical terms only if they have an established Bangla convention. Return JSON only.\n\nText:\n"""${value}"""`,
        responseStyle: `Return JSON with one key: "bn" containing the Bangla translation, or null if the input is empty.`,
        restrictedAnswer: `Never transliterate. Never return empty string — return null for empty input only.`,
        responseTime: 12_000,
        maxTokens: 600,
        concurrency: 2,
        retryNumber: 1,
        maxModelBatches: 2,
      });
      (translations as Record<string, string | null>)[bnKey] = aiResult.data?.bn ?? null;
    } catch {
      // Leave individual field null — we'll mirror English below if all fail.
    }
  }

  const arrayFields: Array<[keyof SummaryOutput, string[]]> = [
    ["keyContributionsBn", parsed.keyContributions],
    ["limitationsBn", parsed.limitations],
    ["keywordsBn", parsed.keywords],
  ];
  for (const [bnKey, sourceList] of arrayFields) {
    if (!sourceList?.length) continue;
    try {
      const aiResult = await getAiResponse<{ bn: string[] }>({
        context: `Translate each English phrase into a concise fluent native Bangla (বাংলা) equivalent. Preserve the input order and length exactly. Use Bengali script (অ-ঔ, ক-হ) for every word. Do NOT transliterate English letter-by-letter. Technical terms without a Bangla convention may stay in Latin script inside the Bangla phrase.\n\nPhrases (one per line, preserve numbering):\n${sourceList.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,
        responseStyle: `Return JSON with one key: "bn" which is an array of Bangla translations in the SAME order, with the SAME length as the input.`,
        restrictedAnswer: `Never transliterate. Never return an empty array when the input is non-empty. Same length as input.`,
        responseTime: 12_000,
        maxTokens: 600,
        concurrency: 2,
        retryNumber: 1,
        maxModelBatches: 2,
      });
      const arr = aiResult.data?.bn;
      (translations as Record<string, string[]>)[bnKey] = Array.isArray(arr) && arr.length === sourceList.length
        ? arr
        : [];
    } catch {
      (translations as Record<string, string[]>)[bnKey] = [];
    }
  }

  return translations;
};

/**
 * Final safety net: if a model returned a non-Bangla row, mirror the English
 * fields into the Bn columns so the UI never shows blank Bangla. The UI
 * shows a small "(mirrored from English)" badge in this case.
 */
const withBnMirror = (parsed: SummaryOutput, modelName?: string): SummaryOutput & { __model?: string } => {
  return {
    ...parsed,
    professionalSummaryBn: parsed.professionalSummaryBn ?? parsed.professionalSummary,
    goalsBn: parsed.goalsBn ?? parsed.goals ?? null,
    methodsBn: parsed.methodsBn ?? parsed.methods ?? null,
    resultsBn: parsed.resultsBn ?? parsed.results ?? null,
    conclusionsBn: parsed.conclusionsBn ?? parsed.conclusions ?? null,
    keyContributionsBn: parsed.keyContributionsBn.length ? parsed.keyContributionsBn : parsed.keyContributions,
    limitationsBn: parsed.limitationsBn.length ? parsed.limitationsBn : parsed.limitations,
    keywordsBn: parsed.keywordsBn.length ? parsed.keywordsBn : parsed.keywords,
    __model: modelName ?? "local-fallback",
  };
};

/**
 * Stopwords that we strip from title/description/summary before doing the
 * overlap check. Otherwise every summary would trivially "match" because of
 * shared common words ("the", "and", "of").
 */
const HALLUCINATION_STOPWORDS = new Set(
  (
    "a about above after again against all am an and any are as at " +
    "be because been before being below between both but by can did do " +
    "does doing down during each few for from further had has have having " +
    "he her here hers herself him himself his how i if in into is it its " +
    "itself just me more most my myself no nor not now of off on once only " +
    "or other our ours ourselves out over own same she should so some such " +
    "than that the their theirs them themselves then there these they this " +
    "those through to too under until up very was we were what when where " +
    "which while who whom why will with would you your yours yourself yourselves " +
    "paper study method results analysis model based using used data propose proposed"
  ).split(/\s+/).filter(Boolean),
);

/**
 * Compute the lexical overlap between a candidate `professionalSummary` and
 * the resource's title+description. Returns a score in [0, 1] where 1 means
 * perfect overlap and 0 means no shared content tokens.
 *
 * We deliberately use SUBSTRING matching (not pure intersection) so that a
 * proper noun like "MATGAN" appearing anywhere in the summary counts, but
 * common words like "the" or "paper" don't.
 */
const contentOverlapRatio = (summary: string, anchor: { title: string; description: string | null; authors: string[] }): number => {
  const summaryTokens = new Set(
    summary
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 4 && !HALLUCINATION_STOPWORDS.has(token)),
  );
  if (summaryTokens.size < 5) return 0;

  const anchorText = [anchor.title, anchor.description ?? "", ...(anchor.authors ?? [])]
    .join(" ")
    .toLowerCase();
  const anchorTokens = new Set(
    anchorText
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 4 && !HALLUCINATION_STOPWORDS.has(token)),
  );
  if (anchorTokens.size === 0) return 1; // No anchor → can't detect hallucination, trust the model.

  let hits = 0;
  for (const token of summaryTokens) {
    if (anchorTokens.has(token) || anchorText.includes(token)) hits += 1;
  }
  return hits / summaryTokens.size;
};

/**
 * Decide whether a candidate summary is plausibly about the supplied resource.
 * Returns `false` if the summary shows no lexical overlap with the resource's
 * title/description/authors — the strongest signal that the model hallucinated
 * or returned content from a different paper.
 *
 * Threshold of 0.08 was chosen empirically: a real summary of an IoT paper
 * about "MATGAN imputation" against the anchor "An Online Collaborative
 * Imputation Method for Industrial Missing Data Based on Multiscale MATGAN"
 * scores ~0.35; the CDLT/TPAMI hallucination scored 0.02.
 */
const looksLikeHallucination = (parsed: SummaryOutput, anchor: { title: string; description: string | null; authors: string[] }): boolean => {
  const summary = `${parsed.professionalSummary} ${(parsed.keywords ?? []).join(" ")}`.trim();
  if (!summary) return true;
  const ratio = contentOverlapRatio(summary, anchor);
  if (ratio < 0.08) {
    console.warn("[resource-ai] hallucination guard rejected summary", {
      ratio,
      anchorTitle: anchor.title,
      sampleTokens: Array.from(summary.toLowerCase().split(/\s+/).slice(0, 20)),
    });
    return true;
  }
  return false;
};

const referenceHeadingPattern = /(?:^|\n)\s*(references|bibliography|works cited|literature cited)\s*:?\s*(?=\n|$)/gi;
const numberedReferencePattern = /^(?:\[\d+\]|\d+[\).])\s+/;
const authorYearReferencePattern = /^[A-Z][A-Za-z'`-]+,\s+(?:[A-Z]\.|[A-Z][A-Za-z'`-]+).*?\b(?:19|20)\d{2}\b/;
const parentheticalYearPattern = /\(\s*(?:19|20)\d{2}[a-z]?\s*\)/i;

const hasReferenceSignal = (line: string) =>
  /\b(?:19|20)\d{2}\b/.test(line) ||
  /doi\s*:?\s*10\./i.test(line) ||
  /https?:\/\//i.test(line);

const isReferenceStart = (line: string) =>
  numberedReferencePattern.test(line) ||
  authorYearReferencePattern.test(line) ||
  parentheticalYearPattern.test(line);

const detectReferenceSection = (text: string) => {
  referenceHeadingPattern.lastIndex = 0;
  const headings = Array.from(text.matchAll(referenceHeadingPattern));
  const heading = headings[headings.length - 1];
  if (heading?.index !== undefined) return text.slice(heading.index);

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const searchFrom = Math.floor(lines.length * 0.55);
  const fallbackIndex = lines.findIndex((line, index) => index >= searchFrom && isReferenceStart(line) && hasReferenceSignal(line));
  return fallbackIndex >= 0 ? ["References", ...lines.slice(fallbackIndex)].join("\n") : "";
};

const splitReferences = (referenceSection: string) => {
  referenceHeadingPattern.lastIndex = 0;
  const normalized = referenceSection
    .replace(referenceHeadingPattern, "\n")
    .replace(/\s+(?=(?:\[\d+\]|\d+[\).])\s+)/g, "\n");
  const entries: string[] = [];
  let current: string[] = [];

  for (const line of normalized.split("\n").map((item) => item.replace(/\s+/g, " ").trim()).filter(Boolean)) {
    if (isReferenceStart(line) && current.length) {
      entries.push(current.join(" "));
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length) entries.push(current.join(" "));

  return entries
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length > 25 && hasReferenceSignal(item))
    .slice(0, 80);
};

const normalizeDoi = (value?: string | null) =>
  value?.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0].replace(/[.,;]+$/, "").toLowerCase() ?? null;

const titleFromReference = (raw: string) => {
  const quoted = raw.match(/["']([^"']{12,220})["']/);
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
  const cachedParsed = cached?.outputJson ? aiReferenceListSchema.safeParse(cached.outputJson).data : null;
  if (cachedParsed) return cachedParsed;

  const aiResult = await getAiResponse<{ references: ParsedReference[] }>({
    context: references.slice(0, 40).map((ref, index) => `${index + 1}. ${ref}`).join("\n"),
    responseStyle: `Return a JSON object with one key: references. references is an array and each item has title, authors, year, doi, venue, url, rawReference, confidenceScore.`,
    restrictedAnswer: "Do not invent DOI or URL. Use null when unavailable.",
    responseTime: 12000,
    maxTokens: 2200,
    concurrency: 1,
    retryNumber: 1,
    maxModelBatches: 1,
  });
  const parsed = aiReferenceListSchema.safeParse(aiResult.data).data ?? fallbackReferences(references);
  await prisma.aiCache.upsert({
    where: { cacheKey },
    create: { cacheKey, taskType: "citation", modelName: aiResult.model, promptVersion: CITATION_PARSER_VERSION, inputHash: referencesHash, outputJson: parsed },
    update: { modelName: aiResult.model, outputJson: parsed },
  });
  return parsed;
};

const normalizeTitle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const semanticScholarFields = [
  "title",
  "authors",
  "year",
  "externalIds",
  "openAccessPdf",
  "url",
  "venue",
  "abstract",
  "citationCount",
].join(",");

const semanticScholarHeaders = () => ({
  "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)",
  "Content-Type": "application/json",
  ...(process.env.SEMANTIC_SCHOLAR_API_KEY
    ? { "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY }
    : {}),
});

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/** Small retry wrapper for the public scholarly API. Graph generation is a
 * background job, so a short 429/5xx backoff is preferable to dropping the
 * entire network snapshot. */
const semanticScholarRequest = async <T>(url: string, init: RequestInit = {}): Promise<T> => {
  let lastStatus = 0;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, {
      ...init,
      headers: { ...semanticScholarHeaders(), ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(12_000),
    });
    lastStatus = response.status;
    if (response.ok) return response.json() as Promise<T>;
    if (response.status !== 429 && response.status < 500) break;
    await wait(600 * (attempt + 1));
  }
  throw new Error(`Semantic Scholar request failed (${lastStatus || "network error"}).`);
};

const titleSimilarity = (left: string, right: string) => {
  const a = normalizeTitle(left).replace(/\bpdf\b/g, "").trim();
  const b = normalizeTitle(right).replace(/\bpdf\b/g, "").trim();
  if (!a || !b) return 0;
  if (a === b) return 1;
  const aTokens = new Set(a.split(" ").filter((token) => token.length > 1));
  const bTokens = new Set(b.split(" ").filter((token) => token.length > 1));
  const intersection = [...aTokens].filter((token) => bTokens.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size || 1;
  const overlap = intersection / union;
  return Math.min(1, overlap + (a.includes(b) || b.includes(a) ? 0.2 : 0));
};

const semanticPaperUrl = (paper: SemanticScholarPaper) => {
  const doi = normalizeDoi(paper.externalIds?.DOI);
  if (doi) return `https://doi.org/${doi}`;
  return paper.url ?? paper.openAccessPdf?.url ?? (paper.paperId
    ? `https://www.semanticscholar.org/paper/${paper.paperId}`
    : null);
};

const graphNodeFromSemanticPaper = (
  paper: SemanticScholarPaper,
  type: ResearchGraphNode["type"],
  relation: "CITED_BY" | "RELATED",
  depth: number,
  extra: Record<string, unknown> = {},
): ResearchGraphNode | null => {
  if (!paper.paperId || !paper.title) return null;
  return {
    id: `s2:${paper.paperId}`,
    type,
    label: paper.title,
    data: {
      title: paper.title,
      authors: paper.authors?.map((author) => author.name).filter(Boolean) ?? [],
      publicationYear: paper.year ?? null,
      venue: paper.venue ?? null,
      citationCount: paper.citationCount ?? null,
      abstract: paper.abstract ?? null,
      doi: normalizeDoi(paper.externalIds?.DOI),
      url: semanticPaperUrl(paper),
      openAccessUrl: paper.openAccessPdf?.url ?? null,
      semanticScholarId: paper.paperId,
      relation,
      depth,
      ...extra,
    },
  };
};

const graphEdge = (
  source: string,
  target: string,
  type: ResearchGraphEdge["type"],
  confidenceScore = 1,
): ResearchGraphEdge => ({
  id: `graph:${hash(`${source}|${target}|${type}`).slice(0, 20)}`,
  source,
  target,
  type,
  label: type === "CITED_BY" ? "Cited by" : type === "RELATED" ? "Related work" : "References",
  confidenceScore,
});

const resolveSemanticScholarRoot = async (resource: {
  title: string;
  tags: string[];
  authors?: string[];
  extractedText?: string | null;
}) => {
  const identity = resource.extractedText
    ? inferPaperIdentity(resource.extractedText, resource)
    : {
        detectedTitle: resource.title,
        detectedAuthors: resource.authors ?? [],
        sourceType: "EXTRACTED_TEXT" as const,
        titleMismatch: false,
      };
  const queryTitle = identity.detectedTitle || resource.title;
  // A tag belonging to a wrongly titled resource can resolve to a completely
  // different paper. Only trust tag-based DOI lookup when the title agrees
  // with the identity detected inside the document.
  const doi = (identity.titleMismatch ? [] : resource.tags)
    .map((tag) => normalizeDoi(tag))
    .find((tag) => Boolean(tag && /^10\.\d{4,9}\//.test(tag)));
  const cacheKey = `s2:research-root:v${RESEARCH_GRAPH_VERSION}:${doi ?? normalizeTitle(queryTitle)}`;
  const cached = await prisma.metadataCache.findUnique({ where: { cacheKey } }).catch(() => null);
  if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) {
    return cached.resultJson as SemanticScholarPaper;
  }

  let match: SemanticScholarPaper | null = null;
  if (doi) {
    match = await semanticScholarRequest<SemanticScholarPaper>(
      `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=${semanticScholarFields}`,
    ).catch(() => null);
  }
  if (!match?.paperId) {
    const result = await semanticScholarRequest<{ data?: SemanticScholarPaper[] }>(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(queryTitle)}&limit=5&fields=${semanticScholarFields}`,
    );
    const ranked = (result.data ?? [])
      .map((paper) => ({ paper, score: titleSimilarity(queryTitle, paper.title ?? "") }))
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];
    match = best && best.score >= 0.42 ? best.paper : null;
  }
  if (!match?.paperId) return null;

  await prisma.metadataCache.upsert({
    where: { cacheKey },
    create: {
      cacheKey,
      source: "semantic-scholar",
      query: doi ?? queryTitle,
      resultJson: match as any,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    update: {
      resultJson: match as any,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });
  return match;
};

const fetchCitingPapers = async (paperId: string, limit: number) => {
  const response = await semanticScholarRequest<{ data?: SemanticScholarCitation[] }>(
    `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(paperId)}/citations?limit=${limit}&fields=contexts,isInfluential,${semanticScholarFields}`,
  );
  return (response.data ?? [])
    .filter((citation) => Boolean(citation.citingPaper?.paperId && citation.citingPaper?.title))
    .sort((left, right) => {
      const influence = Number(Boolean(right.isInfluential)) - Number(Boolean(left.isInfluential));
      if (influence) return influence;
      return (right.citingPaper?.citationCount ?? 0) - (left.citingPaper?.citationCount ?? 0);
    });
};

const fetchReferencedPapers = async (paperId: string, limit = 40) => {
  const response = await semanticScholarRequest<{ data?: SemanticScholarReference[] }>(
    `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(paperId)}/references?limit=${limit}&fields=contexts,isInfluential,${semanticScholarFields}`,
  );
  return (response.data ?? [])
    .filter((reference) => Boolean(reference.citedPaper?.paperId && reference.citedPaper?.title))
    .sort((left, right) => {
      const influence = Number(Boolean(right.isInfluential)) - Number(Boolean(left.isInfluential));
      if (influence) return influence;
      return (right.citedPaper?.citationCount ?? 0) - (left.citedPaper?.citationCount ?? 0);
    });
};

const persistSemanticScholarReferences = async (
  resourceId: string,
  rootPaper: SemanticScholarPaper,
) => {
  if (!rootPaper.paperId) return 0;
  const references = await fetchReferencedPapers(rootPaper.paperId);
  if (!references.length) return 0;

  await prisma.$transaction(async (tx) => {
    await tx.resourceCitationEdge.deleteMany({
      where: { sourceResourceId: resourceId, resolverSource: "semantic-scholar-graph" },
    });
    for (const [index, reference] of references.entries()) {
      const paper = reference.citedPaper!;
      const doi = normalizeDoi(paper.externalIds?.DOI);
      const authors = paper.authors?.map((author) => author.name).filter(Boolean).join(", ") || null;
      const data = {
        title: paper.title!,
        authors,
        publicationYear: paper.year ?? null,
        venue: paper.venue ?? null,
        doi,
        url: semanticPaperUrl(paper),
        semanticScholarId: paper.paperId!,
        metadataSource: "semantic-scholar",
        metadataConfidence: reference.isInfluential ? 0.99 : 0.96,
      };
      const external = doi
        ? await tx.externalCitationTarget.upsert({ where: { doi }, create: data, update: data })
        : await tx.externalCitationTarget.upsert({
            where: { semanticScholarId: paper.paperId! },
            create: data,
            update: data,
          });
      const authorPrefix = authors ? `${authors}. ` : "";
      const year = paper.year ? `(${paper.year}). ` : "";
      const venue = paper.venue ? ` ${paper.venue}.` : "";
      await tx.resourceCitationEdge.create({
        data: {
          sourceResourceId: resourceId,
          externalTargetId: external.id,
          relationType: "REFERENCES",
          rawReference: `${authorPrefix}${year}${paper.title}.${venue}${doi ? ` https://doi.org/${doi}` : ""}`.trim(),
          contextSnippet: reference.contexts?.[0]?.slice(0, 1200) ?? null,
          referenceIndex: index + 1,
          confidenceScore: reference.isInfluential ? 0.99 : 0.96,
          resolverSource: "semantic-scholar-graph",
          parserVersion: CITATION_PARSER_VERSION,
        },
      });
    }
  }, { timeout: 30_000 });
  return references.length;
};

const fetchRelatedPapers = async (paperId: string) => {
  const response = await semanticScholarRequest<{ recommendedPapers?: SemanticScholarPaper[] }>(
    `https://api.semanticscholar.org/recommendations/v1/papers?limit=${RESEARCH_GRAPH_RELATED_LIMIT}&fields=${semanticScholarFields}`,
    {
      method: "POST",
      body: JSON.stringify({ positivePaperIds: [paperId], negativePaperIds: [] }),
    },
  );
  return response.recommendedPapers ?? [];
};

const openAlexRequest = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: { "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)", Accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`OpenAlex request failed (${response.status}).`);
  const payload: unknown = await response.json();
  // Some edge proxies return a JSON-encoded JSON string. Accept both shapes.
  return (typeof payload === "string" ? JSON.parse(payload) : payload) as T;
};

const openAlexShortId = (value?: string | null) => value?.match(/W\d+$/)?.[0] ?? null;
const openAlexDoi = (value?: string | null) => normalizeDoi(value?.replace(/^https?:\/\/doi\.org\//i, ""));

const openAlexAbstract = (index?: Record<string, number[]> | null) => {
  if (!index) return null;
  const words: Array<[number, string]> = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) words.push([position, word]);
  }
  return words.sort((left, right) => left[0] - right[0]).map((entry) => entry[1]).join(" ") || null;
};

const openAlexWorkUrl = (work: OpenAlexWork) => {
  const doi = openAlexDoi(work.doi);
  if (doi) return `https://doi.org/${doi}`;
  return work.primary_location?.landing_page_url ?? work.primary_location?.pdf_url ?? work.id ?? null;
};

const graphNodeFromOpenAlexWork = (
  work: OpenAlexWork,
  type: ResearchGraphNode["type"],
  relation: "CITED_BY" | "RELATED",
  depth: number,
): ResearchGraphNode | null => {
  const openAlexId = openAlexShortId(work.id);
  const title = work.title ?? work.display_name;
  if (!openAlexId || !title) return null;
  return {
    id: `openalex:${openAlexId}`,
    type,
    label: title,
    data: {
      title,
      authors: work.authorships?.map((authorship) => authorship.author?.display_name).filter(Boolean) ?? [],
      publicationYear: work.publication_year ?? null,
      venue: work.primary_location?.source?.display_name ?? null,
      citationCount: work.cited_by_count ?? null,
      abstract: openAlexAbstract(work.abstract_inverted_index),
      doi: openAlexDoi(work.doi),
      url: openAlexWorkUrl(work),
      openAccessUrl: work.primary_location?.pdf_url ?? null,
      openAlexId,
      relation,
      depth,
    },
  };
};

const resolveOpenAlexRoot = async (title: string) => {
  const response = await openAlexRequest<{ results?: OpenAlexWork[] }>(
    `https://api.openalex.org/works?search=${encodeURIComponent(title)}&per-page=10`,
  );
  const ranked = (response.results ?? [])
    .map((work) => ({ work, score: titleSimilarity(title, work.title ?? work.display_name ?? "") }))
    .filter((candidate) => candidate.score >= 0.42)
    .sort((left, right) => right.score - left.score || (right.work.cited_by_count ?? 0) - (left.work.cited_by_count ?? 0));
  const root = ranked[0]?.work ?? null;
  if (!root) return null;
  const publishedVariant = ranked
    .map((candidate) => candidate.work)
    .filter((work) => {
      const doi = openAlexDoi(work.doi);
      return Boolean(doi && !doi.startsWith("10.48550/arxiv."));
    })
    .sort((left, right) => (right.publication_year ?? 0) - (left.publication_year ?? 0))[0];
  return { root, publishedDoi: openAlexDoi(publishedVariant?.doi) ?? openAlexDoi(root.doi) };
};

const fetchOpenAlexCitingWorks = async (workId: string, limit: number) => {
  const response = await openAlexRequest<{ results?: OpenAlexWork[] }>(
    `https://api.openalex.org/works?filter=cites:${encodeURIComponent(workId)}&sort=cited_by_count:desc&per-page=${limit}`,
  );
  return response.results ?? [];
};

const fetchOpenAlexWorksByIds = async (ids: string[]) => {
  const shortIds = ids.map((id) => openAlexShortId(id)).filter((id): id is string => Boolean(id)).slice(0, RESEARCH_GRAPH_RELATED_LIMIT);
  if (!shortIds.length) return [];
  const response = await openAlexRequest<{ results?: OpenAlexWork[] }>(
    `https://api.openalex.org/works?filter=openalex_id:${shortIds.map(encodeURIComponent).join("|")}&per-page=${shortIds.length}`,
  );
  return response.results ?? [];
};

type CrossrefReference = {
  DOI?: string;
  author?: string;
  year?: string;
  "article-title"?: string;
  "journal-title"?: string;
  unstructured?: string;
};

const persistCrossrefReferences = async (resourceId: string, doi: string) => {
  const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: { "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Crossref reference request failed (${response.status}).`);
  const payload = await response.json() as { message?: { reference?: CrossrefReference[] } };
  const references = (payload.message?.reference ?? []).slice(0, 40);
  if (!references.length) return 0;

  const enriched: Array<{ reference: CrossrefReference; metadata: Record<string, any> | null }> = [];
  for (let offset = 0; offset < references.length; offset += 5) {
    const batch = references.slice(offset, offset + 5);
    const resolved = await Promise.all(batch.map(async (reference) => {
      const referenceDoi = normalizeDoi(reference.DOI);
      if (!referenceDoi) return null;
      return lookupCrossref({
        title: reference["article-title"] ?? null,
        authors: reference.author ? [reference.author] : [],
        year: reference.year ? Number(reference.year) || null : null,
        doi: referenceDoi,
        venue: reference["journal-title"] ?? null,
        url: null,
        rawReference: reference.unstructured ?? null,
        confidenceScore: 0.96,
      }).catch(() => null);
    }));
    enriched.push(...batch.map((reference, index) => ({ reference, metadata: resolved[index] ?? null })));
  }

  await prisma.$transaction(async (tx) => {
    await tx.resourceCitationEdge.deleteMany({
      where: { sourceResourceId: resourceId, resolverSource: "crossref-graph" },
    });
    for (const [index, item] of enriched.entries()) {
      const referenceDoi = normalizeDoi(item.reference.DOI);
      const title = item.metadata?.title
        ?? item.reference["article-title"]
        ?? item.reference.unstructured
        ?? (referenceDoi ? `DOI ${referenceDoi}` : `Reference ${index + 1}`);
      const publicationYear = item.metadata?.publicationYear
        ?? (item.reference.year ? Number(item.reference.year) || null : null);
      const url = item.metadata?.url
        ?? (referenceDoi ? `https://doi.org/${referenceDoi}` : `https://search.crossref.org/?q=${encodeURIComponent(title)}`);
      const data = {
        title: String(title).slice(0, 500),
        authors: item.metadata?.authors ?? item.reference.author ?? null,
        publicationYear,
        venue: item.metadata?.venue ?? item.reference["journal-title"] ?? null,
        doi: item.metadata?.doi ?? referenceDoi,
        url,
        metadataSource: "crossref",
        metadataConfidence: referenceDoi ? 0.97 : 0.78,
      };
      const external = data.doi
        ? await tx.externalCitationTarget.upsert({ where: { doi: data.doi }, create: data, update: data })
        : await tx.externalCitationTarget.create({ data });
      await tx.resourceCitationEdge.create({
        data: {
          sourceResourceId: resourceId,
          externalTargetId: external.id,
          relationType: "REFERENCES",
          rawReference: item.reference.unstructured
            ?? [item.reference.author, item.reference.year && `(${item.reference.year})`, title, item.reference["journal-title"], referenceDoi].filter(Boolean).join(". "),
          referenceIndex: index + 1,
          confidenceScore: referenceDoi ? 0.97 : 0.78,
          resolverSource: "crossref-graph",
          parserVersion: CITATION_PARSER_VERSION,
        },
      });
    }
  }, { timeout: 30_000 });
  return enriched.length;
};

const buildReferenceGraph = async (resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      title: true,
      description: true,
      authors: true,
      year: true,
      tags: true,
      extractedText: { select: { cleanedText: true } },
      citationsFrom: {
        include: {
          targetResource: { select: { id: true, title: true, authors: true, year: true, fileUrl: true } },
          externalTarget: true,
        },
        orderBy: [{ referenceIndex: "asc" }, { createdAt: "asc" }],
      },
    },
  });
  if (!resource) throw new AppError(404, "Resource not found.");

  const identity = resource.extractedText?.cleanedText
    ? inferPaperIdentity(resource.extractedText.cleanedText, resource)
    : {
        detectedTitle: resource.title,
        detectedAuthors: resource.authors,
        sourceType: "EXTRACTED_TEXT" as const,
        titleMismatch: false,
      };

  const rootId = `resource:${resource.id}`;
  const nodes = new Map<string, ResearchGraphNode>();
  const edges = new Map<string, ResearchGraphEdge>();
  nodes.set(rootId, {
    id: rootId,
    type: "current-resource",
    label: identity.detectedTitle,
    data: {
      title: identity.detectedTitle,
      storedTitle: resource.title,
      description: resource.description,
      authors: identity.detectedAuthors.length ? identity.detectedAuthors : resource.authors,
      publicationYear: resource.year,
      relation: "ROOT",
      depth: 0,
      sourceType: identity.sourceType,
      titleMismatch: identity.titleMismatch,
    },
  });

  for (const citation of resource.citationsFrom) {
    const target = citation.targetResource ?? citation.externalTarget;
    const targetId = citation.targetResource
      ? `resource:${citation.targetResource.id}`
      : citation.externalTarget
        ? `external:${citation.externalTarget.id}`
        : `reference:${citation.id}`;
    const targetTitle = target?.title ?? citation.rawReference ?? "Unresolved reference";
    nodes.set(targetId, {
      id: targetId,
      type: "reference-paper",
      label: targetTitle,
      data: {
        title: targetTitle,
        authors: target?.authors ?? null,
        publicationYear: "year" in (target ?? {})
          ? (target as { year?: number | null }).year ?? null
          : (target as { publicationYear?: number | null } | null)?.publicationYear ?? null,
        venue: "venue" in (target ?? {}) ? (target as { venue?: string | null }).venue ?? null : null,
        doi: "doi" in (target ?? {}) ? (target as { doi?: string | null }).doi ?? null : null,
        url: "url" in (target ?? {})
          ? (target as { url?: string | null }).url ?? null
          : "fileUrl" in (target ?? {})
            ? (target as { fileUrl?: string | null }).fileUrl ?? null
            : null,
        relation: "REFERENCES",
        depth: -1,
        referenceIndex: citation.referenceIndex,
      },
    });
    const edge = graphEdge(rootId, targetId, "REFERENCES", citation.confidenceScore ?? 0.55);
    edges.set(edge.id, edge);
  }
  return { resource, identity, rootId, nodes, edges };
};

/** Build and persist a Connected-Papers-style hybrid network: parsed
 * references, papers citing the selected paper, one additional cited-by
 * generation, and provider-recommended related work. */
export const rebuildResourceResearchGraph = async (resourceId: string) => {
  const { resource, identity, rootId, nodes, edges } = await buildReferenceGraph(resourceId);
  let providerPaperId: string | null = null;
  let citationCount: number | null = null;
  let providerWarning: string | null = null;
  let graphProvider = "local-references";

  try {
    const rootPaper = await resolveSemanticScholarRoot({
      title: resource.title,
      authors: resource.authors,
      tags: resource.tags,
      extractedText: resource.extractedText?.cleanedText ?? null,
    });
    if (!rootPaper?.paperId) {
      providerWarning = "No confident Semantic Scholar match was found; showing the paper's parsed references only.";
    } else {
      providerPaperId = rootPaper.paperId;
      citationCount = rootPaper.citationCount ?? null;
      graphProvider = "semantic-scholar";

      // Prepared summaries and excerpts often omit the bibliography entirely.
      // Once the document is confidently matched, use the provider's official
      // outgoing references and persist them so the References tab is useful,
      // clickable, and stable across page reloads.
      const hasReferenceEdges = [...edges.values()].some((edge) => edge.type === "REFERENCES");
      if (!hasReferenceEdges) {
        let persistedCount = await persistSemanticScholarReferences(resourceId, rootPaper).catch(() => 0);
        if (!persistedCount) {
          const openAlexMatch = await resolveOpenAlexRoot(identity.detectedTitle).catch(() => null);
          if (openAlexMatch?.publishedDoi) {
            persistedCount = await persistCrossrefReferences(resourceId, openAlexMatch.publishedDoi).catch(() => 0);
          }
        }
        if (persistedCount) {
          const refreshed = await buildReferenceGraph(resourceId);
          for (const [id, node] of refreshed.nodes) nodes.set(id, node);
          for (const [id, edge] of refreshed.edges) edges.set(id, edge);
        }
      }
      const rootNode = nodes.get(rootId)!;
      nodes.set(rootId, {
        ...rootNode,
        data: {
          ...rootNode.data,
          providerPaperId,
          citationCount,
          venue: rootPaper.venue ?? null,
          doi: normalizeDoi(rootPaper.externalIds?.DOI),
          url: semanticPaperUrl(rootPaper),
        },
      });

      const firstLayer = await fetchCitingPapers(rootPaper.paperId, RESEARCH_GRAPH_FIRST_LAYER_LIMIT);
      for (const citation of firstLayer) {
        const node = graphNodeFromSemanticPaper(
          citation.citingPaper!,
          "citing-paper",
          "CITED_BY",
          1,
          { isInfluential: Boolean(citation.isInfluential), context: citation.contexts?.[0] ?? null },
        );
        if (!node) continue;
        nodes.set(node.id, node);
        const edge = graphEdge(rootId, node.id, "CITED_BY", citation.isInfluential ? 1 : 0.88);
        edges.set(edge.id, edge);
      }

      const secondLayerParents = firstLayer.slice(0, RESEARCH_GRAPH_SECOND_LAYER_PARENTS);
      for (const parentCitation of secondLayerParents) {
        const parent = parentCitation.citingPaper;
        if (!parent?.paperId) continue;
        const grandchildren = await fetchCitingPapers(parent.paperId, RESEARCH_GRAPH_SECOND_LAYER_LIMIT).catch(() => []);
        for (const citation of grandchildren) {
          if (citation.citingPaper?.paperId === rootPaper.paperId) continue;
          const node = graphNodeFromSemanticPaper(
            citation.citingPaper!,
            "second-layer-paper",
            "CITED_BY",
            2,
            { isInfluential: Boolean(citation.isInfluential), context: citation.contexts?.[0] ?? null },
          );
          if (!node) continue;
          nodes.set(node.id, node);
          const edge = graphEdge(`s2:${parent.paperId}`, node.id, "CITED_BY", citation.isInfluential ? 0.96 : 0.82);
          edges.set(edge.id, edge);
        }
      }

      const related = await fetchRelatedPapers(rootPaper.paperId).catch(() => []);
      for (const paper of related) {
        if (!paper.paperId || paper.paperId === rootPaper.paperId || nodes.has(`s2:${paper.paperId}`)) continue;
        const node = graphNodeFromSemanticPaper(paper, "related-paper", "RELATED", 1);
        if (!node) continue;
        nodes.set(node.id, node);
        const edge = graphEdge(rootId, node.id, "RELATED", 0.76);
        edges.set(edge.id, edge);
      }
    }
  } catch (error: unknown) {
    providerWarning = error instanceof Error ? error.message : "The scholarly graph provider was unavailable.";
    providerPaperId = null;
    citationCount = null;
    graphProvider = "local-references";
    for (const id of [...nodes.keys()]) if (id.startsWith("s2:")) nodes.delete(id);
    for (const [id, edge] of [...edges.entries()]) {
      if (edge.source.startsWith("s2:") || edge.target.startsWith("s2:")) edges.delete(id);
    }
  }

  if (!providerPaperId) {
    try {
      const match = await resolveOpenAlexRoot(identity.detectedTitle);
      const rootWork = match?.root;
      const openAlexId = openAlexShortId(rootWork?.id);
      if (!rootWork || !openAlexId) throw new Error("No confident OpenAlex match was found.");

      providerPaperId = openAlexId;
      citationCount = rootWork.cited_by_count ?? null;
      graphProvider = "openalex";
      providerWarning = null;

      const hasReferenceEdges = [...edges.values()].some((edge) => edge.type === "REFERENCES");
      if (!hasReferenceEdges && match.publishedDoi) {
        const persistedCount = await persistCrossrefReferences(resourceId, match.publishedDoi).catch(() => 0);
        if (persistedCount) {
          const refreshed = await buildReferenceGraph(resourceId);
          for (const [id, node] of refreshed.nodes) nodes.set(id, node);
          for (const [id, edge] of refreshed.edges) edges.set(id, edge);
        }
      }

      const rootNode = nodes.get(rootId)!;
      nodes.set(rootId, {
        ...rootNode,
        data: {
          ...rootNode.data,
          providerPaperId: openAlexId,
          citationCount,
          venue: rootWork.primary_location?.source?.display_name ?? null,
          doi: openAlexDoi(rootWork.doi),
          url: openAlexWorkUrl(rootWork),
        },
      });

      const firstLayer = await fetchOpenAlexCitingWorks(openAlexId, RESEARCH_GRAPH_FIRST_LAYER_LIMIT);
      for (const work of firstLayer) {
        const node = graphNodeFromOpenAlexWork(work, "citing-paper", "CITED_BY", 1);
        if (!node) continue;
        nodes.set(node.id, node);
        const edge = graphEdge(rootId, node.id, "CITED_BY", 0.9);
        edges.set(edge.id, edge);
      }

      for (const parent of firstLayer.slice(0, RESEARCH_GRAPH_SECOND_LAYER_PARENTS)) {
        const parentId = openAlexShortId(parent.id);
        if (!parentId) continue;
        const grandchildren = await fetchOpenAlexCitingWorks(parentId, RESEARCH_GRAPH_SECOND_LAYER_LIMIT).catch(() => []);
        for (const work of grandchildren) {
          const childId = openAlexShortId(work.id);
          if (!childId || childId === openAlexId) continue;
          const node = graphNodeFromOpenAlexWork(work, "second-layer-paper", "CITED_BY", 2);
          if (!node) continue;
          nodes.set(node.id, node);
          const edge = graphEdge(`openalex:${parentId}`, node.id, "CITED_BY", 0.84);
          edges.set(edge.id, edge);
        }
      }

      const related = await fetchOpenAlexWorksByIds(rootWork.related_works ?? []).catch(() => []);
      for (const work of related) {
        const relatedId = openAlexShortId(work.id);
        if (!relatedId || relatedId === openAlexId || nodes.has(`openalex:${relatedId}`)) continue;
        const node = graphNodeFromOpenAlexWork(work, "related-paper", "RELATED", 1);
        if (!node) continue;
        nodes.set(node.id, node);
        const edge = graphEdge(rootId, node.id, "RELATED", 0.76);
        edges.set(edge.id, edge);
      }
    } catch (fallbackError: unknown) {
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : "OpenAlex was unavailable.";
      providerWarning = providerWarning
        ? `${providerWarning} ${fallbackMessage}`
        : fallbackMessage;
    }
  }

  const nodeRows = [...nodes.values()];
  const edgeRows = [...edges.values()];
  const snapshot = await prisma.resourceResearchGraph.upsert({
    where: { resourceId },
    create: {
      resourceId,
      provider: graphProvider,
      providerPaperId,
      graphVersion: RESEARCH_GRAPH_VERSION,
      nodes: nodeRows as any,
      edges: edgeRows as any,
      citationCount,
      generationStatus: "COMPLETED",
      generationError: providerWarning,
      generatedAt: new Date(),
    },
    update: {
      provider: graphProvider,
      providerPaperId,
      graphVersion: RESEARCH_GRAPH_VERSION,
      nodes: nodeRows as any,
      edges: edgeRows as any,
      citationCount,
      generationStatus: "COMPLETED",
      generationError: providerWarning,
      generatedAt: new Date(),
    },
  });

  return snapshot;
};

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

// ─── Semantic Scholar fallback resolver ─────────────────────────────────────
// Free, no API key required for low-volume usage.
// Used when CrossRef returns no URL or the reference has no DOI.
const lookupSemanticScholar = async (reference: ParsedReference) => {
  const doi = normalizeDoi(reference.doi);
  const cacheKey = doi
    ? `s2:doi:${doi}`
    : `s2:title:${normalizeTitle(reference.title ?? "")}:${reference.year ?? ""}`;
  const cached = await prisma.metadataCache.findUnique({ where: { cacheKey } }).catch(() => null);
  if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) return cached.resultJson as Record<string, any>;

  try {
    const fields = "title,authors,year,externalIds,openAccessPdf,url,venue,publicationDate";
    let apiUrl: string;
    if (doi) {
      apiUrl = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=${fields}`;
    } else if (reference.title) {
      apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(reference.title)}&limit=1&fields=${fields}`;
    } else {
      return null;
    }

    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const json: any = await response.json();
    const item = doi ? json : json.data?.[0];
    if (!item || !item.paperId) return null;

    const openUrl = item.openAccessPdf?.url ?? item.url ?? null;
    const resolvedDoi = item.externalIds?.DOI?.toLowerCase() ?? doi;
    const result = {
      title: item.title ?? reference.title,
      authors: Array.isArray(item.authors) ? item.authors.map((a: any) => a.name).filter(Boolean).join(", ") : null,
      publicationYear: item.year ?? reference.year ?? null,
      venue: item.venue ?? null,
      doi: resolvedDoi,
      // Prefer DOI-based link; fall back to open-access PDF URL
      url: resolvedDoi ? `https://doi.org/${resolvedDoi}` : openUrl,
      semanticScholarId: item.paperId,
      metadataSource: "semantic-scholar",
      metadataConfidence: doi ? 0.94 : 0.75,
    };
    await prisma.metadataCache.upsert({
      where: { cacheKey },
      create: { cacheKey, source: "semantic-scholar", query: doi ?? reference.title ?? "", resultJson: result, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
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

  // Try CrossRef first, Semantic Scholar as fallback
  let metadata = await lookupCrossref(reference);
  if (!metadata?.url && !metadata?.doi) {
    const s2 = await lookupSemanticScholar(reference);
    if (s2) metadata = s2;
  }

  const data = {
    title: metadata?.title ?? title,
    authors: metadata?.authors ?? (reference.authors?.length ? reference.authors.join(", ") : null),
    publicationYear: metadata?.publicationYear ?? reference.year ?? null,
    venue: metadata?.venue ?? reference.venue ?? null,
    doi: metadata?.doi ?? doi,
    url: metadata?.url ?? (metadata?.doi ? `https://doi.org/${metadata.doi}` : reference.url) ?? null,
    // openAccessUrl is NOT a column on ExternalCitationTarget — store it in url instead
    semanticScholarId: (metadata as { semanticScholarId?: string | null } | null)?.semanticScholarId ?? null,
    metadataSource: metadata?.metadataSource ?? (doi ? "doi-parser" : "local-parser"),
    metadataConfidence: metadata?.metadataConfidence ?? reference.confidenceScore ?? 0.55,
  };

  // semanticScholarId is unique — only upsert on it when we have a value
  const s2Id = data.semanticScholarId;
  const external =
    data.doi
      ? await prisma.externalCitationTarget.upsert({
          where: { doi: data.doi },
          create: data,
          update: data,
        })
      : s2Id
        ? await prisma.externalCitationTarget.upsert({
            where: { semanticScholarId: s2Id },
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

type AiProcessMode = "full" | "summary" | "citations" | "graph";

type QueuedResourceAiJob = {
  resourceId: string;
  queued: true;
  status: ResourceProcessingStatus;
  mode: AiProcessMode;
  alreadyRunning: boolean;
};

export const createResourceAiJobRegistry = () => {
  const activeJobs = new Map<string, Promise<void>>();

  return {
    has: (resourceId: string) => activeJobs.has(resourceId),
    size: () => activeJobs.size,
    start: (resourceId: string, run: () => Promise<void>) => {
      if (activeJobs.has(resourceId)) return false;
      const job = Promise.resolve()
        .then(run)
        .finally(() => activeJobs.delete(resourceId));
      activeJobs.set(resourceId, job);
      void job.catch((error: unknown) => {
        console.error("[resource-ai] background job failed", { resourceId, error });
      });
      return true;
    },
    clear: () => activeJobs.clear(),
  };
};

const resourceAiJobRegistry = createResourceAiJobRegistry();

const processingStatusForMode = (mode: AiProcessMode): ResourceProcessingStatus => {
  if (mode === "summary") return ResourceProcessingStatus.SUMMARY_PROCESSING;
  if (mode === "citations") return ResourceProcessingStatus.CITATION_PROCESSING;
  if (mode === "graph") return ResourceProcessingStatus.GRAPH_PROCESSING;
  return ResourceProcessingStatus.TEXT_PROCESSING;
};

const assertPdfResourceForAi = async (resourceId: string, feature: "AI processing" | "AI summary") => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError(404, "Resource not found.");
  if (!resource.fileType.toLowerCase().includes("pdf") && !resource.fileUrl.toLowerCase().endsWith(".pdf")) {
    throw new AppError(400, `${feature} is available for PDF resources only.`);
  }
  return resource;
};

const queueResourceAiJob = async (
  resource: ResourceForAi,
  mode: AiProcessMode,
  run: () => Promise<void>,
): Promise<QueuedResourceAiJob> => {
  const queuedStatus = processingStatusForMode(mode);

  if (resourceAiJobRegistry.has(resource.id)) {
    return {
      resourceId: resource.id,
      queued: true,
      status: resource.aiProcessingStatus,
      mode,
      alreadyRunning: true,
    };
  }

  await prisma.resource.update({
    where: { id: resource.id },
    data: { aiProcessingStatus: queuedStatus, processingError: null },
  });

  const started = resourceAiJobRegistry.start(resource.id, run);
  return {
    resourceId: resource.id,
    queued: true,
    status: queuedStatus,
    mode,
    alreadyRunning: !started,
  };
};

const runResourceAi = async (resource: ResourceForAi, options: { regenerateSummary?: boolean; reanalyzeCitations?: boolean } = {}) => {
  const resourceId = resource.id;
  try {
    await audit(resourceId, "resource-ai", "PROCESSING");
    const { extracted, textHash, fileHash } = await extractAndStoreResourceText(resource);
    const shared = await hydrateResourceAiFromExisting(resourceId, {
      fileHash,
      textHash,
      skipSummary: Boolean(options.regenerateSummary),
      skipCitations: Boolean(options.reanalyzeCitations),
    });

    if (!shared.copiedSummary) {
      await generateResourceSummary(resource, extracted.cleanedText, textHash, Boolean(options.regenerateSummary));
    }

    if (shared.copiedCitations > 0 && !options.reanalyzeCitations) {
      await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "GRAPH_PROCESSING" } });
      await rebuildResourceResearchGraph(resourceId);
      const updated = await prisma.resource.update({
        where: { id: resourceId },
        data: { aiProcessingStatus: "GRAPH_READY", lastProcessedAt: new Date(), processingError: null },
        include: { extractedText: true, aiSummary: true, citationsFrom: true },
      });
      await audit(resourceId, "resource-ai", "COMPLETED");
      return updated;
    }

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

    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "GRAPH_PROCESSING" } });
    await rebuildResourceResearchGraph(resourceId);
    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: { aiProcessingStatus: "GRAPH_READY", lastProcessedAt: new Date(), processingError: null },
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

export const processResourceAi = async (resourceId: string, options: { regenerateSummary?: boolean; reanalyzeCitations?: boolean } = {}) => {
  const resource = await assertPdfResourceForAi(resourceId, "AI processing");
  const mode = options.reanalyzeCitations && !options.regenerateSummary ? "citations" : "full";
  return queueResourceAiJob(resource, mode, async () => {
    await runResourceAi(resource, options);
  });
};

const extractAndStoreResourceText = async (resource: ResourceForAi) => {
  await prisma.resource.update({ where: { id: resource.id }, data: { aiProcessingStatus: "TEXT_PROCESSING", processingError: null } });

  const pdf = await fetchResourcePdf(resource.fileUrl);
  const fileHash = hash(pdf);
  const extracted = await extractPdfText(pdf);
  const textHash = hash(extracted.cleanedText);

  await prisma.resourceText.upsert({
    where: { resourceId: resource.id },
    create: { resourceId: resource.id, ...extracted, textHash, extractionMethod: PDF_EXTRACTION_METHOD },
    update: { ...extracted, textHash, extractionMethod: PDF_EXTRACTION_METHOD },
  });
  await prisma.resource.update({ where: { id: resource.id }, data: { fileHash, aiProcessingStatus: "TEXT_EXTRACTED" } });
  return { extracted, textHash, fileHash };
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

const runResourceSummary = async (resource: ResourceForAi, regenerate = false) => {
  const resourceId = resource.id;
  try {
    await audit(resourceId, "resource-summary", "PROCESSING");
    // Reuse already-extracted text if it exists and the stored fileHash matches
    // the resource's current fileHash — otherwise we'd needlessly re-fetch the
    // PDF and re-parse 60k+ characters on every regenerate call.
    const [existingText, existingSummary] = await Promise.all([
      prisma.resourceText.findUnique({ where: { resourceId } }),
      prisma.resourceSummary.findUnique({ where: { resourceId } }),
    ]);
    // Reuse extracted text + cached summary only when the user has NOT
    // explicitly clicked Regenerate. The completion flag guarantees the
    // stored summary matches the stored text.
    const reuseText =
      !regenerate &&
      existingText !== null &&
      existingText.cleanedText.length > 0 &&
      existingSummary?.generationStatus === "COMPLETED";

    if (reuseText && existingText && existingSummary) {
      await prisma.resource.update({
        where: { id: resourceId },
        data: { aiProcessingStatus: "SUMMARY_READY", lastProcessedAt: new Date(), processingError: null },
      });
      await audit(resourceId, "resource-summary", "COMPLETED");
      return existingSummary;
    }

    const extracted = await extractAndStoreResourceText(resource);
    const cleanedText = extracted.extracted.cleanedText;
    const textHash = extracted.textHash;
    const summary = await generateResourceSummary(resource, cleanedText, textHash, regenerate);
    await audit(resourceId, "resource-summary", "COMPLETED");
    return summary;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.resource.update({ where: { id: resourceId }, data: { aiProcessingStatus: "FAILED", processingError: message } });
    await audit(resourceId, "resource-summary", "FAILED", message);
    throw error;
  }
};

export const processResourceSummary = async (resourceId: string, regenerate = false) => {
  const resource = await assertPdfResourceForAi(resourceId, "AI summary");
  return queueResourceAiJob(resource, "summary", async () => {
    await runResourceSummary(resource, regenerate);
  });
};

const runResourceResearchGraph = async (resourceId: string) => {
  try {
    await audit(resourceId, "resource-research-graph", "PROCESSING");
    const graph = await rebuildResourceResearchGraph(resourceId);
    await prisma.resource.update({
      where: { id: resourceId },
      data: { aiProcessingStatus: "GRAPH_READY", lastProcessedAt: new Date(), processingError: null },
    });
    await audit(resourceId, "resource-research-graph", "COMPLETED");
    return graph;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.resource.update({
      where: { id: resourceId },
      data: { aiProcessingStatus: "FAILED", processingError: message },
    });
    await audit(resourceId, "resource-research-graph", "FAILED", message);
    throw error;
  }
};

export const processResourceResearchGraph = async (resourceId: string) => {
  const resource = await assertPdfResourceForAi(resourceId, "AI processing");
  return queueResourceAiJob(resource, "graph", async () => {
    await runResourceResearchGraph(resourceId);
  });
};

// How long a job can sit in a processing state before we consider it stuck.
const STUCK_JOB_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

const PROCESSING_STATES_SET = new Set<ResourceProcessingStatus>([
  ResourceProcessingStatus.TEXT_PROCESSING,
  ResourceProcessingStatus.TEXT_EXTRACTED,
  ResourceProcessingStatus.SUMMARY_PROCESSING,
  ResourceProcessingStatus.CITATION_PROCESSING,
  ResourceProcessingStatus.GRAPH_PROCESSING,
]);

export const getProcessingStatus = async (resourceId: string) => {
  let resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      aiProcessingStatus: true,
      lastProcessedAt: true,
      processingError: true,
      extractedText: { select: { id: true, pageCount: true, updatedAt: true } },
      aiSummary: { select: { id: true, isVisible: true, generationStatus: true, updatedAt: true } },
      researchGraph: { select: { id: true, provider: true, generatedAt: true, generationStatus: true } },
      _count: { select: { citationsFrom: true } },
    },
  });
  if (!resource) throw new AppError(404, "Resource not found.");

  // ── Stuck-job auto-recovery ────────────────────────────────────────────────
  // If the status is a processing state and no active job is registered in memory
  // AND lastProcessedAt is older than the threshold (or was never set), the job
  // was most likely killed by a server restart. Reset to FAILED so users can retry.
  if (
    PROCESSING_STATES_SET.has(resource.aiProcessingStatus) &&
    !resourceAiJobRegistry.has(resourceId)
  ) {
    const lastActivity = resource.lastProcessedAt?.getTime() ?? 0;
    const isStuck = Date.now() - lastActivity > STUCK_JOB_THRESHOLD_MS;
    if (isStuck) {
      resource = await prisma.resource.update({
        where: { id: resourceId },
        data: {
          aiProcessingStatus: ResourceProcessingStatus.FAILED,
          processingError: "Processing job was interrupted (server restart or timeout). Click \"Re-process\" to try again.",
        },
        select: {
          id: true,
          aiProcessingStatus: true,
          lastProcessedAt: true,
          processingError: true,
          extractedText: { select: { id: true, pageCount: true, updatedAt: true } },
          aiSummary: { select: { id: true, isVisible: true, generationStatus: true, updatedAt: true } },
          researchGraph: { select: { id: true, provider: true, generatedAt: true, generationStatus: true } },
          _count: { select: { citationsFrom: true } },
        },
      });
      await audit(resourceId, "stuck-job-recovery", "FAILED", "Stuck job auto-recovered");
    }
  }

  return {
    resourceId,
    status: resource.aiProcessingStatus,
    lastProcessedAt: resource.lastProcessedAt,
    processingError: resource.processingError,
    text: resource.extractedText ? { status: "READY", pageCount: resource.extractedText.pageCount, updatedAt: resource.extractedText.updatedAt } : { status: "PENDING" },
    summary: resource.aiSummary ? { status: resource.aiSummary.generationStatus, isVisible: resource.aiSummary.isVisible, updatedAt: resource.aiSummary.updatedAt } : { status: "PENDING" },
    citations: { status: resource._count.citationsFrom > 0 ? "READY" : "PENDING", count: resource._count.citationsFrom },
    graph: resource.researchGraph
      ? { status: resource.researchGraph.generationStatus, provider: resource.researchGraph.provider, generatedAt: resource.researchGraph.generatedAt }
      : { status: "PENDING" },
  };
};

export const getSummary = async (resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      title: true,
      authors: true,
      aiProcessingStatus: true,
      processingError: true,
      extractedText: { select: { cleanedText: true } },
      aiSummary: true,
    },
  });
  if (!resource) throw new AppError(404, "Resource not found.");
  const identity = resource.extractedText?.cleanedText
    ? inferPaperIdentity(resource.extractedText.cleanedText, resource)
    : {
        detectedTitle: resource.title,
        detectedAuthors: resource.authors,
        sourceType: "EXTRACTED_TEXT" as const,
        titleMismatch: false,
      };
  const warning = identity.sourceType === "RESEARCH_SUMMARY"
    ? "This result is grounded in a prepared research summary rather than the complete paper. Verify fine-grained claims against the original publication."
    : identity.titleMismatch
      ? "The paper title detected inside the document differs from the resource title. The summary uses the detected document identity."
      : null;
  return {
    resourceId,
    status: resource.aiProcessingStatus,
    processingError: resource.processingError,
    summaryStatus: resource.aiSummary ? (resource.aiSummary.isVisible ? resource.aiSummary.generationStatus : "HIDDEN") : "PENDING",
    summary: resource.aiSummary?.isVisible ? resource.aiSummary : null,
    documentIdentity: {
      storedTitle: resource.title,
      detectedTitle: identity.detectedTitle,
      detectedAuthors: identity.detectedAuthors,
      sourceType: identity.sourceType,
      titleMismatch: identity.titleMismatch,
      warning,
    },
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
  const snapshot = await prisma.resourceResearchGraph.findUnique({ where: { resourceId } });
  if (snapshot) {
    const snapshotNodes = Array.isArray(snapshot.nodes) ? snapshot.nodes as unknown as ResearchGraphNode[] : [];
    const snapshotEdges = Array.isArray(snapshot.edges) ? snapshot.edges as unknown as ResearchGraphEdge[] : [];
    const filteredEdges = snapshotEdges
      .filter((edge) => (edge.confidenceScore ?? 0) >= minConfidence)
      .filter((edge) => includeExternal || (!edge.source.startsWith("external:") && !edge.target.startsWith("external:") && !edge.source.startsWith("s2:") && !edge.target.startsWith("s2:")))
      .slice(0, limit);
    const visibleNodeIds = new Set(filteredEdges.flatMap((edge) => [edge.source, edge.target]));
    visibleNodeIds.add(`resource:${resourceId}`);
    const nodes = snapshotNodes.filter((node) => visibleNodeIds.has(node.id));
    return {
      resourceId,
      nodes,
      edges: filteredEdges,
      generatedAt: snapshot.generatedAt,
      provider: snapshot.provider,
      providerPaperId: snapshot.providerPaperId,
      citationCount: snapshot.citationCount,
      graphVersion: snapshot.graphVersion,
      warning: snapshot.generationError,
      stats: {
        references: filteredEdges.filter((edge) => edge.type === "REFERENCES").length,
        citedBy: filteredEdges.filter((edge) => edge.type === "CITED_BY" && edge.source === `resource:${resourceId}`).length,
        secondLayer: filteredEdges.filter((edge) => edge.type === "CITED_BY" && edge.source !== `resource:${resourceId}`).length,
        related: filteredEdges.filter((edge) => edge.type === "RELATED").length,
      },
    };
  }
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

  return {
    resourceId,
    nodes: [...nodes.values()],
    edges: graphEdges,
    generatedAt: null,
    provider: "legacy-reference-graph",
    providerPaperId: null,
    citationCount: null,
    graphVersion: 0,
    warning: "Rebuild the graph to add cited-by layers and related work.",
    stats: {
      references: graphEdges.length,
      citedBy: 0,
      secondLayer: 0,
      related: 0,
    },
  };
};

/**
 * Return a short preview of the extracted text so the frontend can show the
 * user what the AI is going to summarize before they trigger generation.
 * We deliberately do NOT return the full extractedText (it can be 60k+ chars)
 * — just the first `maxChars` characters plus page count metadata. If no
 * extraction has happened yet we return a `{ status: "PENDING" }` envelope so
 * the UI can distinguish "text exists but no summary yet" from "PDF hasn't
 * been read at all".
 */
const PREVIEW_DEFAULT_CHARS = 1800;
const PREVIEW_MAX_CHARS = 6000;

export const getExtractedTextPreview = async (resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      title: true,
      fileType: true,
      extractedText: {
        select: { cleanedText: true, pageCount: true, updatedAt: true, language: true },
      },
    },
  });
  if (!resource) throw new AppError(404, "Resource not found.");
  if (!resource.extractedText) {
    return {
      resourceId: resource.id,
      title: resource.title,
      fileType: resource.fileType,
      status: "PENDING" as const,
      preview: null,
      pageCount: null,
      totalChars: 0,
    };
  }
  const maxChars = Math.min(PREVIEW_MAX_CHARS, Math.max(120, PREVIEW_DEFAULT_CHARS));
  const cleaned = resource.extractedText.cleanedText ?? "";
  const preview = cleaned.slice(0, maxChars);
  return {
    resourceId: resource.id,
    title: resource.title,
    fileType: resource.fileType,
    status: "READY" as const,
    preview,
    pageCount: resource.extractedText.pageCount ?? null,
    language: resource.extractedText.language ?? null,
    totalChars: cleaned.length,
    truncated: cleaned.length > preview.length,
    updatedAt: resource.extractedText.updatedAt,
  };
};

export const __resourceAiInternals = {
  extractPdfText,
  prepareAcademicText,
  inferPaperIdentity,
  structuredPackFallback,
  fallbackSummary,
  getOrCreateSummary,
  splitReferences,
  detectReferenceSection,
  titleSimilarity,
  graphNodeFromSemanticPaper,
  persistCrossrefReferences,
};
