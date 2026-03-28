import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";
import { studentMissionService } from "./studentMission.service";

const getContents = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const userId = req.user!.userId;
  const { missionId } = req.params as { missionId: string };
  const data = await studentMissionService.getMissionContentsForStudent(userId, missionId);
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Mission contents retrieved",
    data,
  });
});

export const studentMissionController = { getContents };
