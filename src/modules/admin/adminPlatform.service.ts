import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

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
    prisma.user.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
  ]);

  const signupMap: Record<string, number> = {};
  for (const u of recentUsers) {
    const day = new Date(u.createdAt).toISOString().slice(0, 10);
    signupMap[day] = (signupMap[day] ?? 0) + 1;
  }
  const signupTrend = Object.entries(signupMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

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
  // Return both global announcements AND personal notices sent by admins
  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    prisma.announcement.count(),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const createGlobalAnnouncement = async (
  authorId: string,
  payload: {
    title: string;
    body: string;
    urgency?: string;
    targetRole?: string;
    targetUserId?: string;
    scheduledAt?: string;
  }
) => {
  return prisma.announcement.create({
    data: {
      authorId,
      title: payload.title,
      body: payload.body,
      urgency: (payload.urgency as any) ?? "INFO",
      targetRole: payload.targetRole ? (payload.targetRole as any) : null,
      targetUserId: payload.targetUserId ?? null,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null,
      isGlobal: !payload.targetUserId, // Personal notices are not global
      publishedAt: payload.scheduledAt ? null : new Date(),
    },
    include: { author: { select: { id: true, name: true, email: true } } },
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
  const [courses, resources] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
        teacher: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Math.ceil(limit / 2),
    }),
    prisma.resource.findMany({
      where: { visibility: "PUBLIC" },
      select: {
        id: true,
        title: true,
        fileType: true,
        createdAt: true,
        uploader: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Math.floor(limit / 2),
    }),
  ]);
  return { courses, resources };
};

const removeCourse = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found");
  await prisma.course.delete({ where: { id } });
  return { removed: true, type: "course", id };
};

const removeResource = async (id: string) => {
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) throw new AppError(status.NOT_FOUND, "Resource not found");
  await prisma.resource.delete({ where: { id } });
  return { removed: true, type: "resource", id };
};

const warnUser = async (userId: string, reason: string) => {
  await prisma.notification.create({
    data: { userId, type: "SYSTEM", title: "Warning from Admin", body: reason },
  });
  return { warned: true, userId };
};

const getWarnings = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId, type: "SYSTEM", title: "Warning from Admin" },
    orderBy: { createdAt: "desc" },
  });
};

const removeWarning = async (warningId: string) => {
  const warning = await prisma.notification.findUnique({ where: { id: warningId } });
  if (!warning) throw new AppError(status.NOT_FOUND, "Warning not found");
  await prisma.notification.delete({ where: { id: warningId } });
  return { removed: true, id: warningId };
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
  if (!enrollment) throw new AppError(status.NOT_FOUND, "Enrollment not found");

  // Check if certificate already exists
  const existing = await prisma.certificate.findFirst({
    where: { userId: enrollment.userId, courseId: enrollment.courseId ?? undefined },
  });
  if (existing) throw new AppError(status.CONFLICT, "Certificate already issued for this enrollment");

  const cert = await prisma.certificate.create({
    data: {
      userId: enrollment.userId,
      courseId: enrollment.courseId ?? undefined,
      title: `${enrollment.course?.title ?? "Course"} — Certificate of Completion`,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
  return {
    ...cert,
    course: enrollment.course ? { id: enrollment.course.id, title: enrollment.course.title } : null,
  };
};

const getCertificates = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.certificate.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { issuedAt: "desc" },
      skip, take: limit,
    }),
    prisma.certificate.count(),
  ]);

  // Manually enrich with course titles
  const courseIds = [...new Set(data.map(c => c.courseId).filter(Boolean))] as string[];
  const courses = courseIds.length
    ? await prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } })
    : [];
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.title]));

  return {
    data: data.map(c => ({
      ...c,
      verificationCode: c.verifyCode, // alias to match frontend expectation
      course: c.courseId ? { id: c.courseId, title: courseMap[c.courseId] ?? c.courseId } : null,
    })),
    total, page, limit, totalPages: Math.ceil(total / limit),
  };
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

