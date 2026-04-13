import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import status from "http-status";
import {
  IAgendaBlock,
  IAttendanceRecord,
  IAttachReplay,
  ICreateSession,
  IUpdateSession,
} from "./studySession.type";
import { assertSessionTeacher, findSessionOrThrow, getTeacherProfileId, resolveStudentProfileId } from "./studySession.utils";


const listSessions = async (
  userId: string,
  userRole: string,
  query: { clusterId?: string; from?: string; to?: string }
) => {
  const { clusterId, from, to } = query;

     const teacherProfile= await prisma.teacherProfile.findFirst({
    where:{
      userId
    }
  })

  if(!teacherProfile){
    throw new AppError(status.CONTINUE,"Teacher is not found");

  }

  const teacherId=teacherProfile.id;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (userRole === Role.TEACHER) {
    const ownedIds = (
      await prisma.cluster.findMany({ where: { teacherId:teacherId }, select: { id: true } })
    ).map((c) => c.id);
    const coIds = (
      await prisma.coTeacher.findMany({ where: { userId }, select: { clusterId: true } })
    ).map((c) => c.clusterId);
    where.clusterId = { in: [...new Set([...ownedIds, ...coIds])] };
  } else if (userRole === Role.STUDENT) {
    const memberIds = (
      await prisma.clusterMember.findMany({
        where: { userId },
        select: { clusterId: true },
      })
    ).map((m) => m.clusterId);
    where.clusterId = { in: memberIds };
  }

  if (clusterId) where.clusterId = clusterId;
  if (from) where.scheduledAt = { ...(where.scheduledAt ?? {}), gte: new Date(from) };
  if (to) where.scheduledAt = { ...(where.scheduledAt ?? {}), lte: new Date(to) };

  const sessions = await prisma.studySession.findMany({
    where,
    orderBy: { scheduledAt: "desc" },
    include: {
      tasks: { select: { id: true, status: true } },
      attendance: { select: { status: true } },
      feedback: { select: { rating: true } },
      cluster: { include: { _count: { select: { members: true } } } },
      agenda: true,
    },
  });

  return sessions.map((s) => {
    const totalTasks = s.tasks.length;
    const submitted = s.tasks.filter(
      (t) => t.status === "SUBMITTED" || t.status === "REVIEWED"
    ).length;
    const totalAtt = s.attendance.length;
    const present = s.attendance.filter(
      (a) => a.status === "PRESENT" || a.status === "EXCUSED"
    ).length;
    const memberCount = s.cluster._count?.members ?? 0;
    const ratings = s.feedback.map((f) => f.rating);
    const avgRating =
      ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
    return {
      id: s.id,
      status: s.status,
      agenda: s.agenda.map((a) => ({
        id: a.id,
        startTime: a.startTime,
        durationMins: a.durationMins,
        topic: a.topic,
        presenter: a.presenter ?? undefined,
        order: a.order,
      })),
      clusterId: s.clusterId,
      clusterName: s.cluster.name,
      clusterBatchTag: s.cluster.batchTag,
      title: s.title,
      description: s.description,
      scheduledAt: s.scheduledAt,
      durationMins: s.durationMins,
      location: s.location,
      taskDeadline: s.taskDeadline,
      templateId: s.templateId ?? undefined,
      recordingUrl: s.recordingUrl ?? undefined,
      recordingNotes: s.recordingNotes ?? undefined,
      createdAt: s.createdAt,
      submissionRate: totalTasks > 0 ? Math.round((submitted / totalTasks) * 1000) / 10 : null,
      attendanceRate: totalAtt > 0 ? Math.round((present / totalAtt) * 1000) / 10 : null,
      taskSubmittedCount: submitted,
      attendanceCount: present,
      memberCount,
      feedback:
        avgRating !== null
          ? { averageRating: Math.round(avgRating * 10) / 10, totalCount: ratings.length }
          : undefined,
    };
  });
};

/* ════════════════════════════════════════════════════════════════════════════
   2. POST /sessions
   ══════════════════════════════════════════════════════════════════════════ */
