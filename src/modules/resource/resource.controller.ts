import { NextFunction, Request, Response } from "express";
import status from "http-status";
import zlib from "zlib";
import AppError from "../../errorHelpers/AppError";
import { cloudinaryUpload } from "../../config/cloudinary.config";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { getAiResponse } from "../../utils/aiResponse";
import { sendResponse } from "../../utils/sendResponse";
import { hydrateResourceAiFromExisting, processResourceAi } from "./resourceAi.service";
import { resourceService } from "./resource.service";

type AiSuggestions = {
  titles: string[];
  descriptions: string[];
  authorSets: string[][];
  years: string[];
  tagSets: string[][];
};

const MAX_AI_PDF_BYTES = 30 * 1024 * 1024;
const MAX_AI_CONTEXT_CHARS = 18000;
const MAX_DIRECT_UPLOAD_BYTES = 30 * 1024 * 1024;
const SUGGESTION_COUNT = 4;

const STOP_WORDS = new Set([
  "about", "above", "after", "again", "against", "also", "among", "because", "before",
  "being", "between", "could", "during", "first", "from", "have", "into", "more",
  "other", "these", "those", "their", "there", "this", "through", "using", "which",
  "while", "with", "within", "would", "study", "paper", "figure", "table", "page",
  "chapter", "section", "abstract", "introduction", "conclusion", "references",
]);

const asArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

const normalizeSha256 = (value: unknown) => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return /^[a-f0-9]{64}$/.test(normalized) ? normalized : null;
};

const cleanText = (value: string) =>
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
    out.push(cleanText(match[0].replace(/\)\s*(?:Tj|'|")$/, "").slice(1)));
  }

  for (const match of raw.matchAll(arrayPattern)) {
    const segment = match[1] ?? "";
    for (const part of segment.matchAll(/\((?:\\.|[^\\)])*\)/g)) {
      out.push(cleanText(part[0].slice(1, -1)));
    }
    for (const part of segment.matchAll(/<([\da-fA-F\s]{4,})>/g)) {
      const hex = (part[1] ?? "").replace(/\s+/g, "");
      try {
        out.push(cleanText(Buffer.from(hex, "hex").toString("utf8")));
      } catch {
        // Ignore malformed hex PDF operators.
      }
    }
  }

  for (const match of raw.matchAll(hexPattern)) {
    const hex = (match[1] ?? "").replace(/\s+/g, "");
    try {
      out.push(cleanText(Buffer.from(hex, "hex").toString("utf8")));
    } catch {
      // Ignore malformed hex PDF operators.
    }
  }

  return out.filter((item) => /[a-zA-Z]{3,}/.test(item));
};

const inflatePdfStream = (stream: Buffer): string | null => {
  const candidates = [
    () => zlib.inflateSync(stream),
    () => zlib.inflateRawSync(stream),
    () => zlib.unzipSync(stream),
  ];

  for (const inflate of candidates) {
    try {
      return inflate().toString("latin1");
    } catch {
      // Try the next PDF stream encoding.
    }
  }

  return null;
};

const extractPdfText = (buffer: Buffer): string => {
  const raw = buffer.toString("latin1");
  const chunks: string[] = [];
  let charCount = 0;

  const initialChunks = extractPdfStringText(raw);
  chunks.push(...initialChunks);
  charCount += initialChunks.reduce((sum, chunk) => sum + chunk.length, 0);

  const streamPattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  for (const match of raw.matchAll(streamPattern)) {
    if (charCount > MAX_AI_CONTEXT_CHARS) break;
    const streamBody = match[1];
    if (!streamBody) continue;

    const streamText = inflatePdfStream(Buffer.from(streamBody, "latin1"));
    if (streamText) {
      const streamChunks = extractPdfStringText(streamText);
      chunks.push(...streamChunks);
      charCount += streamChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    }
  }

  return cleanText(chunks.join(" ")).slice(0, MAX_AI_CONTEXT_CHARS);
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};

