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

  const studentProfileId = studentProfile.id;

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
  const member = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } },
  });

  if (!member) return null;

  return prisma.cluster.findUnique({
    where: { id: clusterId },
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
      _count: { select: { members: true, sessions: true } },
      sessions: {
        orderBy: { scheduledAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          scheduledAt: true,
          status: true,
          durationMins: true,
        },
      },
    },
  });
};

export const studentClusterService = { getMyCluster, getClusterDetail };