const createSession = async (userId: string, payload: ICreateSession) => {
  const teacherProfileId = await getTeacherProfileId(userId);

  const cluster = await prisma.cluster.findUnique({
    where: {
      id: payload.clusterId
    },
    include: {
      members: {
        where: {
          subtype: "RUNNING"
        },
        select: {
          userId: true,
          studentProfileId:true
        }
      },
    },
  });

  if (!cluster) throw new AppError(status.NOT_FOUND, "Cluster not found.");

  const isOwner = cluster.teacherId === teacherProfileId;
  const isCoTeacher = await prisma.coTeacher.findFirst({
    where: {
      clusterId: payload.clusterId,
      userId
    },
  });

  if (!isOwner && !isCoTeacher) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to create sessions in this cluster."
    );
  }


  if (payload.templateId) {
    const tmpl = await prisma.taskTemplate.findUnique({
      where: {
        id: payload.templateId
      }
    });

    if (!tmpl) throw new AppError(status.NOT_FOUND, "Task template not found.");
  }

  const runningMembers = cluster.members;

  // Resolve task mode: explicit > default "template"
  const resolvedMode: "template" | "individual" | "none" =
    payload.taskMode === "individual" ? "individual"
    : payload.taskMode === "none" ? "none"
    : "template";

  const session = await prisma.$transaction(async (tx) => {
    const newSession = await tx.studySession.create({
      data: {
        clusterId: payload.clusterId,
        createdById: teacherProfileId,
        title: payload.title,
        description: payload.description ?? null,
        scheduledAt: new Date(payload.scheduledAt),
        location: payload.location ?? null,
        taskDeadline: payload.taskDeadline ? new Date(payload.taskDeadline) : null,
        templateId: payload.templateId ?? null,
      },
    });

    if (resolvedMode === "individual") {
      // Per-student custom tasks ────────────────────────────────────────────
      const customTasks = (payload.individualTasks ?? [])
        .filter(it => it.studentProfileId && it.title?.trim());

      if (customTasks.length > 0) {
        await tx.task.createMany({
          data: customTasks.map(it => ({
            studentProfileId: it.studentProfileId,
            studySessionId: newSession.id,
            title: it.title.trim(),
            description: it.description?.trim() ?? null,
            deadline: newSession.taskDeadline,
          })),
        });

        const profileIds = customTasks.map(t => t.studentProfileId);
        const studentProfiles = await tx.studentProfile.findMany({
          where: { id: { in: profileIds } },
          select: { id: true, userId: true },
        });
        const profileUserMap = Object.fromEntries(studentProfiles.map(p => [p.id, p.userId]));
        const notifData = customTasks
          .map(t => ({
            userId: profileUserMap[t.studentProfileId],
            type: "SESSION_CREATED",
            title: `New session: ${newSession.title}`,
            body: `A new session has been created in ${cluster.name}. Your task is ready.`,
            link: `/sessions/${newSession.id}`,
          }))
          .filter(n => n.userId);
        if (notifData.length > 0) {
          await tx.notification.createMany({ data: notifData });
        }
      }

    } else if (resolvedMode === "template" && runningMembers.length > 0) {
      // Same task (template or session title) for ALL running members ───────
      const template = payload.templateId
        ? await tx.taskTemplate.findUnique({ where: { id: payload.templateId } })
        : null;

      await tx.task.createMany({
        data: runningMembers.map(m => ({
          studentProfileId: m.studentProfileId!,
          studySessionId: newSession.id,
          title: template ? template.title : newSession.title,
          description: template?.description ?? null,
          deadline: newSession.taskDeadline,
        })),
      });

      await tx.notification.createMany({
        data: runningMembers.map(m => ({
          userId: m.userId,
          type: "SESSION_CREATED",
          title: `New session: ${newSession.title}`,
          body: `A new session has been created in ${cluster.name}. Your task is ready.`,
          link: `/sessions/${newSession.id}`,
        })),
      });

    } else if (resolvedMode === "none" && runningMembers.length > 0) {
      // No tasks — still notify members about the new session ───────────────
      await tx.notification.createMany({
        data: runningMembers.map(m => ({
          userId: m.userId,
          type: "SESSION_CREATED",
          title: `New session: ${newSession.title}`,
          body: `A new session has been created in ${cluster.name}.`,
          link: `/sessions/${newSession.id}`,
        })),
      });
    }

    return newSession;
  });

  const tasksQueued =
    resolvedMode === "individual"
      ? (payload.individualTasks?.filter(it => it.studentProfileId && it.title?.trim()).length ?? 0)
      : resolvedMode === "none"
      ? 0
      : runningMembers.length;

  return { session, tasksQueued };
};


