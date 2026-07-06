import crypto from "crypto";
import { extractText, getDocumentProxy } from "unpdf";
import { z } from "zod";
import AppError from "../../errorHelpers/AppError";
import { ResourceProcessingStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { getAiResponse, repairModelJson } from "../../utils/aiResponse";
import { cloudinaryUpload } from "../../config/cloudinary.config";

const SUMMARY_PROMPT_VERSION = 2;
const CITATION_PARSER_VERSION = 1;
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
  const firstParagraph = cleanedText.split(/\n{2,}/).find((part) => part.length > 140) ?? resource.description ?? cleanedText.slice(0, 700);
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
  const prompt = `Paper/resource title: ${resource.title}\nAuthors: ${resource.authors?.join(", ") || "Unknown"}\nDescription: ${resource.description || ""}\n\nExtracted text:\n${cleanedText.slice(0, MAX_AI_CONTEXT_CHARS)}`;

  // Tighter response-style description + explicit bilingual requirement.
  const responseStyle = [
    `Return a single JSON object only. No markdown fences, no prose, no commentary.`,
    `Required top-level keys (all must be present, even if empty):`,
    `- "professionalSummary"  (English, 3-6 sentences, dense academic prose)`,
    `- "goals"               (English, 1-3 sentences or null)`,
    `- "methods"             (English, 1-3 sentences or null)`,
    `- "results"             (English, 1-3 sentences or null)`,
    `- "conclusions"         (English, 1-3 sentences or null)`,
    `- "keyContributions"    (English, array of 0-8 short noun phrases)`,
    `- "limitations"         (English, array of 0-8 short noun phrases)`,
    `- "keywords"            (English, array of 0-12 short noun phrases)`,
    `- "professionalSummaryBn" (BANGLA — fluent native বাংলা, NOT transliteration, same length and meaning as professionalSummary)`,
    `- "goalsBn"               (BANGLA — native বাংলা or null)`,
    `- "methodsBn"             (BANGLA — native বাংলা or null)`,
    `- "resultsBn"             (BANGLA — native বাংলা or null)`,
    `- "conclusionsBn"         (BANGLA — native বাংলা or null)`,
    `- "keyContributionsBn"    (BANGLA — array of native বাংলা phrases or [])`,
    `- "limitationsBn"         (BANGLA — array of native বাংলা phrases or [])`,
    `- "keywordsBn"            (BANGLA — array of native বাংলা words or [])`,
  ].join("\n");

  const restrictedAnswer = [
    `Summarize only facts present in the supplied text. If a field is genuinely missing, write "Not clearly stated in the paper." (in English) and its বাংলা equivalent "সুস্পষ্টভাবে উল্লেখ নেই।" for the Bn field.`,
    `Never leave professionalSummary empty. Never return an empty object.`,
    `For Bn fields, use natural native Bangla script (অ-ঔ, ক-হ) — do not write Bangla in Latin letters and do not transliterate.`,
  ].join(" ");

  try {
    const aiResult = await getAiResponse<SummaryOutput & { __model?: string }>({
      context: prompt,
      responseStyle,
      restrictedAnswer,
      // Generous timeout — the bilingual prompt is large.
      responseTime: 20_000,
      maxTokens: 2400,
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
      if (validated && !looksLikeHallucination(validated, resource)) {
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
      if (validated && !looksLikeHallucination(validated, resource)) {
        return { ...validated, __model: aiResult.model };
      }
    }

    // Last-ditch: derive the schema from the loose object the model returned,
    // accepting whatever shape we got and filling the Bn fields with English
    // as a visible-but-clearly-mirror fallback so the UI never renders empty.
    return withBnMirror(fallbackSummary(resource, cleanedText), aiResult.model);
  } catch {
    return withBnMirror(fallbackSummary(resource, cleanedText), "local-fallback");
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
        context: `Translate each English phrase into a concise fluent native Bangla (বাংলা) equivalent. Preserve order. Use Bengali script only. Return JSON only.\n\nPhrases:\n${sourceList.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,
        responseStyle: `Return JSON with one key: "bn" which is an array of Bangla translations in the same order.`,
        restrictedAnswer: `Never transliterate. Same length as input.`,
        responseTime: 10_000,
        maxTokens: 400,
        concurrency: 2,
        retryNumber: 1,
        maxModelBatches: 2,
      });
      (translations as Record<string, string[]>)[bnKey] = aiResult.data?.bn ?? [];
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

type AiProcessMode = "full" | "summary" | "citations";

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
    const { extracted, textHash, fileHash } = await extractAndStoreResourceText(resource);
    const shared = await hydrateResourceAiFromExisting(resourceId, {
      fileHash,
      textHash,
      skipSummary: regenerate,
      skipCitations: true,
    });
    const summary = shared.copiedSummary && !regenerate
      ? await prisma.resourceSummary.findUniqueOrThrow({ where: { resourceId } })
      : await generateResourceSummary(resource, extracted.cleanedText, textHash, regenerate);
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

// How long a job can sit in a processing state before we consider it stuck.
const STUCK_JOB_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

const PROCESSING_STATES_SET = new Set<ResourceProcessingStatus>([
  ResourceProcessingStatus.TEXT_PROCESSING,
  ResourceProcessingStatus.TEXT_EXTRACTED,
  ResourceProcessingStatus.SUMMARY_PROCESSING,
  ResourceProcessingStatus.CITATION_PROCESSING,
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
  };
};

export const getSummary = async (resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      id: true,
      aiProcessingStatus: true,
      processingError: true,
      aiSummary: true,
    },
  });
  if (!resource) throw new AppError(404, "Resource not found.");
  return {
    resourceId,
    status: resource.aiProcessingStatus,
    processingError: resource.processingError,
    summaryStatus: resource.aiSummary ? (resource.aiSummary.isVisible ? resource.aiSummary.generationStatus : "HIDDEN") : "PENDING",
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

export const __resourceAiInternals = {
  extractPdfText,
  fallbackSummary,
  splitReferences,
  detectReferenceSection,
};
