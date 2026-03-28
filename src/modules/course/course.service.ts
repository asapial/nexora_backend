
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { CreateCourseInput, CreateMissionInput, CreatePriceRequestInput, EnrollmentQueryParams, PublicCourseQuery, UpdateCourseInput, UpdateMissionInput } from "./course.type";
import { MissionStatus } from "../../generated/prisma/enums";



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
        where: { status: MissionStatus.PUBLISHED },
        select: { id: true, title: true, order: true },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true, missions: true } },
    },
  });

  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  return course;
};


const getTeacherIdByUserId = async (userId: string) => {
  const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(status.NOT_FOUND, "Teacher profile not found.");
  return profile.id;
};

const createCourse = async (userId: string, input: CreateCourseInput) => {
  const teacherId = await getTeacherIdByUserId(userId);

  const course = await prisma.course.create({
    data: {
      teacherId,
      title: input.title,
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.thumbnailUrl ? { thumbnailUrl: input.thumbnailUrl } : {}),
      tags: input.tags ?? [],
      isFree: input.isFree,
      price: 0, // price only set after admin approval
      ...(input.requestedPrice !== undefined ? { requestedPrice: input.requestedPrice } : {}),
      priceApprovalStatus: input.isFree ? "APPROVED" : "PENDING",
      status: "DRAFT",
    },
  });

  // If paid, immediately create a price request
  if (!input.isFree && input.requestedPrice) {
    await prisma.coursePriceRequest.create({
      data: {
        courseId: course.id,
        teacherId,
        requestedPrice: input.requestedPrice,
        note: input.priceNote,
        status: "PENDING",
      },
    });
  }

  return course;
};

const getMyCourses = async (userId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);

  return prisma.course.findMany({
    where: { teacherId },
    include: {
      _count: { select: { enrollments: true, missions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getCourseById = async (userId: string, courseId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({
    where: { id: courseId, teacherId },
    include: {
      missions: { include: { _count: { select: { contents: true } } }, orderBy: { order: "asc" } },
      _count: { select: { enrollments: true, missions: true } },
    },
  });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  return course;
};

const updateCourse = async (userId: string, courseId: string, input: UpdateCourseInput) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError(status.BAD_REQUEST, "Only DRAFT or REJECTED courses can be edited.");
  }
  return prisma.course.update({ where: { id: courseId }, data: input });
};

const submitCourse = async (userId: string, courseId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  if (course.status !== "DRAFT" && course.status !== "REJECTED") {
    throw new AppError(status.BAD_REQUEST, "Only DRAFT or REJECTED courses can be submitted.");
  }
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PENDING_APPROVAL", submittedAt: new Date() },
  });
};

const closeCourse = async (userId: string, courseId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED") {
    throw new AppError(status.BAD_REQUEST, "Only PUBLISHED courses can be closed.");
  }
  return prisma.course.update({ where: { id: courseId }, data: { status: "CLOSED" } });
};

// ─────────────────────────────────────────────────────────
// ENROLLMENTS
// ─────────────────────────────────────────────────────────