const uniqueBy = (items: string[], normalizer = (item: string) => item.toLowerCase()) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizer(item.trim());
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const fillStrings = (
  primary: string[],
  fallback: string[],
  maxItems: number,
  maxLen: number
) => uniqueBy([...primary, ...fallback])
  .map((item) => item.slice(0, maxLen))
  .slice(0, maxItems);

const fillStringSets = (
  primary: string[][],
  fallback: string[][],
  maxSets: number,
  maxItems: number,
  maxLen: number
) => {
  const seen = new Set<string>();
  const out: string[][] = [];

  for (const set of [...primary, ...fallback]) {
    const cleanSet = uniqueBy(set)
      .map((item) => item.slice(0, maxLen))
      .slice(0, maxItems);
    const key = cleanSet.join("|").toLowerCase();
    if (!cleanSet.length || seen.has(key)) continue;
    seen.add(key);
    out.push(cleanSet);
    if (out.length >= maxSets) break;
  }

  return out;
};

const unwrapSuggestionPayload = (value: unknown): Record<string, unknown> => {
  const root = asRecord(value);
  const data = asRecord(root.data);
  const nested = data.suggestions ?? (Object.keys(data).length ? data : undefined) ?? root.suggestions ?? root.metadata ?? root.result;
  return Object.keys(asRecord(nested)).length ? asRecord(nested) : root;
};

const normalizeSuggestions = (value: Partial<AiSuggestions> | Record<string, unknown> | null): AiSuggestions => {
  const source = unwrapSuggestionPayload(value);
  const toStrings = (input: unknown, maxItems: number, maxLen: number) =>
    (Array.isArray(input) ? input : typeof input === "string" ? [input] : [])
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .slice(0, maxItems)
      .map((item) => item.slice(0, maxLen));

  const toStringSets = (input: unknown, maxSets: number, maxItems: number, maxLen: number) => {
    if (typeof input === "string") {
      const singleSet = toStrings(input, maxItems, maxLen);
      return singleSet.length ? [singleSet] : [];
    }

    if (Array.isArray(input) && input.every((item) => typeof item === "string")) {
      const singleSet = toStrings(input, maxItems, maxLen);
      return singleSet.length ? [singleSet] : [];
    }

    return (Array.isArray(input) ? input : [])
      .map((set) => toStrings(set, maxItems, maxLen))
      .filter((set) => set.length > 0)
      .slice(0, maxSets);
  };

  return {
    titles: toStrings(source.titles ?? source.titleSuggestions ?? source.title, SUGGESTION_COUNT, 160),
    descriptions: toStrings(
      source.descriptions ?? source.descriptionSuggestions ?? source.abstracts ?? source.summaries ?? source.description,
      SUGGESTION_COUNT,
      700
    ),
    authorSets: toStringSets(source.authorSets ?? source.authors ?? source.authorSuggestions, SUGGESTION_COUNT, 8, 80),
    years: toStrings(source.years ?? source.publicationYears ?? source.year, SUGGESTION_COUNT, 4)
      .filter((year) => /^\d{4}$/.test(year)),
    tagSets: toStringSets(source.tagSets ?? source.tags ?? source.keywords, SUGGESTION_COUNT, 12, 40),
  };
};

const humanizeFileName = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Uploaded Resource";

const splitTextLines = (value: string) =>
  value
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map((line) => cleanText(line))
    .filter((line) =>
      line.length >= 4 &&
      !/^page\s+\d+$/i.test(line) &&
      !/^[-_\s]+$/.test(line)
    );

