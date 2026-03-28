import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminPlatformService } from "./adminPlatform.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getPlatformAnalytics = catchAsync(async (_req: Request, res: Response) => {
  const data = await adminPlatformService.getPlatformAnalytics();
  sendResponse(res, { status: status.OK, success: true, message: "Platform analytics", data });
});

const getGlobalAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const data = await adminPlatformService.getGlobalAnnouncements(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Global announcements", data });
});

const createGlobalAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user.userId;
  const data = await adminPlatformService.createGlobalAnnouncement(authorId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Announcement created", data });
});

const deleteGlobalAnnouncement = catchAsync(async (req: Request, res: Response) => {
  const data = await adminPlatformService.deleteGlobalAnnouncement(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Announcement deleted", data });
});

const getClusterOversight = catchAsync(async (req: Request, res: Response) => {
  const data = await adminPlatformService.getClusterOversight(req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "Cluster oversight", data });
});

const getFlaggedContent = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const data = await adminPlatformService.getFlaggedContent(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Flagged content", data });
});

const removeComment = catchAsync(async (req: Request, res: Response) => {
  const data = await adminPlatformService.removeComment(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Comment removed", data });
});

const warnUser = catchAsync(async (req: Request, res: Response) => {
  const data = await adminPlatformService.warnUser(req.params.userId as string, req.body.reason);
  sendResponse(res, { status: status.OK, success: true, message: "User warned", data });
});

const getCertificates = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const data = await adminPlatformService.getCertificates(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Certificates", data });
});

const generateCertificate = catchAsync(async (req: Request, res: Response) => {
  const data = await adminPlatformService.generateCertificate(req.params.enrollmentId as string);
  sendResponse(res, { status: status.CREATED, success: true, message: "Certificate generated", data });
});

const manualEnroll = catchAsync(async (req: Request, res: Response) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualEnroll(userId, courseId);
  sendResponse(res, { status: status.OK, success: true, message: "Enrolled", data });
});

const manualUnenroll = catchAsync(async (req: Request, res: Response) => {
  const { userId, courseId } = req.body;
  const data = await adminPlatformService.manualUnenroll(userId, courseId);
  sendResponse(res, { status: status.OK, success: true, message: "Unenrolled", data });
});

export const adminPlatformController = {
  getPlatformAnalytics,
  getGlobalAnnouncements, createGlobalAnnouncement, deleteGlobalAnnouncement,
  getClusterOversight,
  getFlaggedContent, removeComment, warnUser,
  getCertificates, generateCertificate,
  manualEnroll, manualUnenroll,
};
