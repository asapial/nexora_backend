import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { studyPlannerService } from "./studyPlanner.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getGoals = catchAsync(async (req: Request, res: Response) => {
  const result = await studyPlannerService.getGoals(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Goals fetched", data: result });
});

const createGoal = catchAsync(async (req: Request, res: Response) => {
  const result = await studyPlannerService.createGoal(req.user.userId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Goal created", data: result });
});

const updateGoal = catchAsync(async (req: Request, res: Response) => {
  const result = await studyPlannerService.updateGoal(req.user.userId, req.params.id, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Goal updated", data: result });
});

const deleteGoal = catchAsync(async (req: Request, res: Response) => {
  const result = await studyPlannerService.deleteGoal(req.user.userId, req.params.id);
  sendResponse(res, { status: status.OK, success: true, message: "Goal deleted", data: result });
});

const getStreak = catchAsync(async (req: Request, res: Response) => {
  const result = await studyPlannerService.getStreak(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Streak fetched", data: result });
});

export const studyPlannerController = { getGoals, createGoal, updateGoal, deleteGoal, getStreak };
