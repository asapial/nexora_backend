import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

// ─── Get my clusters (for teacher) ───────────────────────────────────────────
const getMyClusters = async (teacherUserId: string) => {
  
    const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  })

  if (!teacherProfile) {
    throw new AppError(status.CONTINUE, "Teacher is not found");

  }

  const teacherId = teacherProfile.id;

  
  return prisma.cluster.findMany({
    where: { teacherId },
    select: { id: true, name: true, _count: { select: { members: true } } },
    orderBy: { name: "asc" },
  });
};

// ─── Get announcements for teacher ───────────────────────────────────────────
const getMyAnnouncements = async (authorId: string) => {
  return prisma.announcement.findMany({
    where: { authorId },
    include: {
      clusters: { include: { cluster: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ─── Create announcement ──────────────────────────────────────────────────────
const createAnnouncement = async (
  authorId: string,
  payload: {
    title: string;
    body: string;
    urgency?: "INFO" | "IMPORTANT" | "CRITICAL";
    clusterIds?: string[];
    isGlobal?: boolean;
    scheduledAt?: string;
  }
) => {
  const { title, body, urgency = "INFO", clusterIds = [], isGlobal = false, scheduledAt } = payload;

  const announcement = await prisma.announcement.create({
    data: {
      authorId,
      title,
      body,
      urgency,
      isGlobal,
      publishedAt: scheduledAt ? null : new Date(),
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      clusters: {
        create: clusterIds.map((clusterId) => ({ clusterId })),
      },
    },
    include: {
      clusters: { include: { cluster: { select: { id: true, name: true } } } },
    },
  });

  return announcement;
};

// ─── Delete announcement ──────────────────────────────────────────────────────
const deleteAnnouncement = async (authorId: string, id: string) => {
  const ann = await prisma.announcement.findUnique({ where: { id } });
  if (!ann) throw new AppError(status.NOT_FOUND, "Announcement not found.");
  if (ann.authorId !== authorId) throw new AppError(status.FORBIDDEN, "Not your announcement.");
  await prisma.announcementCluster.deleteMany({ where: { announcementId: id } });
  return prisma.announcement.delete({ where: { id } });
};

export const announcementService = {
  getMyClusters,
  getMyAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
