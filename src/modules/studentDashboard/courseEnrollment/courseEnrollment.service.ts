import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { prisma } from "../../../lib/prisma";
import { MissionStatus } from "../../../generated/prisma/enums";

const listMyEnrollments = async (userId: string) => {
  return prisma.courseEnrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          status: true,
          description: true,
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
};

const getEnrollmentForCourse = async (userId: string, courseId: string) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } },
    include: {
      course: {
        include: {
          missions: {
            where: { status: MissionStatus.PUBLISHED },
            orderBy: { order: "asc" },
            include: { _count: { select: { contents: true } } },
          },
        },
      },
      missionProgress: true,
    },
  });

  if (!enrollment) {
    throw new AppError(status.NOT_FOUND, "You are not enrolled in this course.");
  }

  return enrollment;
};

const completeMissionForStudent = async (
  userId: string,
  courseId: string,
  missionId: string
) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } },
    include: {
      course: {
        select: {
          id: true,
          missions: {
            where: { status: MissionStatus.PUBLISHED },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!enrollment) {
    throw new AppError(status.NOT_FOUND, "Enrollment not found.");
  }

  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, courseId, status: MissionStatus.PUBLISHED },
  });
  if (!mission) {
    throw new AppError(status.NOT_FOUND, "Mission not found.");
  }

  await prisma.studentMissionProgress.upsert({
    where: {
      enrollmentId_missionId: { enrollmentId: enrollment.id, missionId },
    },
    create: {
      enrollmentId: enrollment.id,
      missionId,
      isCompleted: true,
      completedAt: new Date(),
      lastAccessedAt: new Date(),
    },
    update: {
      isCompleted: true,
      completedAt: new Date(),
      lastAccessedAt: new Date(),
    },
  });

  const total = enrollment.course.missions.length;
  const completed = await prisma.studentMissionProgress.count({
    where: { enrollmentId: enrollment.id, isCompleted: true },
  });
  const progressPct = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const allDone = total > 0 && completed >= total;

  return prisma.courseEnrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: progressPct,
      ...(allDone ? { completedAt: new Date() } : {}),
    },
    include: {
      course: {
        include: {
          missions: {
            where: { status: MissionStatus.PUBLISHED },
            orderBy: { order: "asc" },
            include: { _count: { select: { contents: true } } },
          },
        },
      },
      missionProgress: true,
    },
  });
};

export const studentCourseEnrollmentService = {
  listMyEnrollments,
  getEnrollmentForCourse,
  completeMissionForStudent,
};
