import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";
import { Role } from "../../../generated/prisma/enums";

const getOrCreateTeacherProfile = async (teacherUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: teacherUserId },
    select: { id: true, role: true, isActive: true, isDeleted: true },
  });

  if (!user || user.isDeleted) {
    throw new AppError(status.UNAUTHORIZED, "Teacher account not found.");
  }

  if (user.role !== Role.TEACHER) {
    throw new AppError(status.FORBIDDEN, "Only teachers can manage resource categories.");
  }

  if (user.isActive === false) {
    throw new AppError(status.FORBIDDEN, "Your account has been deactivated. Please contact support.");
  }

  return prisma.teacherProfile.upsert({
    where: { userId: teacherUserId },
    update: {},
    create: { userId: teacherUserId },
  });
};

// ─── Get all categories ───────────────────────────────────────────────────────
const getCategories = async (teacherUserId?: string) => {

  const teacherProfile = await getOrCreateTeacherProfile(teacherUserId!);

  const teacherId = teacherProfile.id;
  return prisma.resourceCategory.findMany({
    where: { OR: [{ isGlobal: true }, ...(teacherId ? [{ teacherId }] : [])] },
    include: { _count: { select: { resources: true } } },
    orderBy: { name: "asc" },
  });
};

// ─── Create category ──────────────────────────────────────────────────────────
const createCategory = async (
  teacherUserId: string,
  payload: {
    name: string;
    description?: string;
    color?: string;
    clusterId?: string;
    isGlobal?: boolean;
  }
) => {
  const { name, description, color = "#14b8a6", clusterId, isGlobal = false } = payload;

  const teacherProfile = await getOrCreateTeacherProfile(teacherUserId);

  const teacherId = teacherProfile.id;
  if (clusterId) {
    const cluster = await prisma.cluster.findFirst({ where: { id: clusterId, teacherId } });
    if (!cluster) throw new AppError(status.FORBIDDEN, "Cluster not found or not owned by you.");
  }

  const existing = await prisma.resourceCategory.findFirst({
    where: { name: { equals: name, mode: "insensitive" }, teacherId },
  });
  if (existing) throw new AppError(status.CONFLICT, "Category with this name already exists.");

  return prisma.resourceCategory.create({
    data: {
      name,
      color,
      teacherId: teacherId ?? null,
      clusterId: clusterId ?? null,
      isGlobal: false,
    },
  });
};

// ─── Update category ──────────────────────────────────────────────────────────
const updateCategory = async (
  teacherUserId: string,
  id: string,
  payload: { name?: string; description?: string; color?: string; clusterId?: string; isGlobal?: boolean; }
) => {
  const teacherProfile = await getOrCreateTeacherProfile(teacherUserId);

  const teacherId = teacherProfile.id;
  if (payload.clusterId) {
    const cluster = await prisma.cluster.findFirst({ where: { id: payload.clusterId, teacherId } });
    if (!cluster) throw new AppError(status.FORBIDDEN, "Cluster not found or not owned by you.");
  }

  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError(status.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError(status.FORBIDDEN, "Not your category.");
  return prisma.resourceCategory.update({ where: { id }, data: { ...payload, isGlobal: false } });
};

// ─── Delete category ──────────────────────────────────────────────────────────
const deleteCategory = async (teacherUserId: string, id: string) => {
  const teacherProfile = await getOrCreateTeacherProfile(teacherUserId);

  const teacherId = teacherProfile.id;

  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError(status.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError(status.FORBIDDEN, "Not your category.");
  // Un-set category on resources (don't delete the resources)
  await prisma.resource.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  return prisma.resourceCategory.delete({ where: { id } });
};

export const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
