import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { resourceService } from "./resource.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { extractMetadataFromPdf } from "../ai/pdfRag.service";

// ── Upload Resource ──────────────────────────────────────────────────────────
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

    // Support both flat body fields and JSON "data" field (from multipart)
    let bodyData: Record<string, unknown> = {};
    if (req.body.data) {
      try { bodyData = JSON.parse(req.body.data); } catch { bodyData = req.body; }
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
      tags: Array.isArray(bodyData.tags) ? bodyData.tags : [],
      authors: Array.isArray(bodyData.authors) ? bodyData.authors : [],
      year: bodyData.year ? Number(bodyData.year) : undefined,
      isFeatured: bodyData.isFeatured ?? false,
      categoryId: bodyData.categoryId ?? undefined,
      clusterId: bodyData.clusterId ?? undefined,
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

// ── All Resources ─────────────────────────────────────────────────────────────
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

// ── Filtered / Browse ─────────────────────────────────────────────────────────
const browseResources = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    const result = await resourceService.getFilteredResources(
      req.query as Record<string, string>,
      userId,
      true   // browseMode — enforces PUBLIC/CLUSTER visibility gate
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

// ── My Resources ──────────────────────────────────────────────────────────────
const myResources = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    const result = await resourceService.getFilteredResources(
      { ...req.query as Record<string, string>, uploaderId: userId } as Record<string, string>,
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

// ── Bookmark ──────────────────────────────────────────────────────────────────
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

// ── Categories ────────────────────────────────────────────────────────────────
const getCategories = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const result = await resourceService.getCategories();
    sendResponse(res, { status: status.OK, success: true, message: "Categories fetched", data: result });
  }
);

// ── AI Metadata Suggestion ────────────────────────────────────────────────────
const suggestMetadata = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
      return sendResponse(res, {
        status: status.BAD_REQUEST,
        success: false,
        message: "PDF file is required for metadata extraction",
        data: null,
      });
    }

    try {
      const metadata = await extractMetadataFromPdf(req.file.buffer);
      sendResponse(res, {
        status: status.OK,
        success: true,
        message: "Metadata extracted successfully",
        data: metadata,
      });
    } catch (error: any) {
      sendResponse(res, {
        status: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || "Failed to extract metadata",
        data: null,
      });
    }
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
// For INLINE view  : 302 redirect (browser renders PDF natively).
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
    const { url, inline, filename } = req.query as { url?: string; inline?: string; filename?: string; };

    if (!url || !url.startsWith("https://res.cloudinary.com/")) {
      return sendResponse(res, { status: status.BAD_REQUEST, success: false, message: "Valid Cloudinary url param required", data: null });
    }

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
      attachment: true,
    });

    // ── INLINE VIEW: redirect ────────────────────────────────────────────────
    if (inline === "true") {
      return res.redirect(302, signedCloudinaryUrl);
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
      tags?: string[]; year?: string; categoryId?: string;
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
  uploadResource,
  allResources,
  browseResources,
  myResources,
  bookmarkResource,
  removeBookmark,
  getCategories,
  suggestMetadata,
  cloudinarySign,
  deleteResource,
  updateResource,
};
