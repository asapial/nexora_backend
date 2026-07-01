import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";
import { resourceAccessWhere } from "../../resource/resource.service";

const assertResourceAccess = async (userId: string, resourceId: string) => {
  const resource = await prisma.resource.findFirst({
    where: { id: resourceId, ...(await resourceAccessWhere(userId)) },
    select: { id: true },
  });
  if (!resource) throw new AppError(status.FORBIDDEN, "You do not have access to this resource");
};

const getAnnotations = async (userId: string, resourceId: string) => {
  await assertResourceAccess(userId, resourceId);
  return prisma.resourceAnnotation.findMany({
    where: { userId, resourceId },
    orderBy: { createdAt: "asc" },
  });
};

const getSharedAnnotations = async (resourceId: string, userId: string) => {
  await assertResourceAccess(userId, resourceId);
  return prisma.resourceAnnotation.findMany({
    where: { resourceId, isShared: true, NOT: { userId } },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });
};

const createAnnotation = async (
  userId: string,
  payload: { resourceId: string; highlight?: string; note?: string; page?: number; isShared?: boolean; }
) => {
  await assertResourceAccess(userId, payload.resourceId);

  return prisma.resourceAnnotation.create({
    data: {
      userId,
      resourceId: payload.resourceId,
      ...(payload.highlight !== undefined && { highlight: payload.highlight }),
      ...(payload.note !== undefined && { note: payload.note }),
      ...(payload.page !== undefined && { page: payload.page }),
      isShared: payload.isShared ?? false,
    },
  });
};

const updateAnnotation = async (
  userId: string,
  id: string,
  payload: { highlight?: string; note?: string; page?: number; isShared?: boolean; }
) => {
  const annotation = await prisma.resourceAnnotation.findUnique({ where: { id } });
  if (!annotation) throw new AppError(status.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError(status.FORBIDDEN, "Not your annotation");

  return prisma.resourceAnnotation.update({
    where: { id },
    data: {
      ...(payload.highlight !== undefined && { highlight: payload.highlight }),
      ...(payload.note !== undefined && { note: payload.note }),
      ...(payload.page !== undefined && { page: payload.page }),
      ...(payload.isShared !== undefined && { isShared: payload.isShared }),
    },
  });
};

const deleteAnnotation = async (userId: string, id: string) => {
  const annotation = await prisma.resourceAnnotation.findUnique({ where: { id } });
  if (!annotation) throw new AppError(status.NOT_FOUND, "Annotation not found");
  if (annotation.userId !== userId) throw new AppError(status.FORBIDDEN, "Not your annotation");
  await prisma.resourceAnnotation.delete({ where: { id } });
  return { deleted: true };
};

const getResources = async (userId: string) => {
  return prisma.resource.findMany({
    where: await resourceAccessWhere(userId),
    select: { id: true, title: true, fileType: true, fileUrl: true, description: true, visibility: true, uploaderId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
};

export const annotationService = {
  getAnnotations,
  getSharedAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  getResources,
};
