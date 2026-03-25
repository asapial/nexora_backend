import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { taskService } from "./task.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getMyTasks = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const result = await taskService.getMyTasks(userId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Tasks fetched successfully",
      data: result,
    });
  }
);

const submitTask = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const { taskId } = req.params as { taskId: string };
    const { body } = req.body;
    const fileUrl = req.file?.path;
    const result = await taskService.submitTask(userId, taskId, body, fileUrl);
    sendResponse(res, {
      status: status.CREATED,
      success: true,
      message: "Task submitted successfully",
      data: result,
    });
  }
);

const editSubmission = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const { taskId } = req.params as { taskId: string };
    const { body } = req.body;
    const fileUrl = req.file?.path;
    const result = await taskService.editSubmission(userId, taskId, body, fileUrl);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Submission updated successfully",
      data: result,
    });
  }
);

export const taskController = { getMyTasks, submitTask, editSubmission };