const keywordCandidates = (value: string) => {
  const keywordMatch = value.match(/keywords?\s*[:\-]\s*([\s\S]{0,400}?)(?=\n\s*(?:abstract|introduction|page\s+\d+|1\.|\d+\s+[A-Z])|$)/i);
  const explicitKeywords = keywordMatch?.[1]
    ?.split(/[,;|\n]/)
    .map((tag) => cleanText(tag).toLowerCase())
    .filter((tag) => tag.length >= 3 && tag.length <= 40) ?? [];

  const frequencies = new Map<string, number>();
  cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !STOP_WORDS.has(word) && !/^\d+$/.test(word))
    .forEach((word) => frequencies.set(word, (frequencies.get(word) ?? 0) + 1));

  const frequentKeywords = [...frequencies.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 16);

  return uniqueBy([...explicitKeywords, ...frequentKeywords]).slice(0, 16);
};

const extractAuthorSets = (lines: string[]) => {
  const authorLine = lines.find((line) => /^(?:authors?|by)\s*[:\- ]/i.test(line));
  if (!authorLine) return [];

  const names = authorLine
    .replace(/^(?:authors?|by)\s*[:\- ]/i, "")
    .replace(/\b(?:department|university|institute|college|school)\b.*$/i, "")
    .split(/,|;|\band\b|&/)
    .map((name) => cleanText(name))
    .filter((name) => /^[A-Z][A-Za-z'. -]{2,80}$/.test(name));

  const uniqueNames = uniqueBy(names);
  if (!uniqueNames.length) return [];

  return fillStringSets(
    [
      uniqueNames,
      uniqueNames.slice(0, 1),
      uniqueNames.slice(0, Math.min(3, uniqueNames.length)),
    ],
    [],
    SUGGESTION_COUNT,
    8,
    80
  );
};

const extractAbstract = (value: string) => {
  const match = value.match(/abstract\s*[:\-]?\s*([\s\S]{120,1200}?)(?=\n\s*(?:keywords?|introduction|1\.|\d+\s+[A-Z]|page\s+\d+)\b|$)/i);
  return match?.[1] ? cleanText(match[1]).slice(0, 650) : "";
};

const titleCandidates = (fileName: string, lines: string[]) => {
  const baseTitle = humanizeFileName(fileName);
  const explicitTitle = lines
    .find((line) => /^title\s*[:\-]/i.test(line))
    ?.replace(/^title\s*[:\-]\s*/i, "");
  const metadataStart = lines.findIndex((line) => /^(?:abstract|keywords?|introduction|authors?|by)\b/i.test(line));
  const headerLines = lines
    .slice(0, metadataStart > 0 ? metadataStart : 8)
    .filter((line) =>
      line.length >= 8 &&
      line.length <= 140 &&
      /[a-zA-Z]{4,}/.test(line) &&
      !/(?:doi|copyright|http|www\.|issn|isbn|university|department|journal|conference)/i.test(line) &&
      (line.match(/\d/g)?.length ?? 0) <= Math.max(4, Math.floor(line.length / 3))
    );

  return uniqueBy([explicitTitle ?? "", ...headerLines, baseTitle]).slice(0, SUGGESTION_COUNT);
};

const fallbackMetadata = (fileName: string, extractedText: string): AiSuggestions => {
  const normalizedText = cleanText(extractedText);
  const lines = splitTextLines(extractedText);
  const titleSeeds = titleCandidates(fileName, lines);
  const primaryTitle = titleSeeds[0] || humanizeFileName(fileName);
  const tags = keywordCandidates(extractedText);
  const topicPhrase = tags.slice(0, 4).join(", ") || "the uploaded topic";
  const abstract = extractAbstract(extractedText);
  const years = uniqueBy([...normalizedText.matchAll(/\b(19|20)\d{2}\b/g)].map((match) => match[0])).slice(0, SUGGESTION_COUNT);

  return {
    titles: fillStrings(titleSeeds, [
      primaryTitle,
      `${primaryTitle} Study Resource`,
      `${primaryTitle} Reference Notes`,
      `Understanding ${primaryTitle}`,
    ], SUGGESTION_COUNT, 160),
    descriptions: fillStrings([
      abstract,
      normalizedText ? normalizedText.slice(0, 520) : "",
    ], [
      `A learning resource focused on ${topicPhrase}.`,
      `This document supports study, discussion, and review of ${topicPhrase}.`,
      `A reference material for coursework, classroom use, or independent reading around ${topicPhrase}.`,
      `Use this resource to explore the main ideas, terminology, and context related to ${topicPhrase}.`,
    ], SUGGESTION_COUNT, 700),
    authorSets: extractAuthorSets(lines),
    years,
    tagSets: fillStringSets([
      tags.slice(0, 12),
      tags.slice(0, 8),
      uniqueBy([...primaryTitle.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/), ...tags])
        .filter((tag) => tag.length > 3 && !STOP_WORDS.has(tag))
        .slice(0, 10),
    ], [
      ["resource", "learning", "reference", "study"],
    ], SUGGESTION_COUNT, 12, 40),
  };
};

const mergeSuggestions = (primary: AiSuggestions, fallback: AiSuggestions): AiSuggestions => ({
  titles: fillStrings(primary.titles, fallback.titles, SUGGESTION_COUNT, 160),
  descriptions: fillStrings(primary.descriptions, fallback.descriptions, SUGGESTION_COUNT, 700),
  authorSets: fillStringSets(primary.authorSets, fallback.authorSets, SUGGESTION_COUNT, 8, 80),
  years: fillStrings(primary.years, fallback.years, SUGGESTION_COUNT, 4).filter((year) => /^\d{4}$/.test(year)),
  tagSets: fillStringSets(primary.tagSets, fallback.tagSets, SUGGESTION_COUNT, 12, 40),
});

const generateMetadataSuggestions = async (
  fileName: string,
  extractedText: string
): Promise<AiSuggestions> => {
  const fallback = fallbackMetadata(fileName, extractedText);
  const context = extractedText.length >= 120
    ? `Filename: ${fileName}

Local extractor candidates:
${JSON.stringify(fallback, null, 2)}

Readable PDF text excerpt:
${extractedText.slice(0, 12000)}`
    : `Filename: ${fileName}. The PDF has little readable text, so infer conservative metadata from the filename only.`;

  const aiResult = await getAiResponse<Partial<AiSuggestions>>({
    context: `Analyze this uploaded education/resource PDF and propose high-quality metadata suggestions for a teacher/student resource library.\n\n${context}`,
    responseStyle: `Return a JSON object with exactly these keys:
{
  "titles": ["exactly 4 concise, polished title suggestions"],
  "descriptions": ["exactly 4 useful descriptions, each 35-70 words"],
  "authorSets": [["up to 8 author names copied only when explicitly present in the text"]],
  "years": ["publication/copyright years as 4-digit strings, only if visible"],
  "tagSets": [["exactly 8-12 lowercase topic tags per set"]]
}`,
    restrictedAnswer: "Return valid JSON only. Use the local extractor candidates as hints, but correct obvious noise. Do not include file extensions, page numbers, URLs, DOI strings, institutions, or generic labels as titles. Do not invent authors or years. Tags must be short lowercase topical phrases, not generic words like resource or study.",
    responseTime: 2200,
    maxTokens: 1100,
    concurrency: 4,
    retryNumber: 1,
    maxModelBatches: 1,
  });

  if (!aiResult.success || !aiResult.data) return fallback;
  return mergeSuggestions(normalizeSuggestions(aiResult.data), fallback);
};

const sanitizePublicIdPart = (value: string) =>
  value
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80) || "resource";

