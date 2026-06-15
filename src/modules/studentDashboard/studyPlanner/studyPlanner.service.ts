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
    subject?: string;
    priority?: string;
    dueAt?: string | null;
    scheduledAt?: string | null;
    estimatedMinutes?: number | null;
    recurrence?: string;
    tags?: string[];
  }
) => {
  const studentProfile = await prisma.studentProfile.findFirst({ where: { userId } }).catch(() => null);

  return prisma.memberGoal.create({
    data: {
      userId,
      clusterId: payload.clusterId ?? "personal",
      title: payload.title,
      target: payload.target ?? null,
      kanbanStatus: payload.kanbanStatus ?? "TODO",
      isAchieved: payload.kanbanStatus === "DONE",
      achievedAt: payload.kanbanStatus === "DONE" ? new Date() : null,
      subject: payload.subject ?? null,
      priority: payload.priority ?? "MEDIUM",
      dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null,
      estimatedMinutes: payload.estimatedMinutes ?? null,
      recurrence: payload.recurrence ?? "NONE",
      tags: payload.tags ?? [],
      ...(studentProfile?.id ? { studentProfileId: studentProfile.id } : {}),
    },
  });
};

const updateGoal = async (
  userId: string,
  goalId: string,
  payload: {
    title?: string; target?: string; isAchieved?: boolean; kanbanStatus?: string;
    subject?: string; priority?: string; dueAt?: string | null; scheduledAt?: string | null;
    estimatedMinutes?: number | null; completedMinutes?: number; recurrence?: string; tags?: string[];
  }
) => {
  const goal = await prisma.memberGoal.findUnique({ where: { id: goalId } });
  if (!goal) throw new AppError(status.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError(status.FORBIDDEN, "Not your goal");
  const achieved = payload.isAchieved ?? (payload.kanbanStatus !== undefined ? payload.kanbanStatus === "DONE" : undefined);

  const updated = await prisma.memberGoal.update({
    where: { id: goalId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.target !== undefined && { target: payload.target }),
      ...(payload.kanbanStatus !== undefined && { kanbanStatus: payload.kanbanStatus }),
      ...(payload.subject !== undefined && { subject: payload.subject || null }),
      ...(payload.priority !== undefined && { priority: payload.priority }),
      ...(payload.dueAt !== undefined && { dueAt: payload.dueAt ? new Date(payload.dueAt) : null }),
      ...(payload.scheduledAt !== undefined && { scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : null }),
      ...(payload.estimatedMinutes !== undefined && { estimatedMinutes: payload.estimatedMinutes }),
      ...(payload.completedMinutes !== undefined && { completedMinutes: payload.completedMinutes }),
      ...(payload.recurrence !== undefined && { recurrence: payload.recurrence }),
      ...(payload.tags !== undefined && { tags: payload.tags }),
      ...(achieved !== undefined && {
        isAchieved: achieved,
        achievedAt: achieved ? new Date() : null,
      }),
    },
  });

  if (achieved === true && !goal.isAchieved && goal.recurrence !== "NONE") {
    const days = goal.recurrence === "DAILY" ? 1 : 7;
    const shift = (value: Date | null) => value
      ? new Date(value.getTime() + days * 24 * 60 * 60 * 1000)
      : null;
    await prisma.memberGoal.create({
      data: {
        userId: goal.userId,
        clusterId: goal.clusterId,
        title: goal.title,
        target: goal.target,
        kanbanStatus: "TODO",
        subject: goal.subject,
        priority: goal.priority,
        dueAt: shift(goal.dueAt),
        scheduledAt: shift(goal.scheduledAt),
        estimatedMinutes: goal.estimatedMinutes,
        recurrence: goal.recurrence,
        tags: goal.tags,
        studentProfileId: goal.studentProfileId,
      },
    });
  }

  return updated;
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

const logFocus = async (userId: string, goalId: string, minutes: number) => {
  const goal = await prisma.memberGoal.findUnique({ where: { id: goalId }, select: { userId: true } });
  if (!goal) throw new AppError(status.NOT_FOUND, "Goal not found");
  if (goal.userId !== userId) throw new AppError(status.FORBIDDEN, "Not your goal");
  return prisma.memberGoal.update({
    where: { id: goalId },
    data: { completedMinutes: { increment: minutes }, kanbanStatus: "IN_PROGRESS" },
  });
};

const getSummary = async (userId: string) => {
  const goals = await prisma.memberGoal.findMany({ where: { userId } });
  const now = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(now); end.setHours(23, 59, 59, 999);
  const nextWeek = new Date(end); nextWeek.setDate(nextWeek.getDate() + 7);
  const active = goals.filter((goal) => !goal.isAchieved);
  return {
    total: goals.length,
    completed: goals.filter((goal) => goal.isAchieved).length,
    today: active.filter((goal) => goal.scheduledAt && goal.scheduledAt >= start && goal.scheduledAt <= end).length,
    overdue: active.filter((goal) => goal.dueAt && goal.dueAt < now).length,
    upcoming: active.filter((goal) => goal.dueAt && goal.dueAt > end && goal.dueAt <= nextWeek).length,
    estimatedMinutes: active.reduce((sum, goal) => sum + (goal.estimatedMinutes ?? 0), 0),
    completedMinutes: goals.reduce((sum, goal) => sum + goal.completedMinutes, 0),
  };
};

export const studyPlannerService = { getGoals, createGoal, updateGoal, deleteGoal, getStreak, logFocus, getSummary };
