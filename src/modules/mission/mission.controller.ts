
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { missionService } from "./mission.service";


// ─────────────────────────────────────────────────────────
// CONTENT
// ─────────────────────────────────────────────────────────


const getContents = catchAsync(async (req: Request, res: Response) => {
  const result = await missionService.getContents(req.params.missionId as string);
  sendResponse(res, { status: status.OK, success: true, message: "Contents retrieved", data: result });
});

const createContent = catchAsync(async (req: Request, res: Response) => {
  const result = await missionService.createContent(req.params.missionId as string, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Content added", data: result });
});

const updateContent = catchAsync(async (req: Request, res: Response) => {
  const result = await missionService.updateContent(req.params.missionId as string, req.params.contentId as string, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Content updated", data: result });
});

const deleteContent = catchAsync(async (req: Request, res: Response) => {
  const result = await missionService.deleteContent(req.params.missionId as string, req.params.contentId as string);
  sendResponse(res, { status: status.OK, success: true, message: "Content deleted", data: result });
});

const reorderContents = catchAsync(async (req: Request, res: Response) => {
  const result = await missionService.reorderContents(req.params.missionId as string, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Contents reordered", data: result });
});




export const missionController={
    getContents,
    createContent,
    updateContent,
    deleteContent,
    reorderContents

}