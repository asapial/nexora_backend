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
    throw new AppError(status.NOT_FOUND, "Teacher is not found");
  }

  const teacherId = teacherProfile.id;

  return prisma.studySession.findMany({
    where: { cluster: { teacherId } },
    include: {
      cluster: { select: { id: true, name: true } },
      tasks: {
        include: {
          submission: true,
          studentProfile: { include: { user: { select: { name: true, email: true, image: true } } } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { scheduledAt: "desc" },
  });
};

// ─── Get session members with their tasks ─────────────────────────────────────
const getSessionMembers = async (teacherUserId: string, sessionId: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      cluster: {
        select: {
          teacherId: true,
          members: {
            where: { subtype: "RUNNING", studentProfileId: { not: null } },
            include: {
              studentProfile: {
                include: {
                  user: { select: { id: true, name: true, email: true, image: true } },
                },
              },
            },
          },
        },
      },
      tasks: {
        include: {
          submission: { select: { id: true, submittedAt: true, videoUrl: true, textBody: true, pdfUrl: true } },
        },
      },
    },
  });

  if (!session) throw new AppError(status.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError(status.FORBIDDEN, "Unauthorized");
  }

  // Map members to their assigned task (if any) for this session
  return session.cluster.members.map((m) => {
    const task = session.tasks.find(
      (t) => t.studentProfileId === m.studentProfileId
    ) ?? null;

    return {
      studentProfileId: m.studentProfileId,
      userId: m.studentProfile?.user?.id ?? null,
      name: m.studentProfile?.user?.name ?? "Unknown",
      email: m.studentProfile?.user?.email ?? "",
      image: m.studentProfile?.user?.image ?? null,
      task: task
        ? {
            id: task.id,
            title: task.title,
            description: task.description,
            homework: task.homework,
            status: task.status,
            deadline: task.deadline,
            finalScore: task.finalScore,
            reviewNote: task.reviewNote,
            submission: task.submission,
          }
        : null,
    };
  });
};

const getClusterMembersProgress = async (teacherUserId: string, clusterId: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const cluster = await prisma.cluster.findFirst({
    where: { id: clusterId, teacherId: teacherProfile.id },
    include: {
      members: {
        where: { studentProfileId: { not: null } },
        include: {
          studentProfile: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
          },
        },
      },
      sessions: {
        select: {
          id: true,
          tasks: {
            select: { studentProfileId: true, status: true, finalScore: true },
          },
          attendance: {
            select: { studentProfileId: true, status: true },
          },
        },
      },
    },
  });

  if (!cluster) throw new AppError(status.NOT_FOUND, "Cluster not found");

  return cluster.members.map((m) => {
    const sid = m.studentProfileId as string;
    let tasksTotal = 0;
    let tasksSubmitted = 0;
    let scoreSum = 0;
    let scoredCount = 0;
    let attendance = 0;
    let attendanceTotal = 0;

    cluster.sessions.forEach((s) => {
      s.tasks.forEach((t) => {
        if (t.studentProfileId !== sid) return;
        tasksTotal += 1;
        if (t.status === "SUBMITTED" || t.status === "REVIEWED") tasksSubmitted += 1;
        if (typeof t.finalScore === "number") {
          scoreSum += t.finalScore;
          scoredCount += 1;
        }
      });
      s.attendance.forEach((a) => {
        if (a.studentProfileId !== sid) return;
        attendanceTotal += 1;
        if (a.status === "PRESENT" || a.status === "EXCUSED") attendance += 1;
      });
    });

    return {
      studentProfileId: sid,
      userId: m.studentProfile?.user?.id ?? null,
      name: m.studentProfile?.user?.name ?? "Unknown",
      email: m.studentProfile?.user?.email ?? "",
      image: m.studentProfile?.user?.image ?? null,
      subtype: m.subtype,
      tasksTotal,
      tasksSubmitted,
      avgScore: scoredCount > 0 ? Math.round((scoreSum / scoredCount) * 10) / 10 : 0,
      attendance,
      attendanceTotal,
    };
  });
};

// ─── Assign task to a specific member ────────────────────────────────────────
const assignTaskToMember = async (
  teacherUserId: string,
  sessionId: string,
  studentProfileId: string,
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
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: { cluster: { select: { teacherId: true } } },
  });
  if (!session) throw new AppError(status.NOT_FOUND, "Session not found");
  if (session.cluster.teacherId !== teacherProfile.id) {
    throw new AppError(status.FORBIDDEN, "Unauthorized");
  }
  if (session.status === "completed") {
    throw new AppError(status.BAD_REQUEST, "Cannot assign tasks to a completed session");
  }

  // Check if task already assigned to this member for this session
  const existing = await prisma.task.findFirst({
    where: { studySessionId: sessionId, studentProfileId },
  });
  if (existing) {
    throw new AppError(status.CONFLICT, "Task already assigned to this member for this session");
  }

  return prisma.task.create({
    data: {
      studySessionId: sessionId,
      studentProfileId,
      title: payload.title,
      description: payload.description ?? null,
      homework: payload.homework ?? null,
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      status: "PENDING",
    },
    include: {
      submission: true,
      studentProfile: {
        include: { user: { select: { name: true, email: true, image: true } } },
      },
    },
  });
};

