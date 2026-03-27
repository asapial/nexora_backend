import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

interface SubmitPayload {
  videoUrl?: string;
  textBody?: string;
  pdfUrl?: string;
  fileSize?: number;
}

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

// ─── Get single task (by id) ──────────────────────────────────────────────────
const getTaskById = async (userId: string, taskId: string) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!studentProfile) throw new AppError(status.NOT_FOUND, "Student profile not found.");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      StudySession: {
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          cluster: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!task) throw new AppError(status.NOT_FOUND, "Task not found.");
  if (task.studentProfileId !== studentProfile.id) {
    throw new AppError(status.FORBIDDEN, "This task is not assigned to you.");
  }

  return task;
};

const submitTask = async (
  userId: string,
  taskId: string,
  payload: SubmitPayload
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

  // At least one field must be provided
  if (!payload.videoUrl && !payload.textBody && !payload.pdfUrl) {
    throw new AppError(status.BAD_REQUEST, "At least one of videoUrl, textBody, or pdfUrl is required.");
  }

  const [submission] = await prisma.$transaction([
    prisma.taskSubmission.create({
      data: {
        taskId,
        studentProfileId: studentProfile.id,
        body: payload.textBody ?? "",
        videoUrl: payload.videoUrl ?? null,
        textBody: payload.textBody ?? null,
        pdfUrl: payload.pdfUrl ?? null,
        fileSize: payload.fileSize ?? null,
      },
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
  payload: SubmitPayload
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
    data: {
      body: payload.textBody ?? task.submission.body ?? "",
      videoUrl: payload.videoUrl !== undefined ? payload.videoUrl : task.submission.videoUrl,
      textBody: payload.textBody !== undefined ? payload.textBody : task.submission.textBody,
      pdfUrl: payload.pdfUrl !== undefined ? payload.pdfUrl : task.submission.pdfUrl,
      fileSize: payload.fileSize !== undefined ? payload.fileSize : task.submission.fileSize,
    },
  });
};

export const taskService = { getMyTasks, getTaskById, submitTask, editSubmission };