const getEnrollments = async (userId: string, courseId: string, query: EnrollmentQueryParams) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");

  const { page = 1, limit = 20, search, paymentStatus } = query;

  const where: any = { courseId };
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search) {
    where.user = { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] };
  }

  const [total, enrollments] = await Promise.all([
    prisma.courseEnrollment.count({ where }),
    prisma.courseEnrollment.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
      orderBy: { enrolledAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return { data: enrollments, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getEnrollmentStats = async (userId: string, courseId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");

  const [total, paid, free, completed, revenueAgg] = await Promise.all([
    prisma.courseEnrollment.count({ where: { courseId } }),
    prisma.courseEnrollment.count({ where: { courseId, paymentStatus: "PAID" } }),
    prisma.courseEnrollment.count({ where: { courseId, paymentStatus: "FREE" } }),
    prisma.courseEnrollment.count({ where: { courseId, completedAt: { not: null } } }),
    prisma.courseEnrollment.aggregate({
      where: { courseId },
      _sum: { teacherEarning: true, amountPaid: true },
    }),
  ]);

  return {
    total, paid, free, completed,
    totalRevenue: revenueAgg._sum.amountPaid ?? 0,
    teacherEarning: revenueAgg._sum.teacherEarning ?? 0,
  };
};

// ─────────────────────────────────────────────────────────
// PRICE REQUESTS
// ─────────────────────────────────────────────────────────

const createPriceRequest = async (userId: string, courseId: string, input: CreatePriceRequestInput) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");

  // Check no active pending request exists
  const pending = await prisma.coursePriceRequest.findFirst({
    where: { courseId, status: "PENDING" },
  });
  if (pending) throw new AppError(status.CONFLICT, "A price request is already pending admin review.");

  return prisma.coursePriceRequest.create({
    data: { courseId, teacherId, requestedPrice: input.requestedPrice, note: input.note, status: "PENDING" },
  });
};

const getPriceRequests = async (userId: string, courseId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  return prisma.coursePriceRequest.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
  });
};

// ─────────────────────────────────────────────────────────
// MISSIONS
// ─────────────────────────────────────────────────────────

const guardCourseOwnership = async (userId: string, courseId: string) => {
  const teacherId = await getTeacherIdByUserId(userId);
  const course = await prisma.course.findFirst({ where: { id: courseId, teacherId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  return course;
};

const getMissions = async (userId: string, courseId: string) => {
  await guardCourseOwnership(userId, courseId);
  return prisma.courseMission.findMany({
    where: { courseId },
    include: { _count: { select: { contents: true } } },
    orderBy: { order: "asc" },
  });
};

const createMission = async (userId: string, courseId: string, input: CreateMissionInput) => {
  const course = await guardCourseOwnership(userId, courseId);
  if (course.status !== "PUBLISHED") {
    throw new AppError(status.BAD_REQUEST, "Missions can only be added to PUBLISHED courses.");
  }
  const count = await prisma.courseMission.count({ where: { courseId } });
  return prisma.courseMission.create({
    data: {
      courseId,
      title: input.title,
      description: input.description,
      order: input.order ?? count,
      status: "DRAFT",
    },
  });
};

const updateMission = async (userId: string, courseId: string, missionId: string, input: UpdateMissionInput) => {
  await guardCourseOwnership(userId, courseId);
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError(status.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError(status.BAD_REQUEST, "Only DRAFT or REJECTED missions can be edited.");
  }
  return prisma.courseMission.update({ where: { id: missionId }, data: input });
};

const deleteMission = async (userId: string, courseId: string, missionId: string) => {
  const course = await guardCourseOwnership(userId, courseId);
  if (course.status === "CLOSED") throw new AppError(status.BAD_REQUEST, "Cannot delete missions from a CLOSED course.");
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError(status.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT") throw new AppError(status.BAD_REQUEST, "Only DRAFT missions can be deleted.");
  await prisma.courseMission.delete({ where: { id: missionId } });
  return { message: "Mission deleted" };
};

const submitMission = async (userId: string, courseId: string, missionId: string) => {
  await guardCourseOwnership(userId, courseId);
  const mission = await prisma.courseMission.findFirst({ where: { id: missionId, courseId } });
  if (!mission) throw new AppError(status.NOT_FOUND, "Mission not found.");
  if (mission.status !== "DRAFT" && mission.status !== "REJECTED") {
    throw new AppError(status.BAD_REQUEST, "Only DRAFT or REJECTED missions can be submitted.");
  }
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "PENDING_APPROVAL", submittedAt: new Date() },
  });
};

export const courseService = {
  getPublicCourses,
  getPublicCourseById,
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  submitCourse,
  closeCourse,
  getEnrollments,
  getEnrollmentStats,
  createPriceRequest,
  getPriceRequests,
  guardCourseOwnership,
  getMissions,
  createMission,
  updateMission,
  deleteMission,
  submitMission



};
