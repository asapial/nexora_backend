import { prisma } from "../../../lib/prisma";
import AppError from "../../../errorHelpers/AppError";
import status from "http-status";

const getAnnotations = async (userId: string, resourceId: string) => {
  return prisma.resourceAnnotation.findMany({
    where: { userId, resourceId },
    orderBy: { createdAt: "asc" },
  });
};

const getSharedAnnotations = async (resourceId: string, userId: string) => {
  return prisma.resourceAnnotation.findMany({
    where: { resourceId, isShared: true, NOT: { userId } },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });
};

const createAnnotation = async (
  userId: string,
  payload: { resourceId: string; highlight?: string; note?: string; page?: number; isShared?: boolean }
) => {
  const resource = await prisma.resource.findUnique({ where: { id: payload.resourceId } });
  if (!resource) throw new AppError(status.NOT_FOUND, "Resource not found");

  return prisma.resourceAnnotation.create({
    data: {
      userId,
      resourceId: payload.resourceId,
      highlight: payload.highlight,
      note: payload.note,
      page: payload.page,
      isShared: payload.isShared ?? false,
    },
  });
};

const updateAnnotation = async (
  userId: string,
  id: string,
  payload: { highlight?: string; note?: string; page?: number; isShared?: boolean }
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
  // Get resources accessible to the student (public + cluster-level if member)
  const memberships = await prisma.clusterMember.findMany({
    where: { userId },
    select: { clusterId: true },
  });
  const clusterIds = memberships.map((m) => m.clusterId);

  return prisma.resource.findMany({
    where: {
      OR: [
        { visibility: "PUBLIC" },
        { visibility: "CLUSTER", clusterId: { in: clusterIds } },
        { uploaderId: userId },
      ],
    },
    select: { id: true, title: true, fileType: true, fileUrl: true, description: true, createdAt: true },
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
