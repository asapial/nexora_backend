import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";

const getTeacherDashboard = async (userId: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!teacherProfile) return null;
  const teacherId = teacherProfile.id;

  const [
    totalClusters,
    totalStudents,
    totalSessions,
    totalCourses,
    totalEnrollments,
    publishedCourses,
    totalResources,
    recentSessions,
    enrollmentData,
    revenueTxns,
  ] = await Promise.all([
    prisma.cluster.count({ where: { teacherId } }),
    prisma.clusterMember.count({
      where: { cluster: { teacherId } },
    }),
    prisma.studySession.count({
      where: { cluster: { teacherId } },
    }),
    prisma.course.count({ where: { teacherId } }),
    prisma.courseEnrollment.count({
      where: { course: { teacherId } },
    }),
    prisma.course.count({
      where: { teacherId, status: "PUBLISHED" },
    }),
    prisma.resource.count({ where: { uploaderId: userId } }),
    prisma.studySession.findMany({
      where: { cluster: { teacherId } },
      orderBy: { scheduledAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        scheduledAt: true,
        status: true,
        cluster: { select: { name: true } },
      },
    }),
    prisma.courseEnrollment.findMany({
      where: { course: { teacherId } },
      select: { enrolledAt: true },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.revenueTransaction.findMany({
      where: { teacherId },
      select: {
        totalAmount: true,
        teacherEarning: true,
        platformEarning: true,
        transactedAt: true,
      },
    }),
  ]);

  // Build enrollment trend (last 6 months)
  const enrollmentTrend: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const count = enrollmentData.filter(
      (e) => new Date(e.enrolledAt) >= startOfMonth && new Date(e.enrolledAt) <= endOfMonth
    ).length;
    enrollmentTrend.push({ month: label, count });
  }

  // Revenue summary
  const totalRevenue = revenueTxns.reduce((sum, t) => sum + t.totalAmount, 0);
  const teacherEarnings = revenueTxns.reduce((sum, t) => sum + t.teacherEarning, 0);

  // Revenue trend (last 6 months)
  const revenueTrend: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const amount = revenueTxns
      .filter((t) => new Date(t.transactedAt) >= startOfMonth && new Date(t.transactedAt) <= endOfMonth)
      .reduce((sum, t) => sum + t.teacherEarning, 0);
    revenueTrend.push({ month: label, amount: Math.round(amount * 100) / 100 });
  }

  return {
    stats: {
      totalClusters,
      totalStudents,
      totalSessions,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalResources,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      teacherEarnings: Math.round(teacherEarnings * 100) / 100,
    },
    enrollmentTrend,
    revenueTrend,
    recentSessions,
  };
};

const getStudentDashboard = async (userId: string) => {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  const [
    totalEnrollments,
    completedCourses,
    activeClusters,
    totalCertificates,
    recentEnrollments,
    courseProgress,
  ] = await Promise.all([
    prisma.courseEnrollment.count({ where: { userId } }),
    prisma.courseEnrollment.count({
      where: { userId, completedAt: { not: null } },
    }),
    studentProfile
      ? prisma.clusterMember.count({
          where: { studentProfileId: studentProfile.id, subtype: "RUNNING" },
        })
      : Promise.resolve(0),
    prisma.certificate.count({ where: { userId } }),
    prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: "desc" },
      take: 5,
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true } },
      },
    }),
    prisma.courseEnrollment.findMany({
      where: { userId },
      select: { progress: true, courseId: true, course: { select: { title: true } } },
    }),
  ]);

  // Build progress distribution
  const progressDistribution = {
    notStarted: courseProgress.filter((c) => c.progress === 0).length,
    inProgress: courseProgress.filter((c) => c.progress > 0 && c.progress < 100).length,
    completed: courseProgress.filter((c) => c.progress >= 100).length,
  };

  return {
    stats: {
      totalEnrollments,
      completedCourses,
      activeClusters,
      totalCertificates,
      averageProgress:
        courseProgress.length > 0
          ? Math.round(courseProgress.reduce((sum, c) => sum + c.progress, 0) / courseProgress.length)
          : 0,
    },
    progressDistribution,
    recentEnrollments: recentEnrollments.map((e) => ({
      id: e.id,
      courseId: e.courseId,
      courseTitle: e.course?.title ?? "Unknown",
      courseThumbnail: e.course?.thumbnailUrl,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
    })),
  };
};

const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalTeachers,
    totalStudents,
    totalAdmins,
    totalClusters,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    pendingApprovals,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: { not: true } } }),
    prisma.user.count({ where: { role: Role.TEACHER } }),
    prisma.user.count({ where: { role: Role.STUDENT } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.cluster.count(),
    prisma.course.count(),
    prisma.courseEnrollment.count(),
    prisma.revenueTransaction.aggregate({ _sum: { platformEarning: true } }),
    prisma.course.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.user.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // User growth trend (last 6 months)
  const userGrowthTrend: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const count = recentUsers.filter(
      (u) => new Date(u.createdAt) >= startOfMonth && new Date(u.createdAt) <= endOfMonth
    ).length;
    userGrowthTrend.push({ month: label, count });
  }

  return {
    stats: {
      totalUsers,
      totalTeachers,
      totalStudents,
      totalAdmins,
      totalClusters,
      totalCourses,
      totalEnrollments,
      platformRevenue: Math.round((totalRevenue._sum.platformEarning ?? 0) * 100) / 100,
      pendingApprovals,
    },
    userGrowthTrend,
  };
};

export const dashboardService = {
  getTeacherDashboard,
  getStudentDashboard,
  getAdminDashboard,
};
