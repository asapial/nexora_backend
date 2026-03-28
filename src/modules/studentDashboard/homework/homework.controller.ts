import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { homeworkService } from "./homework.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getHomework = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const result = await homeworkService.getHomework(userId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Homework fetched successfully",
      data: result,
    });
  }
);

const markHomeworkDone = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const { taskId } = req.params as { taskId: string };
    const result = await homeworkService.markHomeworkDone(userId, taskId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Homework marked as done",
      data: result,
    });
  }
);

export const homeworkController = { getHomework, markHomeworkDone };
