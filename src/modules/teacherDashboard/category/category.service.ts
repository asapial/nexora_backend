import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

// ─── Get all categories ───────────────────────────────────────────────────────
const getCategories = async (teacherId?: string) => {
  return prisma.resourceCategory.findMany({
    where: { OR: [{ isGlobal: true }, ...(teacherId ? [{ teacherId }] : [])] },
    include: { _count: { select: { resources: true } } },
    orderBy: { name: "asc" },
  });
};

// ─── Create category ──────────────────────────────────────────────────────────
const createCategory = async (
  teacherId: string,
  payload: {
    name: string;
    description?: string;
    color?: string;
    clusterId?: string;
    isGlobal?: boolean;
  }
) => {
  const { name, description, color = "#14b8a6", clusterId, isGlobal = false } = payload;

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
      isGlobal,
    },
  });
};

// ─── Update category ──────────────────────────────────────────────────────────
const updateCategory = async (
  teacherId: string,
  id: string,
  payload: { name?: string; description?: string; color?: string; clusterId?: string; isGlobal?: boolean }
) => {
  const cat = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!cat) throw new AppError(status.NOT_FOUND, "Category not found.");
  if (cat.teacherId !== teacherId) throw new AppError(status.FORBIDDEN, "Not your category.");
  return prisma.resourceCategory.update({ where: { id }, data: payload });
};

// ─── Delete category ──────────────────────────────────────────────────────────
const deleteCategory = async (teacherId: string, id: string) => {
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
