import { NextFunction, Request, Response } from "express";
import status from "http-status";
import zlib from "zlib";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { getAiResponse } from "../../utils/aiResponse";
import { sendResponse } from "../../utils/sendResponse";
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

const asArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
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

const normalizeSuggestions = (value: Partial<AiSuggestions> | null): AiSuggestions => {
  const toStrings = (input: unknown, maxItems: number, maxLen: number) =>
    (Array.isArray(input) ? input : [])
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .slice(0, maxItems)
      .map((item) => item.slice(0, maxLen));

  const toStringSets = (input: unknown, maxSets: number, maxItems: number, maxLen: number) =>
    (Array.isArray(input) ? input : [])
      .map((set) => toStrings(set, maxItems, maxLen))
      .filter((set) => set.length > 0)
      .slice(0, maxSets);

  return {
    titles: toStrings(value?.titles, 4, 160),
    descriptions: toStrings(value?.descriptions, 4, 700),
    authorSets: toStringSets(value?.authorSets, 4, 8, 80),
    years: toStrings(value?.years, 4, 4).filter((year) => /^\d{4}$/.test(year)),
    tagSets: toStringSets(value?.tagSets, 4, 10, 40),
  };
};

const fallbackMetadata = (fileName: string, extractedText: string): AiSuggestions => {
  const baseTitle = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Uploaded Resource";
  const words = extractedText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !["these", "those", "their", "there", "which", "about"].includes(word));
  const tags = [...new Set(words)].slice(0, 8);
  const year = extractedText.match(/\b(19|20)\d{2}\b/)?.[0];

  return {
    titles: [
      baseTitle,
      `${baseTitle} Study Material`,
      `${baseTitle} Reference Guide`,
      `${baseTitle} Learning Resource`,
    ],
    descriptions: [
      extractedText
        ? extractedText.slice(0, 420)
        : `A learning resource uploaded for study, reference, and classroom use.`,
      `This resource can be used to support reading, discussion, and follow-up tasks.`,
      `A structured document for students and teachers to review key concepts and related materials.`,
      `Use this file as a reference resource for coursework, cluster learning, or independent study.`,
    ],
    authorSets: [],
    years: year ? [year] : [],
    tagSets: [tags.length ? tags : ["resource", "study", "learning", "reference"]],
  };
};

const suggestMetadata = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file?.buffer) {
      throw new AppError(status.BAD_REQUEST, "PDF file is required.");
    }

    if (req.file.mimetype !== "application/pdf") {
      throw new AppError(status.BAD_REQUEST, "Only PDF files can be analyzed.");
    }

    if (req.file.size > MAX_AI_PDF_BYTES) {
      throw new AppError(413, "PDF must be 30 MB or smaller.");
    }

    const extractedText = extractPdfText(req.file.buffer);
    const context = extractedText.length >= 400
      ? extractedText
      : `Filename: ${req.file.originalname}. The PDF has little extractable text, so infer conservative metadata from the filename only.`;

    const fallback = fallbackMetadata(req.file.originalname, extractedText);
    const aiResult = await getAiResponse<AiSuggestions>({
      context: `Analyze this uploaded education/resource PDF and propose metadata.\n\n${context}`,
      responseStyle: `Return a JSON object with exactly these keys:
{
  "titles": ["4 concise title suggestions"],
  "descriptions": ["4 concise abstract/description suggestions, each under 90 words"],
  "authorSets": [["up to 8 likely author names"], ["alternative author set"]],
  "years": ["up to 4 likely publication years as strings"],
  "tagSets": [["8-10 lowercase topic tags"], ["alternative tag set"]]
}`,
      restrictedAnswer: "Do not invent precise authors or years if the document text does not support them. Use empty arrays when uncertain.",
      responseTime: 650,
      maxTokens: 900,
      concurrency: 1,
      retryNumber: 1,
      maxModelBatches: 1,
    });

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: aiResult.success
        ? "Metadata suggestions generated successfully"
        : "Fast metadata suggestions generated locally",
      data: aiResult.success ? normalizeSuggestions(aiResult.data) : fallback,
    });
  }
);

const uploadResource = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
      return sendResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "File is required",
        data: null,
      });
    }

    const uploaderId = req.user?.userId ?? null;
    const fileUrl = req.file.path;
    const fileType = req.file.mimetype ?? req.file.originalname.split(".").pop() ?? "other";

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

    const payload = {
      uploaderId,
      fileUrl,
      fileType,
      title: bodyData.title ?? "",
      description: bodyData.description ?? undefined,
      visibility: bodyData.visibility ?? "PUBLIC",
      tags: [...asArray(bodyData.tags), ...asArray(bodyData["tags[]"])],
      authors: [...asArray(bodyData.authors), ...asArray(bodyData["authors[]"])],
      year: bodyData.year ? Number(bodyData.year) : undefined,
      isFeatured: bodyData.isFeatured ?? false,
      categoryId: bodyData.categoryId ?? undefined,
      clusterId: bodyData.clusterId ?? asArray(bodyData["clusterIds[]"])[0] ?? undefined,
    };

    const result = await resourceService.uploadResource(payload);

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
      userId
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

const bookmarkResource = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const { resourceId } = req.params as { resourceId: string };
    const result = await resourceService.bookmarkResource(userId, resourceId);
    sendResponse(res, { status: status.CREATED, success: true, message: "Bookmarked", data: result });
  }
);

const removeBookmark = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const { resourceId } = req.params as { resourceId: string };
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

export const resourceController = {
  suggestMetadata,
  uploadResource,
  allResources,
  browseResources,
  myResources,
  bookmarkResource,
  removeBookmark,
  getCategories,
};
