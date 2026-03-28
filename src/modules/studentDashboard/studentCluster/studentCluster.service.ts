import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { prisma } from "../../../lib/prisma";

const getMyCluster = async (studentUserId: string) => {

  const studentProfile = await prisma.studentProfile.findFirst({
    where: {
      userId: studentUserId
    }
  })

  if (!studentProfile) {
    throw new AppError(status.CONTINUE, "Student is not found");
  }

  const now = new Date();

  const memberships = await prisma.clusterMember.findMany({
    where: { userId: studentUserId },
    include: {
      cluster: {
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: { members: true, sessions: true },
          },
          sessions: {
            where: { scheduledAt: { gt: now } },
            orderBy: { scheduledAt: "asc" },
            take: 1,
            select: { id: true, title: true, scheduledAt: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map((m) => {
    const cluster = m.cluster;
    const upcomingSession = cluster.sessions[0] ?? null;

    return {
      id: cluster.id,
      name: cluster.name,
      slug: cluster.slug,
      description: cluster.description,
      batchTag: cluster.batchTag,
      healthScore: cluster.healthScore,
      healthStatus: cluster.healthStatus,
      isActive: cluster.isActive,
      teacher: cluster.teacher
        ? { name: cluster.teacher.user.name, email: cluster.teacher.user.email }
        : null,
      memberCount: cluster._count.members,
      sessionCount: cluster._count.sessions,
      upcomingSession,
      joinedAt: m.joinedAt,
      subtype: m.subtype,
    };
  });
};

const getClusterDetail = async (userId: string, clusterId: string) => {
  // Verify student is a member of this cluster
  const member = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } },
    include: { studentProfile: { select: { id: true } } },
  });

  if (!member) return null;

  const studentProfileId = member.studentProfileId;

  // Fetch cluster base info
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    include: {
      teacher: {
        include: {
          user: { select: { name: true, email: true, image: true } },
        },
      },
      _count: { select: { members: true, sessions: true } },
    },
  });

  if (!cluster) return null;

  // Fetch members list
  const members = await prisma.clusterMember.findMany({
    where: { clusterId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { joinedAt: "asc" },
  });

  // Fetch recent sessions
  const sessions = await prisma.studySession.findMany({
    where: { clusterId },
    orderBy: { scheduledAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      scheduledAt: true,
      status: true,
      durationMins: true,
    },
  });

  // Fetch this student's assigned tasks in this cluster
  const myTasks = studentProfileId
    ? await prisma.task.findMany({
        where: {
          studentProfileId,
          StudySession: { clusterId },
        },
        include: {
          submission: {
            select: {
              id: true,
              submittedAt: true,
              videoUrl: true,
              textBody: true,
              pdfUrl: true,
              fileSize: true,
            },
          },
          StudySession: {
            select: { id: true, title: true, scheduledAt: true, status: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Fetch this student's attendance in this cluster
const myAttendance = studentProfileId
  ? await prisma.attendance.findMany({
      where: {
        studentProfileId,
        session: {
          clusterId,
        },
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            scheduledAt: true,
          },
        },
      },
      orderBy: {
        markedAt: "desc",
      },
    })
  : [];

  return {
    id: cluster.id,
    name: cluster.name,
    slug: cluster.slug,
    description: cluster.description,
    batchTag: cluster.batchTag,
    healthScore: cluster.healthScore,
    healthStatus: cluster.healthStatus,
    isActive: cluster.isActive,
    teacher: cluster.teacher
      ? {
          name: cluster.teacher.user.name,
          email: cluster.teacher.user.email,
          image: cluster.teacher.user.image,
        }
      : null,
    memberCount: cluster._count.members,
    sessionCount: cluster._count.sessions,
    members: members.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      image: m.user.image,
      joinedAt: m.joinedAt,
      subtype: m.subtype,
    })),
    sessions,
    myTasks,
    myAttendance,
    joinedAt: member.joinedAt,
    subtype: member.subtype,
  };
};

export const studentClusterService = { getMyCluster, getClusterDetail };
