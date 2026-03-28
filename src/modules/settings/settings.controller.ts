import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { settingsService } from "./settings.service";

const getAccount = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const userId = req.user!.userId;
  const data = await settingsService.getAccount(userId);
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Account settings retrieved",
    data,
  });
});

const updateAccount = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const userId = req.user!.userId;
  const data = await settingsService.updateAccount(userId, req.body);
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Account updated",
    data,
  });
});

export const settingsController = { getAccount, updateAccount };
