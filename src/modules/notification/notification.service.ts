import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { currentUserNotificationWhere } from "./notification.utils";

type NotificationListQuery = {
  type?: string;
  unread?: boolean;
  limit: number;
};

const listForCurrentUser = async (userId: string, query: NotificationListQuery) => {
  const typeFilter = query.type ? { type: query.type } : {};
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId,
        ...typeFilter,
        ...(query.unread === undefined ? {} : { isRead: !query.unread ? true : false }),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: query.limit,
    }),
    prisma.notification.count({
      where: { userId, ...typeFilter, isRead: false },
    }),
  ]);

  return { notifications, unreadCount };
};

const markReadForCurrentUser = async (userId: string, notificationId: string) => {
  const result = await prisma.notification.updateMany({
    where: currentUserNotificationWhere(userId, notificationId),
    data: { isRead: true },
  });
  if (result.count === 0) throw new AppError(status.NOT_FOUND, "Notification not found");

  return prisma.notification.findFirst({
    where: currentUserNotificationWhere(userId, notificationId),
  });
};

export const notificationService = { listForCurrentUser, markReadForCurrentUser };
