import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { annotationService } from "./annotation.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getAnnotations = catchAsync(async (req: Request, res: Response) => {
  const { resourceId } = req.query as { resourceId: string };
  const result = await annotationService.getAnnotations(req.user.userId, resourceId);
  sendResponse(res, { status: status.OK, success: true, message: "Annotations fetched", data: result });
});

const getSharedAnnotations = catchAsync(async (req: Request, res: Response) => {
  const { resourceId } = req.query as { resourceId: string };
  const result = await annotationService.getSharedAnnotations(resourceId, req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Shared annotations fetched", data: result });
});

const createAnnotation = catchAsync(async (req: Request, res: Response) => {
  const result = await annotationService.createAnnotation(req.user.userId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Annotation created", data: result });
});

const updateAnnotation = catchAsync(async (req: Request, res: Response) => {
  const result = await annotationService.updateAnnotation(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Annotation updated", data: result });
});

const deleteAnnotation = catchAsync(async (req: Request, res: Response) => {
  const result = await annotationService.deleteAnnotation(req.user.userId, req.params.id);
  sendResponse(res, { status: status.OK, success: true, message: "Annotation deleted", data: result });
});

const getResources = catchAsync(async (req: Request, res: Response) => {
  const result = await annotationService.getResources(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Resources fetched", data: result });
});

export const annotationController = {
  getAnnotations, getSharedAnnotations, createAnnotation, updateAnnotation, deleteAnnotation, getResources,
};