const isPdfDescriptor = (fileName: string, fileType: string) =>
  fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");

const resolveCloudinaryResourceType = (
  fileName: string,
  fileType: string
): "image" | "video" | "raw" => {
  if (isPdfDescriptor(fileName, fileType)) return "raw";
  if (fileType.startsWith("image/")) return "image";
  if (fileType.startsWith("video/")) return "video";
  return "raw";
};

const isOwnCloudinaryUrl = (value: string) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.startsWith(`/${envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME}/`)
    );
  } catch {
    return false;
  }
};

const uploadResource = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let bodyData: Record<string, unknown> = {};
    if (req.body.data) {
      try {
        bodyData = JSON.parse(req.body.data);
      } catch {
        bodyData = req.body;
      }
    } else {
      bodyData = req.body;
    }

    const fileUrlFromBody = typeof bodyData.fileUrl === "string" ? bodyData.fileUrl.trim() : "";

    if (!req.file && !fileUrlFromBody) {
      return sendResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "File is required",
        data: null,
      });
    }

    if (!req.file && !isOwnCloudinaryUrl(fileUrlFromBody)) {
      return sendResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "Valid Cloudinary file URL is required",
        data: null,
      });
    }

    const uploaderId = req.user?.userId ?? null;
    const fileUrl = req.file?.path ?? fileUrlFromBody;
    const fileTypeFromBody = typeof bodyData.fileType === "string" ? bodyData.fileType.trim() : "";
    const fileType = req.file?.mimetype ?? (fileTypeFromBody || "other");
    const fileHash = normalizeSha256(bodyData.fileHash);

    const payload = {
      uploaderId,
      fileUrl,
      fileType,
      fileHash: fileHash ?? undefined,
      title: bodyData.title ?? "",
      description: bodyData.description ?? undefined,
      visibility: bodyData.visibility ?? "PUBLIC",
      tags: [...asArray(bodyData.tags), ...asArray(bodyData["tags[]"])],
      authors: [...asArray(bodyData.authors), ...asArray(bodyData["authors[]"])],
      year: bodyData.year ? Number(bodyData.year) : undefined,
      isFeatured: bodyData.isFeatured ?? false,
      categoryId: bodyData.categoryId ?? undefined,
      clusterIds: [...asArray(bodyData.clusterIds), ...asArray(bodyData["clusterIds[]"])],
      clusterId: bodyData.clusterId ?? asArray(bodyData["clusterIds[]"])[0] ?? undefined,
    };

    const result = await resourceService.uploadResource(payload);
    const isPdf = isPdfDescriptor(fileUrl, fileType);

    // ── Best-effort AI ingestion kickoff ────────────────────────────────────
    // Real-world academic readers (Elicit, ChatPDF, Humata) start the
    // summary/citations/graph pipeline at upload time so the FIRST user to
    // open the document doesn't have to click "Process PDF" and so subsequent
    // users re-use cached artifacts via the fileHash. We never block the
    // upload response on this — failures are logged, not surfaced to the user.
    if (isPdf) {
      void (async () => {
        try {
          let resolvedFileHash = fileHash ?? null;
          if (!resolvedFileHash && req.file?.buffer) {
            resolvedFileHash = await resourceService.computeAndPersistFileHash(result.id, req.file.buffer);
          }

          const shared = resolvedFileHash
            ? await hydrateResourceAiFromExisting(result.id, { fileHash: resolvedFileHash })
            : { hydrated: false, copiedText: false, copiedSummary: false, copiedCitations: 0, sourceResourceId: null };

          if (!shared.hydrated) {
            await processResourceAi(result.id, { regenerateSummary: false, reanalyzeCitations: false });
          }
        } catch (error: unknown) {
          console.warn("[resource-ai] auto-ingest failed after upload", {
            resourceId: result.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      })();
    }

    sendResponse(res, {
      status: status.CREATED,
      success: true,
      message: "Resource uploaded successfully",
      data: result,
    });
  }
);

const allResources = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await resourceService.allResources();
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Resources fetched successfully",
      data: result,
    });
  }
);

