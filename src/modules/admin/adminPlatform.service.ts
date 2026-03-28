import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";

// ─── Platform Analytics ──────────────────────────────────────────────────────

const getPlatformAnalytics = async () => {
  const [
    totalUsers, totalClusters, totalSessions, totalResources, totalEnrollments,
    teacherCount, studentCount, adminCount,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: { not: true } } }),
    prisma.cluster.count(),
    prisma.studySession.count(),
    prisma.resource.count(),
    prisma.courseEnrollment.count(),
    prisma.user.count({ where: { role: Role.TEACHER } }),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    // DAU trend: daily signups for last 30 days
    prisma.user.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
  ]);

  // Signup trend per day
  const signupMap: Record<string, number> = {};
  for (const u of recentUsers) {
    const day = new Date(u.createdAt).toISOString().slice(0, 10);
    signupMap[day] = (signupMap[day] ?? 0) + 1;
  }
  const signupTrend = Object.entries(signupMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // Storage breakdown (resource count by fileType)
  const storageBreakdown = await prisma.resource.groupBy({
    by: ["fileType"],
    _count: { id: true },
  });

  return {
    totals: { totalUsers, totalClusters, totalSessions, totalResources, totalEnrollments, teacherCount, studentCount, adminCount },
    signupTrend,
    storageBreakdown: storageBreakdown.map((s) => ({ fileType: s.fileType, count: s._count.id })),
  };
};

// ─── Global Announcements ────────────────────────────────────────────────────

const getGlobalAnnouncements = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      where: { isGlobal: true },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    prisma.announcement.count({ where: { isGlobal: true } }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const createGlobalAnnouncement = async (
  authorId: string,
  payload: { title: string; body: string; urgency?: string; targetRole?: string; scheduledAt?: string }
) => {
  return prisma.announcement.create({
    data: {
      authorId,
      title: payload.title,
      body: payload.body,
      urgency: (payload.urgency as any) ?? "INFO",
      targetRole: payload.targetRole ? (payload.targetRole as any) : null,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null,
      isGlobal: true,
      publishedAt: payload.scheduledAt ? null : new Date(),
    },
  });
};

const deleteGlobalAnnouncement = async (id: string) => {
  await prisma.announcement.delete({ where: { id } });
  return { deleted: true };
};

// ─── Cluster Oversight ───────────────────────────────────────────────────────

const getClusterOversight = async (params: { page?: number; limit?: number; health?: string }) => {
  const { page = 1, limit = 25, health } = params;
  const skip = (page - 1) * limit;
  const where: any = {};
  if (health) where.healthStatus = health;

  const [data, total] = await Promise.all([
    prisma.cluster.findMany({
      where,
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { members: true, sessions: true } },
      },
      orderBy: { healthScore: "asc" },
      skip, take: limit,
    }),
    prisma.cluster.count({ where }),
  ]);

  const enriched = await Promise.all(
    data.map(async (c) => {
      const lastSession = await prisma.studySession.findFirst({
        where: { clusterId: c.id },
        orderBy: { scheduledAt: "desc" },
        select: { scheduledAt: true, status: true },
      });
      return { ...c, lastSession };
    })
  );

  return { data: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ─── Content Moderation ──────────────────────────────────────────────────────

const getFlaggedContent = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  // Flag heuristic: resources with many comments or recent resources flagged via isPinned
  const [comments, resources] = await Promise.all([
    prisma.resourceComment.findMany({
      where: { isPinned: false },
      include: {
        resource: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      skip, take: Math.floor(limit / 2),
    }),
    prisma.resource.findMany({
      where: { isFeatured: false, visibility: "PUBLIC" },
      select: { id: true, title: true, fileType: true, createdAt: true, uploader: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip, take: Math.ceil(limit / 2),
    }),
  ]);
  return { comments, resources };
};

const removeComment = async (id: string) => {
  await prisma.resourceComment.delete({ where: { id } });
  return { removed: true, type: "comment", id };
};

const warnUser = async (userId: string, reason: string) => {
  // Store as notification
  await prisma.notification.create({
    data: { userId, type: "SYSTEM", title: "Warning", body: reason },
  });
  return { warned: true, userId };
};

// ─── Certificates ────────────────────────────────────────────────────────────

const generateCertificate = async (enrollmentId: string) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
  });
  if (!enrollment) throw new Error("Enrollment not found");

  return prisma.certificate.create({
    data: {
      userId: enrollment.userId,
      courseId: enrollment.courseId ?? undefined,
      title: `${enrollment.course?.title ?? "Course"} — Certificate of Completion`,
    },
  });
};

const getCertificates = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.certificate.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { issuedAt: "desc" },
      skip, take: limit,
    }),
    prisma.certificate.count(),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ─── Enrollment Management ───────────────────────────────────────────────────

const manualEnroll = async (userId: string, courseId: string) => {
  const existing = await prisma.courseEnrollment.findFirst({ where: { userId, courseId } });
  if (existing) return { alreadyEnrolled: true, enrollment: existing };
  return prisma.courseEnrollment.create({
    data: { userId, courseId, paymentStatus: "FREE", amountPaid: 0 },
  });
};

const manualUnenroll = async (userId: string, courseId: string) => {
  await prisma.courseEnrollment.deleteMany({ where: { userId, courseId } });
  return { unenrolled: true };
};

export const adminPlatformService = {
  getPlatformAnalytics,
  getGlobalAnnouncements, createGlobalAnnouncement, deleteGlobalAnnouncement,
  getClusterOversight,
  getFlaggedContent, removeComment, warnUser,
  generateCertificate, getCertificates,
  manualEnroll, manualUnenroll,
};
