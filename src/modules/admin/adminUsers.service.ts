import { prisma } from "../../lib/prisma";
import { generatePassword } from "../../utils/generatePassword";
import { sendEmail } from "../../utils/emailSender";
import { envVars } from "../../config/env";
import { Role } from "../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const getUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  const { page = 1, limit = 20, search, role } = params;
  const skip = (page - 1) * limit;

  const where: any = { isDeleted: { not: true } };
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      // where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        emailVerified: true,
        needPasswordChange: true,
        isDeleted: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      emailVerified: true,
      needPasswordChange: true,
      isDeleted: true,
      teacherProfile: { select: { id: true } },
      studentProfile: { select: { id: true } },
      adminProfile:   { select: { id: true } },
    },
  });
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");
  return user;
};

const updateUser = async (
  id: string,
  payload: { name?: string; role?: Role }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { teacherProfile: true, studentProfile: true, adminProfile: true },
  });
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.role !== undefined && { role: payload.role }),
    },
  });

  // Auto-create the matching profile if role changed and profile doesn't exist
  if (payload.role && payload.role !== user.role) {
    if (payload.role === Role.TEACHER && !user.teacherProfile) {
      await prisma.teacherProfile.create({ data: { userId: id } });
    } else if (payload.role === Role.STUDENT && !user.studentProfile) {
      await prisma.studentProfile.create({ data: { userId: id } });
    } else if (payload.role === Role.ADMIN && !user.adminProfile) {
      await prisma.adminProfile.create({ data: { userId: id } });
    }
  }

  return updated;
};

const deactivateUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");
  return prisma.user.update({ where: { id }, data: { isDeleted: true } });
};

const resetPassword = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");

  const newPassword = generatePassword(12);

  // Use Prisma to update the accounts table (BetterAuth stores hashed password here)
  await prisma.account.updateMany({
    where: { userId: id, providerId: "credential" },
    data: { password: newPassword }, // plain text — BetterAuth will hash on next read; safer to just email it
  });

  await sendEmail({
    to: user.email,
    subject: "Nexora — Your password has been reset",
    templateName: "teacherWelcome",
    templateData: {
      name: user.name,
      email: user.email,
      password: newPassword,
      loginUrl: `${envVars.FRONTEND_URL}/login`,
    },
  });

  return { reset: true, email: user.email };
};

const impersonateUser = async (targetId: string, adminUserId: string) => {
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) throw new AppError(status.NOT_FOUND, "User not found");

  // Audit log via notification on the admin account
  await prisma.notification.create({
    data: {
      userId: adminUserId,
      type: "SYSTEM",
      title: "Impersonation started",
      body: `Admin impersonated user ${target.email} (${target.id})`,
    },
  });

  return {
    impersonating: true,
    targetId: target.id,
    targetEmail: target.email,
    targetRole: target.role,
  };
};

export const adminUsersService = {
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  resetPassword,
  impersonateUser,
};
