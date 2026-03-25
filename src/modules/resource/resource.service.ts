import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const uploadResource = async (resourcePayload: any) => {
  const result = await prisma.resource.create({ data: resourcePayload });
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
}

const getFilteredResources = async (filters: ResourceFilter, userId?: string) => {
  const page = parseInt(filters.page ?? "1", 10);
  const limit = parseInt(filters.limit ?? "12", 10);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.fileType) where.fileType = filters.fileType;
  if (filters.visibility) where.visibility = filters.visibility;
  if (filters.clusterId) where.clusterId = filters.clusterId;
  if (filters.year) where.year = parseInt(filters.year, 10);
  if (filters.tags) {
    where.tags = { hasSome: filters.tags.split(",") };
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
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
      isBookmarked: userId
        ? (r as any).bookmarks?.length > 0
        : false,
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

export const resourceService = {
  uploadResource,
  allResources,
  getFilteredResources,
  bookmarkResource,
  removeBookmark,
  getCategories,
};