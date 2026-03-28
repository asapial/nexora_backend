import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { prisma } from "../../../lib/prisma";
import { MissionStatus } from "../../../generated/prisma/enums";

const getMissionContentsForStudent = async (userId: string, missionId: string) => {
  const mission = await prisma.courseMission.findFirst({
    where: { id: missionId, status: MissionStatus.PUBLISHED },
    select: { id: true, courseId: true },
  });
  if (!mission) {
    throw new AppError(status.NOT_FOUND, "Mission not found.");
  }

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId: mission.courseId, userId } },
  });
  if (!enrollment) {
    throw new AppError(status.FORBIDDEN, "Enroll in this course to view content.");
  }

  return prisma.missionContent.findMany({
    where: { missionId },
    orderBy: { order: "asc" },
  });
};

export const studentMissionService = {
  getMissionContentsForStudent,
};
