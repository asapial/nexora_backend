import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { teacherTaskService } from "./teacherTask.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getSessionsWithTasks = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await teacherTaskService.getSessionsWithTasks(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Sessions fetched", data: result });
});

const assignTask = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { sessionId } = req.params as { sessionId: string };
  const result = await teacherTaskService.assignTaskToSession(req.user.userId, sessionId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Task assigned", data: result });
});

const reviewSubmission = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { taskId } = req.params as { taskId: string };
  const result = await teacherTaskService.reviewSubmission(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Submission reviewed", data: result });
});

const getHomeworkManagement = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await teacherTaskService.getHomeworkManagement(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Homework data fetched", data: result });
});

export const teacherTaskController = {
  getSessionsWithTasks, assignTask, reviewSubmission, getHomeworkManagement,
};
