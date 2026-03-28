import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { studentClusterService } from "./studentCluster.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getMyCluster = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const result = await studentClusterService.getMyCluster(userId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Clusters fetched successfully",
      data: result,
    });
  }
);

const getClusterDetail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const { clusterId } = req.params as { clusterId: string };
    const result = await studentClusterService.getClusterDetail(
      userId,
      clusterId
    );
    if (!result) {
      return sendResponse(res, {
        status: status.NOT_FOUND,
        success: false,
        message: "Cluster not found or you are not a member",
      });
    }
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Cluster detail fetched",
      data: result,
    });
  }
);

export const studentClusterController = { getMyCluster, getClusterDetail };
