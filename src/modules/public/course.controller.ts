import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { publicCourseService } from "./course.service";

const getPublicCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await publicCourseService.getPublicCourses(req.query as Record<string, string>);
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Public courses retrieved",
    data: result,
  });
});

const getPublicCourseById = catchAsync(async (req: Request, res: Response) => {
  const result = await publicCourseService.getPublicCourseById(req.params.id as string);
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Public course retrieved",
    data: result,
  });
});

export const courseController = {
  getPublicCourses,
  getPublicCourseById,
};

