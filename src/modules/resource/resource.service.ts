import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const uploadResource = async (resourcePayload: any) => {
  // Normalise clusterIds — always an array, derived from either clusterIds[] or single clusterId
  const clusterIds: string[] = Array.isArray(resourcePayload.clusterIds)
    ? resourcePayload.clusterIds.filter(Boolean)
    : resourcePayload.clusterId
      ? [resourcePayload.clusterId]
      : [];

  const data = {
    ...resourcePayload,
    clusterId: clusterIds[0] ?? null,   // primary FK (first selected)
    clusterIds: clusterIds,              // all selected
  };
  const result = await prisma.resource.create({ data });
  return result;
};

const allResources = async () => {
  const result = await prisma.resource.findMany({
    include: {
      category: { select: { id: true, name: true } },
      uploader: { select: { name: true, email: true } },
      cluster: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

interface ResourceFilter {
  categoryId?: string;
  year?: string;
  tags?: string;
  fileType?: string;
  clusterId?: string;
  visibility?: string;
  page?: string;
  limit?: string;
  search?: string;
  author?: string;
  uploaderId?: string;
  bookmarked?: string;
}

const getFilteredResources = async (
  filters: ResourceFilter,
  userId?: string,
  browseMode = false           // true → enforce PUBLIC/CLUSTER visibility gate
) => {
  const page = parseInt(filters.page ?? "1", 10);
  const limit = parseInt(filters.limit ?? "12", 10);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  // ── Visibility gate for browse mode ─────────────────────────────────────────
  if (browseMode) {
    // Find all clusters the requesting user belongs to (as student or teacher)
    const memberClusterIds = userId
      ? (await prisma.clusterMember.findMany({
        where: { userId },
        select: { clusterId: true },
      })).map((m) => m.clusterId)
      : [];

    where.OR = [
      { visibility: "PUBLIC" },
      ...(memberClusterIds.length > 0
        ? [{ visibility: "CLUSTER", clusterId: { in: memberClusterIds } }]
        : []),
    ];
  }

  // ── Individual filters ───────────────────────────────────────────────────────
  // (These stack on top of the visibility gate via AND in Prisma where object)
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.fileType) where.fileType = filters.fileType;
  // Don't override the visibility OR gate if browseMode is on
  if (!browseMode && filters.visibility) where.visibility = filters.visibility;
  if (filters.clusterId) where.clusterId = filters.clusterId;
  if ((filters as any).uploaderId) where.uploaderId = (filters as any).uploaderId;
  if (filters.year) where.year = parseInt(filters.year, 10);
  if (filters.tags) {
    where.tags = { hasSome: filters.tags.split(",") };
  }
  if (filters.author) {
    where.authors = { has: filters.author };
  }
  if (filters.search) {
    // Merge search OR with any existing OR (visibility gate)
    const searchOr = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { authors: { hasSome: [filters.search] } },
    ];
    if (where.OR) {
      // Combine: (visibility conditions) AND (search conditions) using AND
      where.AND = [{ OR: where.OR }, { OR: searchOr }];
      delete where.OR;
    } else {
      where.OR = searchOr;
    }
  }
  if (filters.bookmarked === "true" && userId) {
    where.bookmarks = { some: { readingList: { userId } } };
  }

  const [resources, total] = await prisma.$transaction([
    prisma.resource.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        uploader: { select: { name: true, email: true } },
        cluster: { select: { id: true, name: true } },
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
    resources: resources.map((r) => ({
      ...r,
      isBookmarked: userId ? (r as any).bookmarks?.length > 0 : false,
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const bookmarkResource = async (userId: string, resourceId: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });
  if (!resource) throw new AppError(status.NOT_FOUND, "Resource not found.");

  // Find or create a ReadingList for user (userId not unique, use findFirst)
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
  if (existing) {
    throw new AppError(status.CONFLICT, "Resource already bookmarked.");
  }

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

const getCategories = async () => {
  return prisma.resourceCategory.findMany({
    orderBy: { name: "asc" },
  });
};

const deleteResource = async (resourceId: string, uploaderId: string) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError(status.NOT_FOUND, "Resource not found.");
  if (resource.uploaderId !== uploaderId)
    throw new AppError(status.FORBIDDEN, "You can only delete your own resources.");

  // Delete all child records in dependency order (FK constraints)
  await prisma.$transaction([
    prisma.readingListItem.deleteMany({ where: { resourceId } }),
    prisma.resourceAnnotation.deleteMany({ where: { resourceId } }),
    prisma.resourceQuiz.deleteMany({ where: { resourceId } }),
    prisma.resourceComment.deleteMany({ where: { resourceId } }),
    prisma.aiStudySession.deleteMany({ where: { resourceId } }),
  ]);

  // Now safe to delete the resource itself
  await prisma.resource.delete({ where: { id: resourceId } });

  // Clean up from Cloudinary (best-effort — don't fail the response if this errors)
  try {
    const { deleteFileFromCloudinary } = await import("../../config/cloudinary.config");
    await deleteFileFromCloudinary(resource.fileUrl);
  } catch (err) {
    console.warn("[resource] Cloudinary delete failed (file may already be gone):", err);
  }

  return { deleted: true };
};

const updateResource = async (
  resourceId: string,
  uploaderId: string,
  payload: {
    title?: string;
    description?: string;
    authors?: string[];
    tags?: string[];
    year?: number | null;
    categoryId?: string | null;
    clusterIds?: string[];
    visibility?: string;
  }
) => {
  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) throw new AppError(status.NOT_FOUND, "Resource not found.");
  if (resource.uploaderId !== uploaderId)
    throw new AppError(status.FORBIDDEN, "You can only edit your own resources.");

  const clusterIds = payload.clusterIds ?? resource.clusterIds ?? [];
  const clusterId = clusterIds[0] ?? resource.clusterId ?? null;

  const updated = await prisma.resource.update({
    where: { id: resourceId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.authors !== undefined && { authors: payload.authors }),
      ...(payload.tags !== undefined && { tags: payload.tags }),
      ...(payload.year !== undefined && { year: payload.year }),
      ...(payload.categoryId !== undefined && { categoryId: payload.categoryId }),
      ...(payload.visibility !== undefined && { visibility: payload.visibility as any }),
      clusterIds,
      clusterId,
    },
    include: {
      category: { select: { id: true, name: true } },
      cluster: { select: { id: true, name: true } },
    },
  });
  return updated;
};

export const resourceService = {
  uploadResource,
  allResources,
  getFilteredResources,
  bookmarkResource,
  removeBookmark,
  getCategories,
  deleteResource,
  updateResource,
};