// ─── Assign task/homework to ALL members of a session ───────────────────────
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
            where: { subtype: "RUNNING", studentProfileId: { not: null } },
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
    skipDuplicates: true,
  });

  return { tasksCreated: members.length };
};

// ─── Update a task ────────────────────────────────────────────────────────────
const updateTask = async (
  teacherUserId: string,
  taskId: string,
  payload: {
    title?: string;
    description?: string;
    homework?: string;
    deadline?: string;
  }
) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } },
    },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError(status.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError(status.BAD_REQUEST, "Cannot edit tasks in a completed session");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.homework !== undefined && { homework: payload.homework }),
      ...(payload.deadline !== undefined && { deadline: payload.deadline ? new Date(payload.deadline) : null }),
    },
  });
};

// ─── Delete a task ────────────────────────────────────────────────────────────
const deleteTask = async (teacherUserId: string, taskId: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      StudySession: { include: { cluster: { select: { teacherId: true } } } },
    },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError(status.FORBIDDEN, "Unauthorized");
  }
  if (task.StudySession.status === "completed") {
    throw new AppError(status.BAD_REQUEST, "Cannot delete tasks from a completed session");
  }

  // Delete submission and drafts first
  await prisma.$transaction([
    prisma.taskSubmission.deleteMany({ where: { taskId } }),
    prisma.taskDraft.deleteMany({ where: { taskId } }),
    prisma.peerReview.deleteMany({ where: { taskId } }),
    prisma.task.delete({ where: { id: taskId } }),
  ]);

  return { deleted: true, taskId };
};

// ─── Get submission detail for teacher review ─────────────────────────────────
const getSubmissionDetail = async (teacherUserId: string, taskId: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      studentProfile: {
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      },
      StudySession: {
        include: {
          cluster: { select: { teacherId: true, name: true } },
        },
      },
    },
  });

  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id) {
    throw new AppError(status.FORBIDDEN, "Unauthorized");
  }

  return task;
};

// ─── Review a task submission ─────────────────────────────────────────────────
const reviewSubmission = async (
  teacherId: string,
  taskId: string,
  payload: { finalScore: number; reviewNote?: string }
) => {
  if (payload.finalScore < 0 || payload.finalScore > 10) {
    throw new AppError(status.BAD_REQUEST, "Score must be between 0 and 10");
  }

  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submission: true,
      StudySession: { include: { cluster: { select: { teacherId: true } } } },
    },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found.");
  if (task.StudySession.cluster.teacherId !== teacherProfile.id)
    throw new AppError(status.FORBIDDEN, "Not authorised.");
  if (!task.submission) throw new AppError(status.BAD_REQUEST, "No submission to review.");

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
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const sessions = await prisma.studySession.findMany({
    where: { cluster: { teacherId: teacherProfile.id } },
    include: {
      cluster: { select: { id: true, name: true } },
      tasks: {
        include: {
          submission: { select: { id: true, submittedAt: true } },
          studentProfile: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
          },
          _count: { select: { drafts: true } },
        },
      },
      _count: { select: { attendance: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });
  return sessions;
};

// ─── Get running members of a cluster (used in session-creation individual task form) ──
const getClusterMembers = async (teacherUserId: string, clusterId: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found");

  const cluster = await prisma.cluster.findFirst({
    where: { id: clusterId, teacherId: teacherProfile.id },
    include: {
      members: {
        where: { subtype: "RUNNING", studentProfileId: { not: null } },
        include: {
          studentProfile: {
            include: {
              user: { select: { id: true, name: true, email: true, image: true } },
            },
          },
        },
      },
    },
  });

  if (!cluster) throw new AppError(status.NOT_FOUND, "Cluster not found or not owned by you");

  return cluster.members.map((m) => ({
    studentProfileId: m.studentProfileId as string,
    userId: m.studentProfile?.user?.id ?? null,
    name: m.studentProfile?.user?.name ?? "Unknown",
    email: m.studentProfile?.user?.email ?? "",
    image: m.studentProfile?.user?.image ?? null,
  }));
};

export const teacherTaskService = {
  getSessionsWithTasks,
  getSessionMembers,
  getClusterMembersProgress,
  getClusterMembers,
  assignTaskToMember,
  assignTaskToSession,
  updateTask,
  deleteTask,
  getSubmissionDetail,
  reviewSubmission,
  getHomeworkManagement,
};
