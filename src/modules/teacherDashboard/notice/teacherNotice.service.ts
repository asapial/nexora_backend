import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const getNotices = async (
  userId: string,
  filters: { urgency?: string; unread?: string }
) => {
  const readRecords: { announcementId: string }[] = await db.announcementRead.findMany({
    where: { userId },
    select: { announcementId: true },
  });
  const readIds = new Set(readRecords.map((r: { announcementId: string }) => r.announcementId));

  const where: Record<string, unknown> = {
    OR: [
      // Global announcements targeting all users
      { isGlobal: true, targetRole: null, targetUserId: null },
      // Targeted to teachers only
      { isGlobal: true, targetRole: "TEACHER" },
      // Personal notice to this specific user
      { targetUserId: userId },
    ],
  };

  if (filters.urgency) where.urgency = filters.urgency;

  const announcements = await prisma.announcement.findMany({
    where,
    include: {
      author: { select: { name: true, email: true } },
      clusters: { include: { cluster: { select: { id: true, name: true } } } },
    },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
  });

  const result = announcements.map((a: any) => ({
    ...a,
    isRead: readIds.has(a.id),
    isPersonal: !!a.targetUserId,
  }));

  if (filters.unread === "true") return result.filter((a: any) => !a.isRead);
  if (filters.unread === "false") return result.filter((a: any) => a.isRead);
  return result;
};

const markAsRead = async (userId: string, announcementId: string) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
  });
  if (!announcement) throw new AppError(status.NOT_FOUND, "Announcement not found.");

  await db.announcementRead.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    create: { announcementId, userId },
    update: { readAt: new Date() },
  });

  return { marked: true };
};

export const teacherNoticeService = { getNotices, markAsRead };