const getSessionById = async (
  sessionId: string,
  userId: string,
  userRole: string
) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    include: {
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          deadline: true,
          submission: {
            select: {
              id: true
            }
          },
        },
      },
      attendance: {
        select: {
          studentProfileId: true,
          status: true
        },
      },
      agenda: {
        orderBy: {
          order: "asc"
        }
      },
    },
  });

  if (!session) throw new AppError(status.NOT_FOUND, "Session not found.");

  if (userRole === Role.STUDENT) {
    const myTask = session.tasks.find((t) => t.memberId === userId) ?? null;
    return {
      id: session.id,
      title: session.title,
      description: session.description,
      scheduledAt: session.scheduledAt,
      location: session.location,
      taskDeadline: session.taskDeadline,
      recordingUrl: session.recordingUrl,
      agenda: session.agenda,
      myTask,
    };
  }

  const submittedCount = session.tasks.filter(
    (t) => t.status === "SUBMITTED" || t.status === "REVIEWED"
  ).length;

  return {
    id: session.id,
    title: session.title,
    description: session.description,
    scheduledAt: session.scheduledAt,
    location: session.location,
    taskDeadline: session.taskDeadline,
    recordingUrl: session.recordingUrl,
    agenda: session.agenda,
    tasks: session.tasks,
    submittedCount,
    totalMembers: session.tasks.length,
    attendance: session.attendance,
  };
};


const updateSession = async (
  sessionId: string,
  userId: string,
  payload: IUpdateSession
) => {
  const existing = await assertSessionTeacher(sessionId, userId);

  // console.log("Update session data :", payload);

  const ONE_HOUR_MS = 60 * 60 * 1000;
  const dateChanged =
    payload.date &&
    Math.abs(new Date(payload.date).getTime() - existing.scheduledAt.getTime()) > ONE_HOUR_MS;
  const deadlineChanged =
    payload.deadline &&
    existing.taskDeadline &&
    Math.abs(new Date(payload.deadline).getTime() - existing.taskDeadline.getTime()) > ONE_HOUR_MS;

  // Build update data — use null instead of undefined for Prisma optional fields
  const updateData: Parameters<typeof prisma.studySession.update>[0]["data"] = {};
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.date !== undefined) updateData.scheduledAt = new Date(payload.date);
  if (payload.location !== undefined) updateData.location = payload.location;
  if (payload.deadline !== undefined) updateData.taskDeadline = new Date(payload.deadline);
  if (payload.templateId !== undefined) updateData.templateId = payload.templateId;
  if (payload.status !== undefined) updateData.status = payload.status;

  const updated = await prisma.studySession.update({
    where: {
      id: sessionId
    },
    data: updateData,
  });

  if (dateChanged || deadlineChanged) {
    const members = await prisma.clusterMember.findMany({
      where: {
        clusterId: existing.clusterId
      },
      select: {
        userId: true
      },
    });

    await prisma.notification.createMany({
      data: members.map((m) => ({
        userId: m.userId,
        type: "SESSION_UPDATED",
        title: `Session updated: ${updated.title}`,
        body: [
          dateChanged ? `New date: ${updated.scheduledAt.toISOString()}` : "",
          deadlineChanged ? `New deadline: ${updated.taskDeadline?.toISOString()}` : "",
        ]
          .filter(Boolean)
          .join(" | "),
        link: `/sessions/${sessionId}`,
      })),
    });
  }

  return updated;
};


const deleteSession = async (sessionId: string, userId: string) => {
  await assertSessionTeacher(sessionId, userId);

  await prisma.$transaction(async (tx) => {
    await tx.studySessionAgenda.deleteMany({ where: { studySessionId: sessionId } });
    await tx.studySessionFeedback.deleteMany({ where: { studySessionId: sessionId } });
    await tx.attendance.deleteMany({ where: { studySessionId: sessionId } });

    const tasks = await tx.task.findMany({
      where: { studySessionId: sessionId },
      select: { id: true },
    });
    const taskIds = tasks.map((t) => t.id);
    if (taskIds.length > 0) {
      await tx.taskSubmission.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.taskDraft.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.peerReview.deleteMany({ where: { taskId: { in: taskIds } } });
      await tx.task.deleteMany({ where: { id: { in: taskIds } } });
    }

    await tx.studySession.delete({ where: { id: sessionId } });
  });

  return { deleted: true, sessionId };
};


