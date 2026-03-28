import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

const getNotices = async (
  userId: string,
  filters: { clusterId?: string; urgency?: string; unread?: string }
) => {
  const memberships = await prisma.clusterMember.findMany({
    where: { userId },
    select: { clusterId: true },
  });
  const clusterIds = memberships.map((m) => m.clusterId);

  const readRecords: { announcementId: string }[] = await db.announcementRead.findMany({
    where: { userId },
    select: { announcementId: true },
  });
  const readIds = new Set(readRecords.map((r) => r.announcementId));

  const where: Record<string, unknown> = {
    OR: [
      { isGlobal: true },
      {
        clusters: {
          some: {
            clusterId: filters.clusterId
              ? filters.clusterId
              : { in: clusterIds },
          },
        },
      },
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

  const result = announcements.map((a) => ({ ...a, isRead: readIds.has(a.id) }));

  if (filters.unread === "true") return result.filter((a) => !a.isRead);
  if (filters.unread === "false") return result.filter((a) => a.isRead);
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

export const noticeService = { getNotices, markAsRead };