// ─── Email Templates ─────────────────────────────────────────────────────────

const DEFAULT_TEMPLATES = [
  {
    slug: "teacherWelcome",
    name: "Teacher Welcome",
    subject: "Welcome to Nexora — Your Teacher Account",
    description: "Sent when a new teacher account is created or promoted",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="color:#6d28d9;">Welcome to Nexora 🎉</h1>
    <p>Hi <%= name %>,</p>
    <p>Your teacher account is ready.</p>
    <a href="<%= loginUrl %>" style="display:inline-block;background:#6d28d9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Log In Now</a>
  </div>
</body>
</html>`,
  },
  {
    slug: "taskReminder",
    name: "Task Reminder",
    subject: "Reminder: Task due soon",
    description: "Sent to students when a task deadline is approaching",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="color:#d97706;">⏰ Task Reminder</h1>
    <p>Hi <%= name %>,</p>
    <p>Your task <strong><%= taskTitle %></strong> is due on <strong><%= dueDate %></strong>.</p>
    <a href="<%= taskUrl %>" style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Task</a>
  </div>
</body>
</html>`,
  },
  {
    slug: "deadlineAlert",
    name: "Deadline Alert",
    subject: "URGENT: Deadline in 24 hours",
    description: "Sent 24 hours before a task or session deadline",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;border-left:4px solid #ef4444;">
    <h1 style="color:#ef4444;">🚨 Deadline Alert</h1>
    <p>Hi <%= name %>,</p>
    <p><strong><%= itemTitle %></strong> is due in less than 24 hours!</p>
    <a href="<%= itemUrl %>" style="display:inline-block;background:#ef4444;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Take Action Now</a>
  </div>
</body>
</html>`,
  },
  {
    slug: "credentialReset",
    name: "Credential Reset",
    subject: "Nexora — Password Reset",
    description: "Sent when an admin resets a user's password",
    body: `<!DOCTYPE html>
<html>
<body style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;">
  <div style="background:white;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
    <h1 style="color:#0ea5e9;">🔐 Password Reset</h1>
    <p>Hi <%= name %>,</p>
    <p>Your password has been reset. New Password: <strong><%= password %></strong></p>
    <a href="<%= loginUrl %>" style="display:inline-block;background:#0ea5e9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Log In</a>
  </div>
</body>
</html>`,
  },
];

const seedDefaultTemplates = async () => {
  for (const t of DEFAULT_TEMPLATES) {
    await (prisma as any).emailTemplate.upsert({
      where: { slug: t.slug },
      create: t,
      update: {},
    });
  }
};

const getEmailTemplates = async () => {
  const templates = await (prisma as any).emailTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });
  if (templates.length === 0) {
    await seedDefaultTemplates();
    return (prisma as any).emailTemplate.findMany({ orderBy: { updatedAt: "desc" } });
  }
  return templates;
};

const createEmailTemplate = async (payload: {
  name: string; slug: string; subject: string; description?: string; body: string;
}) => {
  return (prisma as any).emailTemplate.create({ data: payload });
};

const updateEmailTemplate = async (id: string, payload: Partial<{
  name: string; subject: string; description: string; body: string;
}>) => {
  return (prisma as any).emailTemplate.update({ where: { id }, data: payload });
};

const deleteEmailTemplate = async (id: string) => {
  await (prisma as any).emailTemplate.delete({ where: { id } });
  return { deleted: true };
};

export const adminPlatformService = {
  getPlatformAnalytics,
  getGlobalAnnouncements, createGlobalAnnouncement, deleteGlobalAnnouncement,
  getClusterOversight,
  getFlaggedContent, removeCourse, removeResource, warnUser, getWarnings, removeWarning,
  generateCertificate, getCertificates,
  manualEnroll, manualUnenroll,
  getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate,
};
