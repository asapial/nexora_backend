import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { adminService } from "../admin/admin.service";

// User: submit a teacher application
const apply = async (
  userId: string,
  data: {
    fullName: string;
    email: string;
    phone?: string;
    designation?: string;
    institution?: string;
    department?: string;
    specialization?: string;
    experience?: number;
    bio?: string;
    linkedinUrl?: string;
    website?: string;
  }
) => {
  // Check if user already has a pending/approved application
  const existing = await prisma.teacherApplication.findFirst({
    where: { userId, status: { in: ["PENDING", "APPROVED"] } },
  });
  if (existing) {
    throw new AppError(
      status.CONFLICT,
      "You already have a teacher application submitted or approved."
    );
  }
  return prisma.teacherApplication.create({
    data: { userId, ...data },
  });
};

// User: get own application status
const getMyApplication = async (userId: string) => {
  return prisma.teacherApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// Admin: get all pending applications
const getPending = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.teacherApplication.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    }),
    prisma.teacherApplication.count({ where: { status: "PENDING" } }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Admin: get all applications
const getAll = async (params: { page?: number; limit?: number; status?: string }) => {
  const { page = 1, limit = 20, status: st } = params;
  const skip = (page - 1) * limit;
  const where: any = {};
  if (st) where.status = st;

  const [data, total] = await Promise.all([
    prisma.teacherApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    }),
    prisma.teacherApplication.count({ where }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Admin: approve application → create teacher account
const approve = async (applicationId: string, adminId: string) => {
  const application = await prisma.teacherApplication.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });
  if (!application) throw new AppError(status.NOT_FOUND, "Application not found.");
  if (application.status !== "PENDING")
    throw new AppError(status.BAD_REQUEST, "Application is not pending.");

  // Use existing createTeacher service (which handles role upgrade + profile creation + email)
  await adminService.createTeacher([application.email]);

  // Update application status
  return prisma.teacherApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED", reviewedAt: new Date(), reviewedById: adminId },
  });
};

// Admin: reject application
const reject = async (applicationId: string, adminNote: string, adminId: string) => {
  const application = await prisma.teacherApplication.findUnique({ where: { id: applicationId } });
  if (!application) throw new AppError(status.NOT_FOUND, "Application not found.");
  return prisma.teacherApplication.update({
    where: { id: applicationId },
    data: { status: "REJECTED", adminNote, reviewedAt: new Date(), reviewedById: adminId },
  });
};

export const teacherApplicationService = {
  apply,
  getMyApplication,
  getPending,
  getAll,
  approve,
  reject,
};
