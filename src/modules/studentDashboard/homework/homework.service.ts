import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

const getHomework = async (userId: string) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!studentProfile) return [];

  return prisma.task.findMany({
    where: {
      studentProfileId: studentProfile.id
    },
    include: {
      StudySession: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          cluster: { select: { id: true, name: true } },
        },
      },
      submission: { select: { id: true, submittedAt: true } },
    },
    orderBy: { deadline: "asc" },
  });
};

const markHomeworkDone = async (userId: string, taskId: string) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!studentProfile) {
    throw new AppError(status.NOT_FOUND, "Student profile not found.");
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError(status.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.homework) {
    throw new AppError(status.BAD_REQUEST, "This task has no homework.");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { status: "SUBMITTED" },
    select: { id: true, status: true },
  });
};

export const homeworkService = { getHomework, markHomeworkDone };
