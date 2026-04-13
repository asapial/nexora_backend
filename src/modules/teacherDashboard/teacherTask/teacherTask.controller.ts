import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { teacherTaskService } from "./teacherTask.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getSessionsWithTasks = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await teacherTaskService.getSessionsWithTasks(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Sessions fetched", data: result });
});

const getSessionMembers = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { sessionId } = req.params as { sessionId: string };
  const result = await teacherTaskService.getSessionMembers(req.user.userId, sessionId);
  sendResponse(res, { status: status.OK, success: true, message: "Members fetched", data: result });
});

const getClusterMembersProgress = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { clusterId } = req.params as { clusterId: string };
  const result = await teacherTaskService.getClusterMembersProgress(req.user.userId, clusterId);
  sendResponse(res, { status: status.OK, success: true, message: "Member progress fetched", data: result });
});

const getClusterMembers = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { clusterId } = req.params as { clusterId: string };
  const result = await teacherTaskService.getClusterMembers(req.user.userId, clusterId);
  sendResponse(res, { status: status.OK, success: true, message: "Cluster members fetched", data: result });
});

const assignTask = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { sessionId } = req.params as { sessionId: string };
  const result = await teacherTaskService.assignTaskToSession(req.user.userId, sessionId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Task assigned to all members", data: result });
});

const assignTaskToMember = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { sessionId, studentProfileId } = req.params as { sessionId: string; studentProfileId: string };
  const result = await teacherTaskService.assignTaskToMember(req.user.userId, sessionId, studentProfileId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Task assigned to member", data: result });
});

const updateTask = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { taskId } = req.params as { taskId: string };
  const result = await teacherTaskService.updateTask(req.user.userId, taskId, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Task updated", data: result });
});

const deleteTask = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { taskId } = req.params as { taskId: string };
  const result = await teacherTaskService.deleteTask(req.user.userId, taskId);
  sendResponse(res, { status: status.OK, success: true, message: "Task deleted", data: result });
});

const getSubmissionDetail = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { taskId } = req.params as { taskId: string };
  const result = await teacherTaskService.getSubmissionDetail(req.user.userId, taskId);
  sendResponse(res, { status: status.OK, success: true, message: "Submission detail fetched", data: result });
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
  getSessionsWithTasks,
  getSessionMembers,
  getClusterMembersProgress,
  getClusterMembers,
  assignTask,
  assignTaskToMember,
  updateTask,
  deleteTask,
  getSubmissionDetail,
  reviewSubmission,
  getHomeworkManagement,
};
