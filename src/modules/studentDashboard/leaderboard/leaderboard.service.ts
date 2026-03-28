import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

const getLeaderboard = async (
  userId: string,
  params: { clusterId?: string; period?: "weekly" | "all-time" }
) => {
  const { clusterId, period = "all-time" } = params;

  // Get the student profile
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { userId },
  });
  if (!studentProfile) throw new AppError(status.NOT_FOUND, "Student profile not found");

  // Build date filter for weekly
  const since =
    period === "weekly"
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : undefined;

  // Determine clusters to include
  let clusterIds: string[];
  if (clusterId) {
    clusterIds = [clusterId];
  } else {
    const memberships = await prisma.clusterMember.findMany({
      where: { userId },
      select: { clusterId: true },
    });
    clusterIds = memberships.map((m) => m.clusterId);
  }

  if (!clusterIds.length) return { entries: [], myEntry: null };

  // Aggregate: tasks reviewed (finalScore) + attendance per user per cluster
  const [taskAgg, attendanceAgg, members] = await Promise.all([
    // Task scores
    prisma.task.findMany({
      where: {
        status: "REVIEWED",
        StudySession: { clusterId: { in: clusterIds } },
        ...(since && { updatedAt: { gte: since } }),
        NOT: { finalScore: null },
      },
      select: {
        studentProfileId: true,
        finalScore: true,
        StudySession: { select: { clusterId: true } },
      },
    }),
    // Attendance
    prisma.attendance.findMany({
      where: {
        status: "PRESENT",
        session: { clusterId: { in: clusterIds } },
        ...(since && { markedAt: { gte: since } }),
      },
      select: { studentProfileId: true },
    }),
    // All members in clusters
    prisma.clusterMember.findMany({
      where: { clusterId: { in: clusterIds }, studentProfileId: { not: null } },
      include: {
        user: { select: { id: true, name: true, image: true } },
        studentProfile: { select: { id: true } },
      },
    }),
  ]);

  // Build score map: studentProfileId → { taskScore, attendanceCount }
  const scoreMap: Record<string, { taskScore: number; taskCount: number; attendanceCount: number; userId: string; name: string; image: string | null }> = {};

  for (const m of members) {
    if (!m.studentProfileId) continue;
    if (!scoreMap[m.studentProfileId]) {
      scoreMap[m.studentProfileId] = {
        taskScore: 0,
        taskCount: 0,
        attendanceCount: 0,
        userId: m.userId,
        name: m.user.name,
        image: m.user.image,
      };
    }
  }

  for (const t of taskAgg) {
    if (!scoreMap[t.studentProfileId]) continue;
    scoreMap[t.studentProfileId].taskScore += t.finalScore ?? 0;
    scoreMap[t.studentProfileId].taskCount += 1;
  }

  for (const a of attendanceAgg) {
    if (!a.studentProfileId || !scoreMap[a.studentProfileId]) continue;
    scoreMap[a.studentProfileId].attendanceCount += 1;
  }

  // Compute composite score: avg task score * 60% + attendance * 40% (max 10 each)
  const entries = Object.entries(scoreMap)
    .map(([spId, v]) => {
      const avgTask = v.taskCount > 0 ? v.taskScore / v.taskCount : 0;
      const composite = Math.round((avgTask * 0.6 + Math.min(v.attendanceCount, 10) * 0.4) * 10) / 10;
      return { studentProfileId: spId, userId: v.userId, name: v.name, image: v.image, taskScore: Math.round(avgTask * 10) / 10, taskCount: v.taskCount, attendanceCount: v.attendanceCount, composite };
    })
    .sort((a, b) => b.composite - a.composite)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const myEntry = entries.find((e) => e.userId === userId) ?? null;

  return { entries: entries.slice(0, 50), myEntry, period, clusterId };
};

const optIn = async (userId: string) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const privacy = (settings?.privacy as Record<string, unknown>) ?? {};
  await prisma.userAccountSettings.upsert({
    where: { userId },
    create: { userId, privacy: { ...privacy, leaderboardOptIn: true } },
    update: { privacy: { ...privacy, leaderboardOptIn: true } },
  });
  return { leaderboardOptIn: true };
};

const optOut = async (userId: string) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const privacy = (settings?.privacy as Record<string, unknown>) ?? {};
  await prisma.userAccountSettings.upsert({
    where: { userId },
    create: { userId, privacy: { ...privacy, leaderboardOptIn: false } },
    update: { privacy: { ...privacy, leaderboardOptIn: false } },
  });
  return { leaderboardOptIn: false };
};

const getMyOptInStatus = async (userId: string) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const privacy = (settings?.privacy as Record<string, unknown>) ?? {};
  return { leaderboardOptIn: privacy.leaderboardOptIn ?? false };
};

export const leaderboardService = { getLeaderboard, optIn, optOut, getMyOptInStatus };