const browseResources = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    const result = await resourceService.getFilteredResources(
      req.query as Record<string, string>,
      userId,
      undefined,
      true
    );
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Resources fetched successfully",
      data: result.resources,
      meta: result.meta,
    });
  }
);

const myResources = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    const result = await resourceService.getFilteredResources(
      { ...(req.query as Record<string, string>), uploaderId: userId ?? "" },
      userId
    );
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Your resources fetched successfully",
      data: result.resources,
      meta: result.meta,
    });
  }
);

const teacherLibraryResources = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const result = await resourceService.getTeacherLibraryResources(
      req.query as Record<string, string>,
      userId
    );
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Teacher library resources fetched successfully",
      data: result.resources,
      meta: result.meta,
    });
  }
);

const bookmarkResource = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const { resourceId } = req.params as { resourceId: string; };
    const result = await resourceService.bookmarkResource(userId, resourceId);
    sendResponse(res, { status: status.CREATED, success: true, message: "Bookmarked", data: result });
  }
);

const removeBookmark = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const { resourceId } = req.params as { resourceId: string; };
    const result = await resourceService.removeBookmark(userId, resourceId);
    sendResponse(res, { status: status.OK, success: true, message: "Bookmark removed", data: result });
  }
);

const getCategories = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const result = await resourceService.getCategories();
    sendResponse(res, { status: status.OK, success: true, message: "Categories fetched", data: result });
  }
);

