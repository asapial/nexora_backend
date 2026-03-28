import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { teacherAnalyticsService } from "./teacherAnalytics.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await teacherAnalyticsService.getAnalytics(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Analytics fetched", data: result });
});

const getSessionHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await teacherAnalyticsService.getSessionHistory(req.user.userId, req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "Session history fetched", data: result });
});

const getTemplates = catchAsync(async (req: Request, res: Response) => {
  const result = await teacherAnalyticsService.getTemplates(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Templates fetched", data: result });
});

const createTemplate = catchAsync(async (req: Request, res: Response) => {
  const result = await teacherAnalyticsService.createTemplate(req.user.userId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Template created", data: result });
});

const updateTemplate = catchAsync(async (req: Request, res: Response) => {
  const result = await teacherAnalyticsService.updateTemplate(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Template updated", data: result });
});

const deleteTemplate = catchAsync(async (req: Request, res: Response) => {
  const result = await teacherAnalyticsService.deleteTemplate(req.user.userId, req.params.id);
  sendResponse(res, { status: status.OK, success: true, message: "Template deleted", data: result });
});

export const teacherAnalyticsController = {
  getAnalytics, getSessionHistory,
  getTemplates, createTemplate, updateTemplate, deleteTemplate,
};
