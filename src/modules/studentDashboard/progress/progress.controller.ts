import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { progressService } from "./progress.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getProgress = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const result = await progressService.getProgress(userId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Progress fetched successfully",
      data: result,
    });
  }
);

export const progressController = { getProgress };
