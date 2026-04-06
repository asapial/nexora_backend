import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { dashboardService } from "./dashboard.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  let data;
  if (userRole === "TEACHER") {
    data = await dashboardService.getTeacherDashboard(userId);
  } else if (userRole === "STUDENT") {
    data = await dashboardService.getStudentDashboard(userId);
  } else if (userRole === "ADMIN") {
    data = await dashboardService.getAdminDashboard();
  }

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Dashboard stats retrieved",
    data: data ?? {},
  });
});

export const dashboardController = {
  getDashboardStats,
};