const createUploadSignature = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const fileName = typeof req.body?.fileName === "string" ? req.body.fileName.trim() : "";
    const fileType = typeof req.body?.fileType === "string" ? req.body.fileType.trim() : "application/octet-stream";
    const fileSize = Number(req.body?.fileSize ?? 0);

    if (!fileName) {
      throw new AppError(status.BAD_REQUEST, "File name is required.");
    }

    if (!Number.isFinite(fileSize) || fileSize <= 0) {
      throw new AppError(status.BAD_REQUEST, "Valid file size is required.");
    }

    if (isPdfDescriptor(fileName, fileType) && fileSize > MAX_DIRECT_UPLOAD_BYTES) {
      throw new AppError(413, "PDF must be 30 MB or smaller.");
    }

    const resourceType = resolveCloudinaryResourceType(fileName, fileType);
    const extension = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : undefined;
    const isPdf = isPdfDescriptor(fileName, fileType);
    const rawExtension = extension || (isPdf ? "pdf" : undefined);
    const folder = isPdf ? "nexora/pdfs" : "nexora/uploads";
    const uniqueName = `${Math.random().toString(36).slice(2)}-${Date.now()}-${sanitizePublicIdPart(fileName)}`;
    const publicId = `${folder}/${uniqueName}${(isPdf || (resourceType === "raw" && rawExtension)) ? `.${rawExtension}` : ""}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinaryUpload.utils.api_sign_request(
      { public_id: publicId, timestamp },
      envVars.CLOUDINARY.CLOUDINARY_API_SECRET
    );
    const cloudName = envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME;

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Upload signature created",
      data: {
        cloudName,
        apiKey: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
        timestamp,
        signature,
        publicId,
        resourceType,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        maxBytes: MAX_DIRECT_UPLOAD_BYTES,
      },
    });
  }
);

// ── AI Metadata Suggestion ────────────────────────────────────────────────────
const suggestMetadata = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const bodyText = typeof req.body?.text === "string" ? req.body.text : "";
    const fileName = typeof req.body?.fileName === "string" && req.body.fileName.trim()
      ? req.body.fileName.trim()
      : req.file?.originalname ?? "Uploaded Resource";
    const fileSize = Number(req.body?.fileSize ?? req.file?.size ?? 0);

    if (fileSize > MAX_AI_PDF_BYTES) {
      throw new AppError(413, "PDF must be 30 MB or smaller.");
    }

    let extractedText = bodyText.trim().slice(0, MAX_AI_CONTEXT_CHARS);

    if (!cleanText(extractedText) && req.file?.buffer) {
      if (req.file.mimetype !== "application/pdf") {
        throw new AppError(status.BAD_REQUEST, "Only PDF files can be analyzed.");
      }

      extractedText = extractPdfText(req.file.buffer);
    }

    const suggestions = await generateMetadataSuggestions(fileName, extractedText);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: extractedText
        ? "Metadata suggestions generated successfully"
        : "Metadata suggestions generated from the file name",
      data: suggestions,
    });
  }
);

// ── Delete Resource ───────────────────────────────────────────────────────
const deleteResource = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const { resourceId } = req.params as { resourceId: string; };
    const result = await resourceService.deleteResource(resourceId, userId);
    sendResponse(res, { status: status.OK, success: true, message: "Resource deleted", data: result });
  }
);

// ── Cloudinary Signed URL / Download Proxy ────────────────────────────────────
// For INLINE view  : fetch and stream from this origin so PDF previews render reliably.
// For DOWNLOAD     : fetch file server-side and pipe back with the correct
//                   Content-Disposition: attachment; filename="<title>.pdf"
//
// Why streaming instead of redirect?
//  1. Legacy image-type PDFs have NO ".pdf" in their public_id path.
//     private_download_url gets a corrupted `format` arg (the whole id string),
//     so Cloudinary returns a file named "ela4zxqjpcw-..." with no extension.
//  2. The Cloudinary SDK `attachment: string` override is not reliable across versions.
//  Streaming gives us 100% control over Content-Disposition.
const cloudinarySign = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { url, inline, filename, reader } = req.query as {
      url?: string;
      inline?: string;
      filename?: string;
      reader?: string;
    };

    if (!url || !url.startsWith("https://res.cloudinary.com/")) {
      return sendResponse(res, { status: status.BAD_REQUEST, success: false, message: "Valid Cloudinary url param required", data: null });
    }
    await resourceService.assertResourceUrlAccess(req.user!.userId, url);

    // ── Detect resource_type ─────────────────────────────────────────────────
    const resourceType: "image" | "raw" | "video" =
      url.includes("/raw/upload/") ? "raw" :
        url.includes("/video/upload/") ? "video" : "image";

    // ── Extract public_id ────────────────────────────────────────────────────
    const uploadMatch = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!uploadMatch) {
      return sendResponse(res, { status: status.BAD_REQUEST, success: false, message: "Could not parse Cloudinary URL", data: null });
    }

    const rawPublicId = uploadMatch[1] as string;

    // Safe format extraction — only use the part after the LAST dot if it looks
    // like a real extension (≤5 chars).  Fallback to "pdf" for extensionless ids.
    const extMatch = rawPublicId.match(/\.([a-zA-Z0-9]{1,5})$/);
    const format = extMatch?.[1] ?? "pdf";

    // For image/video Cloudinary strips the extension from public_id
    const publicId = resourceType === "raw" ? rawPublicId : rawPublicId.replace(/\.[^.]+$/, "");

    const { cloudinaryUpload } = await import("../../config/cloudinary.config");

    // Generate a 1-hour signed Cloudinary download URL
    const signedCloudinaryUrl = cloudinaryUpload.utils.private_download_url(publicId, format, {
      resource_type: resourceType,
      type: "upload",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      attachment: inline === "true" ? false : true,
    });

    // ── INLINE VIEW: redirect ────────────────────────────────────────────────
    if (inline === "true") {
      let upstream: globalThis.Response;
      const storageHeaders = req.headers.range ? { Range: req.headers.range } : undefined;
      const storageRequestInit = storageHeaders ? { headers: storageHeaders } : undefined;

      try {
        upstream = await fetch(resourceType === "raw" ? url : signedCloudinaryUrl, storageRequestInit);
        if (!upstream.ok && resourceType === "raw") {
          upstream = await fetch(signedCloudinaryUrl, storageRequestInit);
        }
      } catch {
        return sendResponse(res, {
          status: status.BAD_GATEWAY,
          success: false,
          message: "Could not reach file storage",
          data: null,
        });
      }

      if (!upstream.ok) {
        return sendResponse(res, {
          status: status.BAD_GATEWAY,
          success: false,
          message: `Storage returned ${upstream.status}`,
          data: null,
        });
      }

      const safeInlineName =
        (filename || "document").replace(/[^\w\-. ]/g, "_").trim() || "document";
      const isPdfFile =
        format.toLowerCase() === "pdf" ||
        url.toLowerCase().includes(".pdf") ||
        safeInlineName.toLowerCase().endsWith(".pdf");

      res.status(upstream.status);
      if (reader !== "true") {
        res.setHeader("Content-Disposition", `inline; filename="${safeInlineName}.pdf"`);
      }
      res.setHeader(
        "Content-Type",
        reader === "true"
          ? "application/octet-stream"
          : isPdfFile ? "application/pdf" : upstream.headers.get("content-type") || "application/octet-stream"
      );
      if (reader === "true" && isPdfFile) res.setHeader("X-Nexora-Document-Type", "pdf");
      res.setHeader("Cache-Control", "private, max-age=300");
      res.setHeader("Accept-Ranges", upstream.headers.get("accept-ranges") || "bytes");
      const contentLength = upstream.headers.get("content-length");
      const contentRange = upstream.headers.get("content-range");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      if (contentRange) res.setHeader("Content-Range", contentRange);

      const { Readable } = await import("stream");
      if (upstream.body) {
        // Node's Web Stream type differs slightly from the runtime implementation.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Readable.fromWeb(upstream.body as any).pipe(res);
      } else {
        res.end();
      }
      return;
    }

    // ── DOWNLOAD: stream through our server with correct filename header ──────
    const safeBase = (filename || "document")
      .replace(/\.pdf$/i, "")
      .replace(/[^\w\-. ]/g, "_")
      .trim() || "document";
    const safeFilename = `${safeBase}.pdf`;

    let upstream: globalThis.Response;
    try {
      upstream = await fetch(signedCloudinaryUrl);
    } catch {
      return sendResponse(res, { status: status.BAD_GATEWAY, success: false, message: "Could not reach file storage", data: null });
    }

    if (!upstream.ok) {
      return sendResponse(res, { status: status.BAD_GATEWAY, success: false, message: `Storage returned ${upstream.status}`, data: null });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/pdf");
    const cl = upstream.headers.get("content-length");
    if (cl) res.setHeader("Content-Length", cl);

    const { Readable } = await import("stream");
    if (upstream.body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Readable.fromWeb(upstream.body as any).pipe(res);
    } else {
      res.end();
    }
  }
);

// ── Update Resource (PATCH) ───────────────────────────────────────────────────
const updateResource = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const { resourceId } = req.params as { resourceId: string; };
    const body = req.body as {
      title?: string; description?: string; authors?: string[];
      tags?: string[]; year?: string; categoryId?: string | null;
      clusterIds?: string[]; visibility?: string;
    };
    const result = await resourceService.updateResource(resourceId, userId, {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(Array.isArray(body.authors) && { authors: body.authors }),
      ...(Array.isArray(body.tags) && { tags: body.tags }),
      ...(body.year !== undefined && { year: body.year ? Number(body.year) : null }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      ...(Array.isArray(body.clusterIds) && { clusterIds: body.clusterIds }),
      ...(body.visibility !== undefined && { visibility: body.visibility }),
    });
    sendResponse(res, { status: status.OK, success: true, message: "Resource updated", data: result });
  }
);

export const resourceController = {
  suggestMetadata,
  uploadResource,
  allResources,
  browseResources,
  teacherLibraryResources,
  myResources,
  bookmarkResource,
  removeBookmark,
  getCategories,
  createUploadSignature,
  cloudinarySign,
  updateResource,
  deleteResource,
};
