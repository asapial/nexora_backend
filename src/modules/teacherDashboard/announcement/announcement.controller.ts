import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { announcementService } from "./announcement.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getMyClusters = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await announcementService.getMyClusters(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Clusters fetched", data: result });
});

const getMyAnnouncements = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await announcementService.getMyAnnouncements(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Announcements fetched", data: result });
});

const createAnnouncement = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await announcementService.createAnnouncement(req.user.userId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Announcement created", data: result });
});

const deleteAnnouncement = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { id } = req.params as { id: string };
  const result = await announcementService.deleteAnnouncement(req.user.userId, id);
  sendResponse(res, { status: status.OK, success: true, message: "Announcement deleted", data: result });
});

export const announcementController = {
  getMyClusters, getMyAnnouncements, createAnnouncement, deleteAnnouncement,
};
