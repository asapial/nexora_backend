import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

// ─── Get teacher's sessions with tasks ───────────────────────────────────────
const getSessionsWithTasks = async (teacherId: string) => {
  return prisma.studySession.findMany({
    where: { cluster: { teacherId } },
    include: {
      cluster: { select: { id: true, name: true } },
      tasks: {
        include: {
          submission: true,
          member: { select: { name: true, email: true } },
          studentProfile: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { scheduledAt: "desc" },
  });
};

// ─── Assign task/homework to a session ───────────────────────────────────────
const assignTaskToSession = async (
  teacherId: string,
  sessionId: string,
  payload: {
    title: string;
    description?: string;
    homework?: string;
    deadline?: string;
    memberId?: string;
  }
) => {
  // Verify teacher owns the session via cluster
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { cluster: { select: { teacherId: true } } },
  });
  if (!session) throw new AppError(status.NOT_FOUND, "Session not found.");
  if (session.cluster.teacherId !== teacherId)
    throw new AppError(status.FORBIDDEN, "You do not own this session's cluster.");

  return prisma.task.create({
    data: {
      studySessionId: sessionId,
      title:          payload.title,
      description:    payload.description ?? null,
      homework:       payload.homework    ?? null,
      deadline:       payload.deadline ? new Date(payload.deadline) : null,
      memberId:       payload.memberId   ?? null,
      status:         "PENDING",
    },
    include: {
      StudySession: { select: { id: true, title: true } },
      member:       { select: { name: true, email: true } },
    },
  });
};

// ─── Review a task submission ─────────────────────────────────────────────────
const reviewSubmission = async (
  teacherId: string,
  taskId: string,
  payload: { finalScore: number; reviewNote?: string }
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      StudySession: { include: { cluster: { select: { teacherId: true } } } },
    },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found.");
  if (task.StudySession.cluster.teacherId !== teacherId)
    throw new AppError(status.FORBIDDEN, "Not authorised.");
  if (!task.submission) throw new AppError(status.BAD_REQUEST, "No submission to review.");
  // (submission check done above)

  return prisma.task.update({
    where: { id: taskId },
    data: {
      status:     "REVIEWED",
      finalScore: payload.finalScore,
      reviewNote: payload.reviewNote ?? null,
    },
  });
};

// ─── Get homework management data ─────────────────────────────────────────────
const getHomeworkManagement = async (teacherId: string) => {
  const sessions = await prisma.studySession.findMany({
    where: { cluster: { teacherId } },
    include: {
      cluster: { select: { id: true, name: true } },
      tasks: {
        include: {
          submission: { select: { id: true, submittedAt: true } },
          _count:    { select: { drafts: true } },
        },
      },
      _count: { select: { attendance: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
  return sessions;
};

export const teacherTaskService = {
  getSessionsWithTasks,
  assignTaskToSession,
  reviewSubmission,
  getHomeworkManagement,
};
