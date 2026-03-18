import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { teacherService } from "./teacher.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getTeacherProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null,
    });
  }

  const result = await teacherService.getTeacherProfile(userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Teacher profile retrieved successfully",
    data: result,
  });
});

const updateTeacherProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null,
    });
  }

  const result = await teacherService.updateTeacherProfile(userId, req.body);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Teacher profile updated successfully",
    data: result,
  });
});

const deleteTeacherProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null,
    });
  }

  const result = await teacherService.deleteTeacherProfile(userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Teacher profile deleted successfully",
    data: result,
  });
});

export const teacherController = {
  getTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
};