const submitAttendance = async (
  sessionId: string,
  userId: string,
  records: IAttendanceRecord[]
) => {
  await assertSessionTeacher(sessionId, userId);

  let processed = 0;
  for (const rec of records) {
    // Accept both StudentProfile.id and User.id for compatibility.
    const profileById = await prisma.studentProfile.findUnique({
      where: { id: rec.studentId },
      select: { id: true },
    });
    const studentProfileId = profileById?.id ?? (await resolveStudentProfileId(rec.studentId));

    await prisma.attendance.upsert({
      where: {
        studySessionId_studentProfileId: {
          studySessionId: sessionId,
          studentProfileId,
        },
      },
      create: {
        studySessionId: sessionId,
        studentProfileId,
        status: rec.status,
        note: rec.note ?? null,
      },
      update: {
        status: rec.status,
        note: rec.note ?? null,
      },
    });
    processed++;
  }

  return { recorded: processed };
};


const getAttendance = async (sessionId: string, userId: string) => {
  await assertSessionTeacher(sessionId, userId);

  const records = await prisma.attendance.findMany({
    where: { studySessionId: sessionId },
    include: {
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
      },
    },
  });

  const enriched = records.map((r) => ({
    studentId: r.studentProfileId,
    userId: r.studentProfile?.user?.id ?? null,
    name: r.studentProfile?.user?.name ?? r.studentProfileId,
    email: r.studentProfile?.user?.email,
    status: r.status,
    note: r.note,
    markedAt: r.markedAt,
  }));

  const present = enriched.filter((r) => r.status === "PRESENT").length;
  const excused = enriched.filter((r) => r.status === "EXCUSED").length;
  const absent = enriched.filter((r) => r.status === "ABSENT").length;
  const total = enriched.length;

  return {
    records: enriched,
    stats: {
      present,
      excused,
      absent,
      total,
      rate: total > 0 ? Math.round(((present + excused) / total) * 1000) / 10 : 0,
    },
  };
};

const getStudentAttendanceHistory = async (teacherUserId: string, studentProfileId: string, clusterId?: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found.");

  // If a specific clusterId is provided, scope to that cluster only
  if (clusterId) {
    // Verify the teacher owns this cluster
    const cluster = await prisma.cluster.findFirst({
      where: { id: clusterId, teacherId: teacherProfile.id },
      select: { id: true },
    });
    if (!cluster) return [];

    return prisma.attendance.findMany({
      where: {
        studentProfileId,
        session: { clusterId },
      },
      select: {
        status: true,
        session: { select: { title: true, scheduledAt: true } },
      },
      orderBy: { markedAt: "desc" },
    });
  }

  // Otherwise, return history across all teacher-owned clusters
  const memberships = await prisma.clusterMember.findMany({
    where: { studentProfileId },
    select: { clusterId: true },
  });
  const clusterIds = memberships.map((m) => m.clusterId);
  if (clusterIds.length === 0) return [];

  const accessibleClusters = await prisma.cluster.findMany({
    where: { id: { in: clusterIds }, teacherId: teacherProfile.id },
    select: { id: true },
  });
  const allowedClusterIds = accessibleClusters.map((c) => c.id);
  if (allowedClusterIds.length === 0) return [];

  return prisma.attendance.findMany({
    where: {
      studentProfileId,
      session: { clusterId: { in: allowedClusterIds } },
    },
    select: {
      status: true,
      session: { select: { title: true, scheduledAt: true } },
    },
    orderBy: { markedAt: "desc" },
  });
};

const getAttendanceWarningConfig = async (teacherUserId: string) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found.");

  const flag = await prisma.featureFlag.findUnique({
    where: { key: `attendance_warning_config:${teacherProfile.id}` },
    select: { description: true },
  });

  if (!flag?.description) {
    return {
      threshold: 3,
      message: "This student has excessive absences and may need immediate attention.",
    };
  }

  try {
    const parsed = JSON.parse(flag.description);
    return {
      threshold: Number(parsed.threshold ?? 3),
      message: String(parsed.message ?? "This student has excessive absences and may need immediate attention."),
    };
  } catch {
    return {
      threshold: 3,
      message: "This student has excessive absences and may need immediate attention.",
    };
  }
};

