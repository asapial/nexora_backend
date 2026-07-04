import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

type ResourceFilter = {
  categoryId?: string;
  year?: string;
  tags?: string;
  fileType?: string;
  clusterId?: string;
  visibility?: string;
  page?: string;
  limit?: string;
  search?: string;
  uploaderId?: string;
};

type ResourceUpdatePayload = {
  title?: string;
  description?: string | null;
  authors?: string[];
  tags?: string[];
  year?: number | null;
  categoryId?: string | null;
  clusterIds?: string[];
  visibility?: string;
};

const includeResourceRelations = {
  category: { select: { id: true, name: true, color: true } },
  uploader: { select: { id: true, name: true, email: true, image: true } },
  cluster: { select: { id: true, name: true } },
};

const andWhere = (...clauses: Record<string, unknown>[]) => {
  const active = clauses.filter((clause) => Object.keys(clause).length > 0);
  if (active.length === 0) return {};
  if (active.length === 1) return active[0]!;
  return { AND: active };
};

export const buildResourceAccessWhere = (userId: string, clusterIds: string[]) => {
  const access: Record<string, unknown>[] = [
    { visibility: "PUBLIC" },
    { uploaderId: userId },
  ];

  if (clusterIds.length > 0) {
    access.push({
      visibility: "CLUSTER",
      OR: [
        { clusterId: { in: clusterIds } },
        { clusterIds: { hasSome: clusterIds } },
      ],
    });
  }

  return { OR: access };
};

export const buildTeacherLibraryAccessWhere = (teacherUserId: string) => ({
  OR: [{ visibility: "PUBLIC" }, { uploaderId: teacherUserId }],
});

const getUserClusterIds = async (userId: string) => {
  const [memberships, coTeacherRows, teacherProfile] = await Promise.all([
    prisma.clusterMember.findMany({ where: { userId }, select: { clusterId: true } }),
    prisma.coTeacher.findMany({ where: { userId }, select: { clusterId: true } }),
    prisma.teacherProfile.findUnique({
      where: { userId },
      select: { teacherClusters: { select: { id: true } } },
    }),
  ]);

  return [
    ...new Set([
      ...memberships.map((item) => item.clusterId),
      ...coTeacherRows.map((item) => item.clusterId),
      ...(teacherProfile?.teacherClusters.map((cluster) => cluster.id) ?? []),
    ]),
  ];
};

export const resourceAccessWhere = async (userId: string) =>
  buildResourceAccessWhere(userId, await getUserClusterIds(userId));

const filterWhere = (filters: ResourceFilter) => {
  const where: Record<string, unknown> = {};
  const clauses: Record<string, unknown>[] = [];

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.fileType) where.fileType = filters.fileType;
  if (filters.visibility) where.visibility = filters.visibility;
  if (filters.uploaderId) where.uploaderId = filters.uploaderId;
  if (filters.year) where.year = Number(filters.year);
  if (filters.clusterId) {
    clauses.push({
      OR: [
      { clusterId: filters.clusterId },
      { clusterIds: { has: filters.clusterId } },
      ],
    });
  }
  if (filters.tags) {
    where.tags = {
      hasSome: filters.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
  }
  if (filters.search) {
    clauses.push({
      OR: [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { tags: { has: filters.search } },
      ],
    });
  }

  return andWhere(where, ...clauses);
};

const uploadResource = async (resourcePayload: any) => {
  const clusterIds = Array.isArray(resourcePayload.clusterIds)
    ? resourcePayload.clusterIds
    : resourcePayload.clusterId
      ? [resourcePayload.clusterId]
      : [];

  return prisma.resource.create({
    data: {
      ...resourcePayload,
      clusterIds,
      clusterId: resourcePayload.clusterId ?? clusterIds[0] ?? null,
    },
  });
};

const allResources = async () =>
  prisma.resource.findMany({
    where: { visibility: "PUBLIC" },
    include: includeResourceRelations,
    orderBy: { createdAt: "desc" },
  });

