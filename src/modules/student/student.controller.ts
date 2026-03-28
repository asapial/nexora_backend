import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { studentService } from "./student.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null,
    });
  }

  const result = await studentService.getStudentProfile(userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Student profile retrieved successfully",
    data: result,
  });
});

const updateStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null,
    });
  }

  const result = await studentService.updateStudentProfile(userId, req.body);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Student profile updated successfully",
    data: result,
  });
});

const deleteStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return sendResponse(res, {
      status: status.UNAUTHORIZED,
      success: false,
      message: "Unauthorized access",
      data: null,
    });
  }

  const result = await studentService.deleteStudentProfile(userId);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Student profile deleted successfully",
    data: result,
  });
});

export const studentController = {
  getStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
};
