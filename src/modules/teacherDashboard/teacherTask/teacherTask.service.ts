import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

// ─── Get teacher's sessions with tasks ───────────────────────────────────────
const getSessionsWithTasks = async (teacherUserId: string) => {

  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  })

  if (!teacherProfile) {
    throw new AppError(status.CONTINUE, "Teacher is not found");

  }

  const teacherId = teacherProfile.id;

  console.log("getSessionsWithTasks")
  return prisma.studySession.findMany({
    where: { cluster: { teacherId } },
    include: {
      cluster: { select: { id: true, name: true } },
      tasks: {
        include: {
          submission: true,
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
  teacherUserId: string,
  sessionId: string,
  payload: {
    title: string;
    description?: string;
    homework?: string;
    deadline?: string;
  }
) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
  });

  if (!teacherProfile) {
    throw new AppError(status.NOT_FOUND, "Teacher not found");
  }

  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      cluster: {
        select: {
          teacherId: true,
          members: {
            where: { subtype: "RUNNING" },
            select: { studentProfileId: true },
          },
        },
      },
    },
  });

  if (!session) throw new AppError(status.NOT_FOUND, "Session not found");

  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError(status.FORBIDDEN, "Unauthorized");
  }

  const members = session.cluster.members;

  if (!members.length) {
    throw new AppError(status.NOT_FOUND, "No active members found");
  }

  await prisma.task.createMany({
    data: members.map((m) => ({
      studySessionId: sessionId,
      title: payload.title,
      description: payload.description ?? null,
      homework: payload.homework ?? null,
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      status: "PENDING",
      studentProfileId: m.studentProfileId!,
    })),
  });

  return { tasksCreated: members.length };
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
      status: "REVIEWED",
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
          _count: { select: { drafts: true } },
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