const getFilteredResources = async (
  filters: ResourceFilter,
  userId?: string,
  accessOverride?: Record<string, unknown>,
  enforceAccess = false
) => {
  const page = Math.max(1, Number(filters.page ?? 1) || 1);
  const limit = Math.max(1, Math.min(50, Number(filters.limit ?? 12) || 12));
  const skip = (page - 1) * limit;
  const baseWhere = filterWhere(filters);
  const accessWhere = accessOverride
    ? accessOverride
    : enforceAccess
      ? userId
        ? await resourceAccessWhere(userId)
        : { visibility: "PUBLIC" }
      : {};
  const where = andWhere(baseWhere, accessWhere);

  const [resources, total] = await prisma.$transaction([
    prisma.resource.findMany({
      where,
      include: {
        ...includeResourceRelations,
        bookmarks: userId
          ? { where: { readingList: { userId } }, select: { id: true } }
          : false,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    resources: resources.map((resource) => ({
      ...resource,
      isBookmarked: userId ? (resource as any).bookmarks?.length > 0 : false,
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getTeacherLibraryResources = async (filters: ResourceFilter, teacherUserId: string) =>
  getFilteredResources(filters, teacherUserId, buildTeacherLibraryAccessWhere(teacherUserId));

const assertResourceAccess = async (userId: string, resourceId: string) => {
  const resource = await prisma.resource.findFirst({
    where: andWhere({ id: resourceId }, await resourceAccessWhere(userId)),
    select: { id: true },
  });
  if (!resource) throw new AppError(status.FORBIDDEN, "You do not have access to this resource.");
};

const assertResourceUrlAccess = async (userId: string, fileUrl: string) => {
  const resource = await prisma.resource.findFirst({
    where: andWhere({ fileUrl }, await resourceAccessWhere(userId)),
    select: { id: true },
  });
  if (!resource) throw new AppError(status.FORBIDDEN, "You do not have access to this resource.");
  return resource;
};

const bookmarkResource = async (userId: string, resourceId: string) => {
  await assertResourceAccess(userId, resourceId);

  let readingList = await prisma.readingList.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!readingList) {
    readingList = await prisma.readingList.create({
      data: { userId, name: "My Bookmarks" },
      select: { id: true },
    });
  }

  const existing = await prisma.readingListItem.findFirst({
    where: { readingListId: readingList.id, resourceId },
  });
  if (existing) throw new AppError(status.CONFLICT, "Resource already bookmarked.");

  return prisma.readingListItem.create({
    data: { readingListId: readingList.id, resourceId },
  });
};

const removeBookmark = async (userId: string, resourceId: string) => {
  const readingList = await prisma.readingList.findFirst({
    where: { userId },
    select: { id: true },
  });
  if (!readingList) throw new AppError(status.NOT_FOUND, "No bookmarks found.");

  const item = await prisma.readingListItem.findFirst({
    where: { readingListId: readingList.id, resourceId },
  });
  if (!item) throw new AppError(status.NOT_FOUND, "Bookmark not found.");

  return prisma.readingListItem.delete({ where: { id: item.id } });
};

const getCategories = async () =>
  prisma.resourceCategory.findMany({
    orderBy: { name: "asc" },
  });

const assertOwner = async (resourceId: string, userId: string) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError(status.NOT_FOUND, "Resource not found.");
  if (resource.uploaderId !== userId) {
    throw new AppError(status.FORBIDDEN, "Only the uploader can modify this resource.");
  }
  return resource;
};

const updateResource = async (resourceId: string, userId: string, payload: ResourceUpdatePayload) => {
  await assertOwner(resourceId, userId);
  const clusterIds = payload.clusterIds;

  return prisma.resource.update({
    where: { id: resourceId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.authors !== undefined && { authors: payload.authors }),
      ...(payload.tags !== undefined && { tags: payload.tags }),
      ...(payload.year !== undefined && { year: payload.year }),
      ...(payload.categoryId !== undefined && { categoryId: payload.categoryId || null }),
      ...(payload.visibility !== undefined && { visibility: payload.visibility as any }),
      ...(clusterIds !== undefined && {
        clusterIds,
        clusterId: clusterIds[0] ?? null,
      }),
    },
    include: includeResourceRelations,
  });
};

const deleteResource = async (resourceId: string, userId: string) => {
  await assertOwner(resourceId, userId);

  await prisma.$transaction([
    prisma.readingListItem.deleteMany({ where: { resourceId } }),
    prisma.resourceAnnotation.deleteMany({ where: { resourceId } }),
    prisma.resourceComment.deleteMany({ where: { resourceId } }),
    prisma.resourceQuiz.deleteMany({ where: { resourceId } }),
    prisma.resourceCitationEdge.deleteMany({
      where: { OR: [{ sourceResourceId: resourceId }, { targetResourceId: resourceId }] },
    }),
    prisma.resourceProcessingJobAudit.deleteMany({ where: { resourceId } }),
    prisma.resource.delete({ where: { id: resourceId } }),
  ]);

  return { deleted: true };
};

export const resourceService = {
  uploadResource,
  allResources,
  getFilteredResources,
  getTeacherLibraryResources,
  bookmarkResource,
  removeBookmark,
  getCategories,
  assertResourceAccess,
  assertResourceUrlAccess,
  updateResource,
  deleteResource,
};
