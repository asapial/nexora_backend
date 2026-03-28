import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

type PublicCourseQuery = {
  page?: string;
  limit?: string;
  search?: string;
  isFree?: string;
  featured?: string;
  tag?: string;
};

const getPublicCourses = async (query: PublicCourseQuery) => {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.max(1, Number(query.limit ?? 12));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.isFree === "true") where.isFree = true;
  if (query.isFree === "false") where.isFree = false;
  if (query.featured === "true") where.isFeatured = true;
  if (query.tag) where.tags = { has: query.tag };

  const [total, data] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      include: {
        _count: { select: { enrollments: true, missions: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getPublicCourseById = async (courseId: string) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, status: "PUBLISHED" },
    include: {
      teacher: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      missions: {
        where: { status: "APPROVED" },
        select: { id: true, title: true, order: true },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true, missions: true } },
    },
  });

  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  return course;
};

export const publicCourseService = {
  getPublicCourses,
  getPublicCourseById,
};

