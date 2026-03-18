import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { updateTeacherProfileType } from "./teacher.type";

const getTeacherProfile = async (userId: string) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  }

  // Ensure the user is not soft-deleted
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User account is deactivated.");
  }

  return profile;
};

const updateTeacherProfile = async (
  userId: string,
  data: updateTeacherProfileType["body"]
) => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  }

  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );

  const updatedProfile = await prisma.teacherProfile.update({
    where: { userId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedProfile;
};

const deleteTeacherProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User account not found or already deleted.");
  }

  // Soft delete by updating User table
  await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      isActive: false,
    },
  });

  return { deleted: true, userId };
};

export const teacherService = {
  getTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
};