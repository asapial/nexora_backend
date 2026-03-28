import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { EarningsQueryParams, updateTeacherProfileType } from "./teacher.type";


const getTeacherIdByUserId = async (userId: string) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  return profile.id;
};


const getTeacherProfile = async (userId: string) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  }

  // Ensure the user is not soft-deleted
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User account is deactivated.");
  }

  return profile;
};

const updateTeacherProfile = async (
  userId: string,
  data: updateTeacherProfileType["body"]
) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  }

  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );

  const updatedProfile = await prisma.teacherProfile.update({
    where: { userId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedProfile;
};

const deleteTeacherProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User account not found or already deleted.");
  }

  // Soft delete by updating User table
  await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      isActive: false,
    },
  });

  return { deleted: true, userId };
};


// ─────────────────────────────────────────────────────────
// EARNINGS
// ─────────────────────────────────────────────────────────

const num = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const getEarningsSummary = async (userId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const agg = await prisma.revenueTransaction.aggregate({
    where: { teacherId },
    _sum: { teacherEarning: true, totalAmount: true },
  });

  const revenueByCourse = await prisma.revenueTransaction.groupBy({
    by: ["courseId"],
    where: { teacherId },
    _sum: { teacherEarning: true, totalAmount: true },
    _count: { id: true },
  });
  const revenueMap = Object.fromEntries(
    revenueByCourse.map((row) => [
      row.courseId,
      {
        teacherEarning: num(row._sum.teacherEarning),
        totalAmount: num(row._sum.totalAmount),
        txCount: row._count.id,
      },
    ])
  );

  const teacherCourses = await prisma.course.findMany({
    where: { teacherId },
    select: {
      id: true,
      title: true,
      teacherRevenuePercent: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { title: "asc" },
  });

  const perCourse = teacherCourses.map((c) => {
    const rev = revenueMap[c.id];
    return {
      courseId: c.id,
      courseTitle: c.title,
      teacherRevenuePercent: num(c.teacherRevenuePercent) || 70,
      _sum: {
        teacherEarning: rev?.teacherEarning ?? 0,
        totalAmount: rev?.totalAmount ?? 0,
      },
      _count: { id: c._count.enrollments },
    };
  });

  const paidEnrollmentCount = await prisma.revenueTransaction.count({ where: { teacherId } });
  const totalEnrollmentCount = teacherCourses.reduce((acc, c) => acc + c._count.enrollments, 0);

  const now = new Date();
  const monthlyAgg = await Promise.all(
    Array.from({ length: 8 }, (_, i) => {
      const offset = 7 - i;
      const start = new Date(now.getFullYear(), now.getMonth() - offset, 1, 0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59, 999);
      return prisma.revenueTransaction.aggregate({
        where: { teacherId, transactedAt: { gte: start, lte: end } },
        _sum: { teacherEarning: true },
      });
    })
  );
  const monthlyEarningsTrend = monthlyAgg.map((m) => num(m._sum.teacherEarning));

  return {
    totalEarned: num(agg._sum.teacherEarning),
    totalRevenue: num(agg._sum.totalAmount),
    paidEnrollmentCount,
    totalEnrollmentCount,
    monthlyEarningsTrend,
    perCourse,
  };
};

const getTransactions = async (userId: string, query: EarningsQueryParams) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const page = Math.max(1, num((query as any).page) || 1);
  const limit = Math.min(100, Math.max(1, num((query as any).limit) || 20));
  const search = (query as any).search as string | undefined;
  const courseId = (query as any).courseId as string | undefined;

  const where: any = { teacherId };
  if (courseId) where.courseId = courseId;
  if (search?.trim()) {
    const q = search.trim();
    const [users, courses] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      }),
      prisma.course.findMany({
        where: { title: { contains: q, mode: "insensitive" }, teacherId },
        select: { id: true },
      }),
    ]);
    if (users.length === 0 && courses.length === 0) {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }
    const ids = [...users.map((u) => u.id)];
    const courseIds = [...courses.map((c) => c.id)];
    const orClause: any[] = [];
    if (ids.length) orClause.push({ studentId: { in: ids } });
    if (courseIds.length) orClause.push({ courseId: { in: courseIds } });
    where.AND = [{ OR: orClause }];
  }

  const [total, transactions] = await Promise.all([
    prisma.revenueTransaction.count({ where }),
    prisma.revenueTransaction.findMany({
      where,
      orderBy: { transactedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const userIds = [...new Set(transactions.map((t) => t.studentId))];
  const cIds = [...new Set(transactions.map((t) => t.courseId))];
  const [users, courseRows] = await Promise.all([
    userIds.length
      ? prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        })
      : Promise.resolve([]),
    cIds.length
      ? prisma.course.findMany({
          where: { id: { in: cIds } },
          select: { id: true, title: true },
        })
      : Promise.resolve([]),
  ]);
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
  const courseMap = Object.fromEntries(courseRows.map((c) => [c.id, c]));

  const rows = transactions.map((t) => {
    const u = userMap[t.studentId];
    const c = courseMap[t.courseId];
    return {
      id: t.id,
      enrollmentId: t.enrollmentId,
      courseId: t.courseId,
      studentId: t.studentId,
      transactedAt:
        t.transactedAt instanceof Date ? t.transactedAt.toISOString() : String(t.transactedAt),
      totalAmount: num(t.totalAmount),
      teacherPercent: num(t.teacherPercent),
      teacherEarning: num(t.teacherEarning),
      platformEarning: num(t.platformEarning),
      studentName: u?.name ?? u?.email ?? "Student",
      courseTitle: c?.title ?? "Course",
    };
  });

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) || 0 };
};

export const teacherService = {
  getTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
  getEarningsSummary,
  getTransactions
};