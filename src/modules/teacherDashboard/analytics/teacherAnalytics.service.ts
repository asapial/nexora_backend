import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

const getAnalytics = async (userId: string) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");
  const tid = teacher.id;

  const [clusters, sessions, resources, tasks, members] = await Promise.all([
    prisma.cluster.count({ where: { teacherId: tid } }),
    prisma.studySession.count({ where: { cluster: { teacherId: tid } } }),
    prisma.resource.count({ where: { uploaderId: userId } }),
    prisma.task.findMany({
      where: { StudySession: { cluster: { teacherId: tid } } },
      select: { status: true, finalScore: true, createdAt: true },
    }),
    prisma.clusterMember.count({ where: { cluster: { teacherId: tid } } }),
  ]);

  const totalTasks = tasks.length;
  const submittedTasks = tasks.filter((t) => t.status === "SUBMITTED" || t.status === "REVIEWED").length;
  const submissionRate = totalTasks > 0 ? Math.round((submittedTasks / totalTasks) * 100) : 0;

  // Monthly task submission trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentTasks = tasks.filter((t) => new Date(t.createdAt) >= sixMonthsAgo);
  const monthlyMap: Record<string, { total: number; submitted: number }> = {};
  for (const t of recentTasks) {
    const key = new Date(t.createdAt).toISOString().slice(0, 7);
    if (!monthlyMap[key]) monthlyMap[key] = { total: 0, submitted: 0 };
    monthlyMap[key].total += 1;
    if (t.status === "SUBMITTED" || t.status === "REVIEWED") monthlyMap[key].submitted += 1;
  }
  const submissionTrend = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      rate: v.total > 0 ? Math.round((v.submitted / v.total) * 100) : 0,
    }));

  // Resource access heatmap (by hour of day - use viewCount as proxy)
  const resourceHeatmap = await prisma.resource.findMany({
    where: { uploaderId: userId },
    select: { viewCount: true, createdAt: true },
  });

  const hourMap: Record<number, number> = {};
  for (const r of resourceHeatmap) {
    const h = new Date(r.createdAt).getHours();
    hourMap[h] = (hourMap[h] ?? 0) + r.viewCount;
  }

  // Member growth (by month joined)
  const memberJoins = await prisma.clusterMember.findMany({
    where: { cluster: { teacherId: tid } },
    select: { joinedAt: true },
    orderBy: { joinedAt: "asc" },
  });
  const memberGrowthMap: Record<string, number> = {};
  for (const m of memberJoins) {
    const key = new Date(m.joinedAt).toISOString().slice(0, 7);
    memberGrowthMap[key] = (memberGrowthMap[key] ?? 0) + 1;
  }
  const memberGrowth = Object.entries(memberGrowthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return {
    totals: { clusters, sessions, resources, members, totalTasks, submittedTasks, submissionRate },
    submissionTrend,
    memberGrowth,
    hourMap,
  };
};

const getSessionHistory = async (
  userId: string,
  params: { clusterId?: string; from?: string; to?: string; page?: number; limit?: number }
) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const { clusterId, from, to, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;
  const where: any = { cluster: { teacherId: teacher.id } };
  if (clusterId) where.clusterId = clusterId;
  if (from || to) {
    where.scheduledAt = {};
    if (from) where.scheduledAt.gte = new Date(from);
    if (to) where.scheduledAt.lte = new Date(to);
  }

  const [sessions, total] = await Promise.all([
    prisma.studySession.findMany({
      where,
      include: {
        cluster: { select: { id: true, name: true } },
        _count: { select: { attendance: true, tasks: true } },
        attendance: { select: { status: true } },
        tasks: { select: { status: true } },
      },
      orderBy: { scheduledAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.studySession.count({ where }),
  ]);

  const enriched = sessions.map((s) => {
    const present = s.attendance.filter((a) => a.status === "PRESENT").length;
    const submitted = s.tasks.filter((t) => t.status === "SUBMITTED" || t.status === "REVIEWED").length;
    return {
      id: s.id,
      title: s.title,
      scheduledAt: s.scheduledAt,
      durationMins: s.durationMins,
      status: s.status,
      cluster: s.cluster,
      attendanceCount: s._count.attendance,
      attendanceRate: s._count.attendance > 0 ? Math.round((present / s._count.attendance) * 100) : 0,
      taskCount: s._count.tasks,
      taskSubmissionRate: s._count.tasks > 0 ? Math.round((submitted / s._count.tasks) * 100) : 0,
    };
  });

  return { data: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Task Templates
const getTemplates = async (userId: string) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.findMany({
    where: { teacherProfileId: teacher.id },
    orderBy: { createdAt: "desc" },
  });
};

const createTemplate = async (userId: string, payload: { title: string; description?: string }) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");
  return prisma.taskTemplate.create({
    data: { teacherId: userId, title: payload.title, description: payload.description, teacherProfileId: teacher.id },
  });
};

const updateTemplate = async (userId: string, id: string, payload: { title?: string; description?: string }) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError(status.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError(status.FORBIDDEN, "Not your template");
  return prisma.taskTemplate.update({ where: { id }, data: payload });
};

const deleteTemplate = async (userId: string, id: string) => {
  const teacher = await prisma.teacherProfile.findFirst({ where: { userId } });
  if (!teacher) throw new AppError(status.NOT_FOUND, "Teacher not found");
  const tpl = await prisma.taskTemplate.findUnique({ where: { id } });
  if (!tpl) throw new AppError(status.NOT_FOUND, "Template not found");
  if (tpl.teacherProfileId !== teacher.id) throw new AppError(status.FORBIDDEN, "Not your template");
  await prisma.taskTemplate.delete({ where: { id } });
  return { deleted: true };
};

export const teacherAnalyticsService = {
  getAnalytics, getSessionHistory,
  getTemplates, createTemplate, updateTemplate, deleteTemplate,
};
