import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { notificationService } from "./notification.service";

type NotificationListQuery = {
  type?: string;
  unread?: boolean;
  limit: number;
};

const list = catchAsync(async (req: Request, res: Response) => {
  const query = (req as Request & { validatedQuery: NotificationListQuery; }).validatedQuery;
  const data = await notificationService.listForCurrentUser(req.user.userId, query);
  sendResponse(res, { status: status.OK, success: true, message: "Notifications", data });
});

const markRead = catchAsync(async (req: Request, res: Response) => {
  const data = await notificationService.markReadForCurrentUser(req.user.userId, req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Notification marked as read", data });
});

export const notificationController = { list, markRead };
