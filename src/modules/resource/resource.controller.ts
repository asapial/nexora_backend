import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { resourceService } from "./resource.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

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
      title:       bodyData.title         ?? "",
      description: bodyData.description   ?? undefined,
      visibility:  bodyData.visibility    ?? "PUBLIC",
      tags:        Array.isArray(bodyData.tags) ? bodyData.tags : [],
      authors:     Array.isArray(bodyData.authors) ? bodyData.authors : [],
      year:        bodyData.year ? Number(bodyData.year) : undefined,
      isFeatured:  bodyData.isFeatured    ?? false,
      categoryId:  bodyData.categoryId    ?? undefined,
      clusterId:   bodyData.clusterId     ?? undefined,
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

// ── Categories ────────────────────────────────────────────────────────────────
const getCategories = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const result = await resourceService.getCategories();
    sendResponse(res, { status: status.OK, success: true, message: "Categories fetched", data: result });
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
};