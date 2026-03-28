import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { teacherNoticeService } from "./teacherNotice.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getNotices = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const { urgency, unread } = req.query;
    const result = await teacherNoticeService.getNotices(userId, {
      ...(urgency && { urgency: urgency as string }),
      ...(unread && { unread: unread as string }),
    });
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Notices fetched successfully",
      data: result,
    });
  }
);

const markAsRead = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user.userId;
    const { id } = req.params as { id: string };
    const result = await teacherNoticeService.markAsRead(userId, id);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Marked as read",
      data: result,
    });
  }
);

export const teacherNoticeController = { getNotices, markAsRead };
