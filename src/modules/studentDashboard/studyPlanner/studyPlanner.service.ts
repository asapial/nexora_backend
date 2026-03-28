import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

export type GoalStatus = "TODO" | "IN_PROGRESS" | "DONE";

const getGoals = async (userId: string) => {
  const goals = await prisma.memberGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return goals;
};

const createGoal = async (
  userId: string,
  payload: {
    title: string;
    target?: string;
    clusterId?: string;
    kanbanStatus?: GoalStatus;
    dailyTarget?: number;
    weeklyTarget?: number;
  }
) => {
  const studentProfile = await prisma.studentProfile.findFirst({ where: { userId } });

  return prisma.memberGoal.create({
    data: {
      userId,
      clusterId: payload.clusterId ?? "personal",
      title: payload.title,
      target: payload.target,
      studentProfileId: studentProfile?.id,
    },
  });
};

const updateGoal = async (
  userId: string,
  goalId: string,
  payload: { title?: string; target?: string; isAchieved?: boolean }
) => {
  const goal = await prisma.memberGoal.findUnique({ where: { id: goalId } });
  if (!goal) throw new AppError(status.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError(status.FORBIDDEN, "Not your goal");

  return prisma.memberGoal.update({
    where: { id: goalId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.target !== undefined && { target: payload.target }),
      ...(payload.isAchieved !== undefined && {
        isAchieved: payload.isAchieved,
        achievedAt: payload.isAchieved ? new Date() : null,
      }),
    },
  });
};

const deleteGoal = async (userId: string, goalId: string) => {
  const goal = await prisma.memberGoal.findUnique({ where: { id: goalId } });
  if (!goal) throw new AppError(status.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError(status.FORBIDDEN, "Not your goal");
  await prisma.memberGoal.delete({ where: { id: goalId } });
  return { deleted: true };
};

// Compute streak: consecutive days with achieved goals
const getStreak = async (userId: string) => {
  const achieved = await prisma.memberGoal.findMany({
    where: { userId, isAchieved: true, achievedAt: { not: null } },
    select: { achievedAt: true },
    orderBy: { achievedAt: "desc" },
  });

  if (!achieved.length) return { streak: 0, lastAchievedAt: null };

  let streak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  const daysSet = new Set(
    achieved.map((a) => {
      const d = new Date(a.achievedAt!);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    })
  );

  for (let i = 0; i < 365; i++) {
    if (daysSet.has(checkDate.toISOString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, lastAchievedAt: achieved[0]?.achievedAt ?? null };
};

export const studyPlannerService = { getGoals, createGoal, updateGoal, deleteGoal, getStreak };