const saveAttendanceWarningConfig = async (
  teacherUserId: string,
  payload: { threshold?: number; message?: string }
) => {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: { userId: teacherUserId },
    select: { id: true },
  });
  if (!teacherProfile) throw new AppError(status.NOT_FOUND, "Teacher not found.");

  const threshold = Math.max(1, Number(payload.threshold ?? 3));
  const message = (payload.message ?? "This student has excessive absences and may need immediate attention.").trim();

  await prisma.featureFlag.upsert({
    where: { key: `attendance_warning_config:${teacherProfile.id}` },
    create: {
      key: `attendance_warning_config:${teacherProfile.id}`,
      isEnabled: true,
      rolloutPercent: threshold,
      description: JSON.stringify({ threshold, message }),
      targetRole: Role.TEACHER,
    },
    update: {
      isEnabled: true,
      rolloutPercent: threshold,
      description: JSON.stringify({ threshold, message }),
      targetRole: Role.TEACHER,
    },
  });

  return { threshold, message };
};



const saveAgenda = async (
  sessionId: string,
  userId: string,
  blocks: IAgendaBlock[]
) => {
  await assertSessionTeacher(sessionId, userId);

  await prisma.$transaction(async (tx) => {
    await tx.studySessionAgenda.deleteMany({ where: { studySessionId: sessionId } });
    await tx.studySessionAgenda.createMany({
      data: blocks.map((b, idx) => ({
        studySessionId: sessionId,
        startTime: b.startTime,
        durationMins: b.durationMins,
        topic: b.topic,
        presenter: b.presenter ?? null,
        order: idx,
      })),
    });
  });

  return { blocksCount: blocks.length };
};


const getFeedback = async (sessionId: string, userId: string) => {
  await assertSessionTeacher(sessionId, userId);

  const feedbacks = await prisma.studySessionFeedback.findMany({
    where: { studySessionId: sessionId },
    select: { rating: true, comment: true, submittedAt: true },
    orderBy: { submittedAt: "desc" },
  });

  if (feedbacks.length === 0) {
    return {
      averageRating: null,
      totalResponses: 0,
      distribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
      comments: [],
    };
  }

  const distribution: Record<string, number> = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  let total = 0;
  for (const f of feedbacks) {
    const key = String(f.rating);
    distribution[key] = (distribution[key] ?? 0) + 1;
    total += f.rating;
  }

  return {
    averageRating: Math.round((total / feedbacks.length) * 10) / 10,
    totalResponses: feedbacks.length,
    distribution,
    comments: feedbacks
      .filter((f) => f.comment && f.comment.trim() !== "")
      .map((f) => ({ comment: f.comment, submittedAt: f.submittedAt })),
  };
};



const submitFeedback = async (
  sessionId: string,
  userId: string,
  rating: number,
  comment?: string
) => {
  await findSessionOrThrow(sessionId);

  await prisma.studySessionFeedback.upsert({
    where: {
      studySessionId_memberId: { studySessionId: sessionId, memberId: userId },
    },
    create: {
      studySessionId: sessionId,
      memberId: userId,
      rating,
      comment: comment ?? null,
    },
    update: {
      rating,
      comment: comment ?? null,
    },
  });

  return { submitted: true };
};



const attachReplay = async (
  sessionId: string,
  userId: string,
  payload: IAttachReplay
) => {
  await assertSessionTeacher(sessionId, userId);

  const updated = await prisma.studySession.update({
    where: { id: sessionId },
    data: {
      recordingUrl: payload.recordingUrl,
      recordingNotes: payload.notes ? JSON.stringify(payload.notes) : null,
    },
    select: { id: true, recordingUrl: true, recordingNotes: true },
  });

  return {
    sessionId: updated.id,
    recordingUrl: updated.recordingUrl,
    notes: updated.recordingNotes ? JSON.parse(updated.recordingNotes) : [],
  };
};



const getReplay = async (sessionId: string) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
    select: { id: true, recordingUrl: true, recordingNotes: true },
  });

  if (!session) throw new AppError(status.NOT_FOUND, "Session not found.");
  if (!session.recordingUrl) {
    throw new AppError(
      status.NOT_FOUND,
      "No replay has been attached to this session yet."
    );
  }

  return {
    sessionId: session.id,
    recordingUrl: session.recordingUrl,
    notes: session.recordingNotes ? JSON.parse(session.recordingNotes) : [],
  };
};

/* ── Export ───────────────────────────────────────────────────────────────── */
export const studySessionService = {
  listSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
  submitAttendance,
  getAttendance,
  getStudentAttendanceHistory,
  getAttendanceWarningConfig,
  saveAttendanceWarningConfig,
  saveAgenda,
  getFeedback,
  submitFeedback,
  attachReplay,
  getReplay,
};