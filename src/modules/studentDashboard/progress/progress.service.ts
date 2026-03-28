import { prisma } from "../../../lib/prisma";

const getProgress = async (userId: string) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!studentProfile) {
    return {
      submissionRate: 0,
      averageScore: 0,
      attendanceRate: 0,
      pendingHomework: [],
      badges: [],
      sessionTimeline: [],
    };
  }

  // ── Task submission rate ───────────────────────────────────────────────────
  const [totalTasks, submittedTasks] = await prisma.$transaction([
    prisma.task.count({ where: { studentProfileId: studentProfile.id } }),
    prisma.task.count({
      where: {
        studentProfileId: studentProfile.id,
        status: { in: ["SUBMITTED", "REVIEWED"] },
      },
    }),
  ]);
  const submissionRate =
    totalTasks > 0 ? Math.round((submittedTasks / totalTasks) * 100) : 0;

  // ── Average score ──────────────────────────────────────────────────────────
  const scoredTasks = await prisma.task.findMany({
    where: {
      studentProfileId: studentProfile.id,
      status: "REVIEWED",
      finalScore: { not: null },
    },
    select: { finalScore: true },
  });
  const averageScore =
    scoredTasks.length > 0
      ? Math.round(
          scoredTasks.reduce((sum, t) => sum + (t.finalScore ?? 0), 0) /
            scoredTasks.length
        )
      : 0;

  // ── Attendance rate ────────────────────────────────────────────────────────
  const [totalAttendance, presentAttendance] = await prisma.$transaction([
    prisma.attendance.count({ where: { studentProfileId: studentProfile.id } }),
    prisma.attendance.count({
      where: {
        studentProfileId: studentProfile.id,
        status: { in: ["PRESENT", "EXCUSED"] },
      },
    }),
  ]);
  const attendanceRate =
    totalAttendance > 0
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 0;

  // ── Pending homework ───────────────────────────────────────────────────────
  const pendingHomework = await prisma.task.findMany({
    where: {
      studentProfileId: studentProfile.id,
      homework: { not: null },
      status: { notIn: ["SUBMITTED", "REVIEWED"] },
    },
    select: {
      id: true,
      title: true,
      homework: true,
      deadline: true,
      StudySession: {
        select: { id: true, title: true, scheduledAt: true },
      },
    },
    orderBy: { deadline: "asc" },
    take: 10,
  });

  // ── Badges ─────────────────────────────────────────────────────────────────
  const badges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      milestone: {
        select: { name: true, badgeIcon: true, criteria: true },
      },
    },
    orderBy: { awardedAt: "desc" },
  });

  // ── Session timeline ───────────────────────────────────────────────────────
  const sessionTimeline = await prisma.attendance.findMany({
    where: { studentProfileId: studentProfile.id },
    include: {
      session: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          status: true,
          cluster: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { markedAt: "desc" },
    take: 20,
  });

  return {
    submissionRate,
    averageScore,
    attendanceRate,
    totalTasks,
    submittedTasks,
    totalAttendance,
    presentAttendance,
    pendingHomework,
    badges,
    sessionTimeline: sessionTimeline.map((a) => ({
      sessionId: a.session.id,
      sessionTitle: a.session.title,
      scheduledAt: a.session.scheduledAt,
      sessionStatus: a.session.status,
      cluster: a.session.cluster,
      attendanceStatus: a.status,
    })),
  };
};

export const progressService = { getProgress };
