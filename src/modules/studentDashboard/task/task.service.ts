import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

const getMyTasks = async (userId: string) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!studentProfile) return [];

  return prisma.task.findMany({
    where: { studentProfileId: studentProfile.id },
    include: {
      StudySession: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          cluster: { select: { id: true, name: true } },
        },
      },
      submission: true,
    },
    orderBy: { deadline: "asc" },
  });
};

const submitTask = async (
  userId: string,
  taskId: string,
  body: string,
  fileUrl?: string
) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!studentProfile) {
    throw new AppError(status.NOT_FOUND, "Student profile not found.");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError(status.FORBIDDEN, "This task is not assigned to you.");
  }
  if (task.submission) {
    throw new AppError(
      status.CONFLICT,
      "Task already submitted. Use PATCH to edit before deadline."
    );
  }
  if (task.deadline && new Date() > new Date(task.deadline)) {
    throw new AppError(status.BAD_REQUEST, "Submission deadline has passed.");
  }

  const [submission] = await prisma.$transaction([
    prisma.taskSubmission.create({
      data: { taskId, userId, body, fileUrl: fileUrl ?? null },
    }),
    prisma.task.update({
      where: { id: taskId },
      data: { status: "SUBMITTED" },
    }),
  ]);

  return submission;
};

const editSubmission = async (
  userId: string,
  taskId: string,
  body: string,
  fileUrl?: string
) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!studentProfile) {
    throw new AppError(status.NOT_FOUND, "Student profile not found.");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { submission: true },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError(status.FORBIDDEN, "This task is not assigned to you.");
  }
  if (!task.submission) {
    throw new AppError(
      status.BAD_REQUEST,
      "No submission found. Use POST to submit first."
    );
  }
  if (task.status === "REVIEWED") {
    throw new AppError(
      status.BAD_REQUEST,
      "Task has already been reviewed and cannot be edited."
    );
  }
  if (task.deadline && new Date() > new Date(task.deadline)) {
    throw new AppError(status.BAD_REQUEST, "Edit deadline has passed.");
  }

  return prisma.taskSubmission.update({
    where: { taskId },
    data: { body, ...(fileUrl && { fileUrl }) },
  });
};

export const taskService = { getMyTasks, submitTask, editSubmission };
