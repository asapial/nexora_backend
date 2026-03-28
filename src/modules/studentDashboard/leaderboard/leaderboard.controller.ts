import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { leaderboardService } from "./leaderboard.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getLeaderboard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { clusterId, period } = req.query as { clusterId?: string; period?: "weekly" | "all-time" };
  const result = await leaderboardService.getLeaderboard(userId, { clusterId, period });
  sendResponse(res, { status: status.OK, success: true, message: "Leaderboard fetched", data: result });
});

const optIn = catchAsync(async (req: Request, res: Response) => {
  const result = await leaderboardService.optIn(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Opted in to leaderboard", data: result });
});

const optOut = catchAsync(async (req: Request, res: Response) => {
  const result = await leaderboardService.optOut(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Opted out of leaderboard", data: result });
});

const getMyOptInStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await leaderboardService.getMyOptInStatus(req.user.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Opt-in status", data: result });
});

export const leaderboardController = { getLeaderboard, optIn, optOut, getMyOptInStatus };
