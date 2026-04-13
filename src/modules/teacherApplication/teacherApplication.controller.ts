import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { teacherApplicationService } from "./teacherApplication.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { prisma } from "../../lib/prisma";

// Authenticated user — POST apply as teacher
const apply = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const data = await teacherApplicationService.apply(userId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Teacher application submitted", data });
});

// Authenticated user — GET own application status
const getMyApplication = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const data = await teacherApplicationService.getMyApplication(userId);
  sendResponse(res, { status: status.OK, success: true, message: "Your application", data });
});

// Admin — GET pending applications
const getPending = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const data = await teacherApplicationService.getPending(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Pending teacher applications", data });
});

// Admin — GET all applications
const getAll = catchAsync(async (req: Request, res: Response) => {
  const data = await teacherApplicationService.getAll(req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "All teacher applications", data });
});

// Admin — POST approve application
const approve = catchAsync(async (req: Request, res: Response) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.approve(req.params.id as string, adminProfile.id);
  sendResponse(res, { status: status.OK, success: true, message: "Application approved, teacher account created", data });
});

// Admin — POST reject application
const reject = catchAsync(async (req: Request, res: Response) => {
  const adminUserId = req.user.userId;
  const adminProfile = await prisma.adminProfile.findFirstOrThrow({ where: { userId: adminUserId } });
  const data = await teacherApplicationService.reject(req.params.id as string, req.body.note || "", adminProfile.id);
  sendResponse(res, { status: status.OK, success: true, message: "Application rejected", data });
});

export const teacherApplicationController = {
  apply,
  getMyApplication,
  getPending,
  getAll,
  approve,
  reject,
};
