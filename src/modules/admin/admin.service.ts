import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { generatePassword } from "../../utils/generatePassword";
import { sendEmail } from "../../utils/emailSender";
import { envVars } from "../../config/env";
import { Role } from "../../generated/prisma/enums";
import status from "http-status";
import AppError from "../../errorHelpers/AppError";

const createTeacher = async (emails: string[]) => {
  const result = {
    newAccountsCreated: [] as string[],
    existingUpgraded: [] as string[],
    alreadyRegisteredAsTeacher: [] as string[],
  };

  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true },
    });

    if (!existingUser) {
      // 1. User is not registered at all
      const plainPassword = generatePassword(12);

      const newUser = await auth.api.signUpEmail({
        body: {
          name: email.split("@")[0] as string,
          email,
          password: plainPassword,
        },
      });

      // Update role to TEACHER
      const user = await prisma.user.update({
        where: { id: newUser.user.id },
        data: { role: Role.TEACHER, needPasswordChange: true },
      });

      // Create TeacherProfile
      await prisma.teacherProfile.create({
        data: { userId: user.id },
      });

      // Send Welcome Email with Password
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Teacher Account Created`,
        templateName: "teacherWelcome",
        templateData: {
          name: email.split("@")[0] as string,
          email,
          password: plainPassword,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.newAccountsCreated.push(email);
    } else if (!existingUser.teacherProfile) {
      // 2. User exists but is not a teacher
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: Role.TEACHER },
      });

      await prisma.teacherProfile.create({
        data: { userId: existingUser.id },
      });

      // Send Welcome Email without password
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Promoted to Teacher`,
        templateName: "teacherWelcome",
        templateData: {
          email,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.existingUpgraded.push(email);
    } else {
      // 3. User is already a Teacher
      result.alreadyRegisteredAsTeacher.push(email);
    }
  }

  return result;
};

const createAdmin = async (emails: string[]) => {
  const result = {
    newAccountsCreated: [] as string[],
    existingUpgraded: [] as string[],
    alreadyRegisteredAsAdmin: [] as string[],
  };

  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { adminProfile: true },
    });

    if (!existingUser) {
      // 1. User is not registered at all
      const plainPassword = generatePassword(12);

      const newUser = await auth.api.signUpEmail({
        body: {
          name: email.split("@")[0] as string,
          email,
          password: plainPassword,
        },
      });

      // Update role to TEACHER
      const user = await prisma.user.update({
        where: { id: newUser.user.id },
        data: { role: Role.ADMIN, needPasswordChange: true },
      });

      // Create TeacherProfile
      await prisma.adminProfile.create({
        data: { userId: user.id },
      });

      // Send Welcome Email with Password
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Teacher Account Created`,
        templateName: "teacherWelcome",
        templateData: {
          name: email.split("@")[0] as string,
          email,
          password: plainPassword,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.newAccountsCreated.push(email);
    } else if (!existingUser.adminProfile) {
      // 2. User exists but is not a teacher
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: Role.ADMIN },
      });

      await prisma.adminProfile.create({
        data: { userId: existingUser.id },
      });

      // Send Welcome Email without password
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Promoted to Teacher`,
        templateName: "teacherWelcome",
        templateData: {
          email,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.existingUpgraded.push(email);
    } else {
      // 3. User is already a Admin
      result.alreadyRegisteredAsAdmin.push(email);
    }
  }

  return result;
};


// ─────────────────────────────────────────────────────────
// COURSE APPROVALS
// ─────────────────────────────────────────────────────────

const getPendingCourses = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where: { status: "PENDING_APPROVAL" },
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
        _count: { select: { missions: true, enrollments: true } },
      },
      orderBy: { submittedAt: "asc" },
      skip, take: limit,
    }),
    prisma.course.count({ where: { status: "PENDING_APPROVAL" } }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getAllCourses = async (params: {
  page?: number; limit?: number; search?: string;
  status?: string; featured?: boolean; teacherId?: string;
}) => {
  const { page = 1, limit = 20, search, status: st, featured, teacherId } = params;
  const skip = (page - 1) * limit;
  const where: any = {};
  if (st) where.status = st;
  if (featured !== undefined) where.isFeatured = featured;
  if (teacherId) where.teacherId = teacherId;
  if (search) where.OR = [
    { title: { contains: search, mode: "insensitive" } },
    { teacher: { user: { name: { contains: search, mode: "insensitive" } } } },
  ];

  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { missions: true, enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip, take: limit,
    }),
    prisma.course.count({ where }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getCourseById = async (courseId: string) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
      missions: {
        include: { _count: { select: { contents: true } } },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true, missions: true } },
      enrollments: {
        take: 5, orderBy: { enrolledAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  const revenueAgg = await prisma.courseEnrollment.aggregate({
    where: { courseId },
    _sum: { amountPaid: true, teacherEarning: true },
  });
  return { ...course, totalRevenue: revenueAgg._sum.amountPaid ?? 0, teacherEarning: revenueAgg._sum.teacherEarning ?? 0 };
};

const approveCourse = async (courseId: string, adminId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  if (course.status !== "PENDING_APPROVAL") throw new AppError(status.BAD_REQUEST, "Course is not pending approval.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "PUBLISHED", approvedAt: new Date(), approvedById: adminId, rejectedNote: null },
  });
};

const rejectCourse = async (courseId: string, note: string, adminId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  return prisma.course.update({
    where: { id: courseId },
    data: { status: "REJECTED", rejectedAt: new Date(), rejectedNote: note },
  });
};

const deleteCourse = async (courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  await prisma.course.delete({ where: { id: courseId } });
  return { message: "Course permanently deleted." };
};

const toggleFeatured = async (courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  return prisma.course.update({ where: { id: courseId }, data: { isFeatured: !course.isFeatured } });
};

const setRevenuePercent = async (courseId: string, percent: number) => {
  if (percent < 0 || percent > 100) throw new AppError(status.BAD_REQUEST, "Percent must be 0–100.");
  return prisma.course.update({ where: { id: courseId }, data: { teacherRevenuePercent: percent } });
};

// ─────────────────────────────────────────────────────────
// MISSION APPROVALS
// ─────────────────────────────────────────────────────────

const getPendingMissions = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.courseMission.findMany({
      where: { status: "PENDING_APPROVAL" },
      include: {
        course: {
          include: { teacher: { include: { user: { select: { id: true, name: true, email: true } } } } },
        },
        contents: { orderBy: { order: "asc" } },
        _count: { select: { contents: true } },
      },
      orderBy: { submittedAt: "asc" },
      skip, take: limit,
    }),
    prisma.courseMission.count({ where: { status: "PENDING_APPROVAL" } }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const approveMission = async (missionId: string, adminId: string) => {
  const mission = await prisma.courseMission.findUnique({ where: { id: missionId } });
  if (!mission) throw new AppError(status.NOT_FOUND, "Mission not found.");
  if (mission.status !== "PENDING_APPROVAL") throw new AppError(status.BAD_REQUEST, "Mission is not pending approval.");
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "PUBLISHED", approvedAt: new Date(), approvedById: adminId, rejectedNote: null },
  });
};

const rejectMission = async (missionId: string, note: string) => {
  const mission = await prisma.courseMission.findUnique({ where: { id: missionId } });
  if (!mission) throw new AppError(status.NOT_FOUND, "Mission not found.");
  return prisma.courseMission.update({
    where: { id: missionId },
    data: { status: "REJECTED", rejectedAt: new Date(), rejectedNote: note },
  });
};

// ─────────────────────────────────────────────────────────
// PRICE REQUEST APPROVALS
// ─────────────────────────────────────────────────────────

const getPendingPriceRequests = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.coursePriceRequest.findMany({
      where: { status: "PENDING" },
      include: {
        course: { select: { id: true, title: true, price: true } },
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { createdAt: "asc" },
      skip, take: limit,
    }),
    prisma.coursePriceRequest.count({ where: { status: "PENDING" } }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const approvePriceRequest = async (requestId: string, price: number, adminId: string) => {
  const req = await prisma.coursePriceRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new AppError(status.NOT_FOUND, "Price request not found.");
  await prisma.$transaction([
    prisma.coursePriceRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED", reviewedAt: new Date(), reviewedById: adminId },
    }),
    prisma.course.update({
      where: { id: req.courseId },
      data: { price, priceApprovalStatus: "APPROVED", isFree: price === 0 },
    }),
  ]);
  return { message: "Price approved and applied to course." };
};

const rejectPriceRequest = async (requestId: string, note: string, adminId: string) => {
  const req = await prisma.coursePriceRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new AppError(status.NOT_FOUND, "Price request not found.");
  return prisma.coursePriceRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", adminNote: note, reviewedAt: new Date(), reviewedById: adminId },
  });
};

// ─────────────────────────────────────────────────────────
// ENROLLMENTS
// ─────────────────────────────────────────────────────────

const getAllEnrollments = async (params: {
  page?: number; limit?: number; search?: string;
  courseId?: string; paymentStatus?: string; from?: string; to?: string;
}) => {
  const { page = 1, limit = 25, search, courseId, paymentStatus, from, to } = params;
  const skip = (page - 1) * limit;
  const where: any = {};
  if (courseId) where.courseId = courseId;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (from || to) {
    where.enrolledAt = {};
    if (from) where.enrolledAt.gte = new Date(from);
    if (to) where.enrolledAt.lte = new Date(to);
  }
  if (search) {
    where.user = { OR: [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]};
  }
  const [data, total] = await Promise.all([
    prisma.courseEnrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        course: { select: { id: true, title: true, price: true } },
      },
      orderBy: { enrolledAt: "desc" },
      skip, take: limit,
    }),
    prisma.courseEnrollment.count({ where }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ─────────────────────────────────────────────────────────
// REVENUE
// ─────────────────────────────────────────────────────────

const getRevenueSummary = async () => {
  const [totals, perCourse, perTeacher] = await Promise.all([
    prisma.revenueTransaction.aggregate({
      _sum: { totalAmount: true, teacherEarning: true, platformEarning: true },
      _count: { id: true },
    }),
    prisma.revenueTransaction.groupBy({
      by: ["courseId"],
      _sum: { totalAmount: true, teacherEarning: true, platformEarning: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: "desc" } },
    }),
    prisma.revenueTransaction.groupBy({
      by: ["teacherId"],
      _sum: { totalAmount: true, teacherEarning: true },
      _count: { id: true },
      orderBy: { _sum: { teacherEarning: "desc" } },
    }),
  ]);

  // Enrich with names
  const courseIds = perCourse.map(c => c.courseId);
  const teacherIds = perTeacher.map(t => t.teacherId);
  const [courses, teachers] = await Promise.all([
    prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } }),
    prisma.teacherProfile.findMany({ where: { id: { in: teacherIds } }, include: { user: { select: { id: true, name: true } } } }),
  ]);
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.title]));
  const teacherMap = Object.fromEntries(teachers.map(t => [t.id, t.user.name]));

  return {
    grossRevenue: totals._sum.totalAmount ?? 0,
    platformEarnings: totals._sum.platformEarning ?? 0,
    teacherPayouts: totals._sum.teacherEarning ?? 0,
    totalPaidEnrollments: totals._count.id,
    perCourse: perCourse.map(c => ({
      courseId: c.courseId,
      title: courseMap[c.courseId] ?? c.courseId,
      revenue: c._sum.totalAmount ?? 0,
      platformCut: c._sum.platformEarning ?? 0,
      enrollments: c._count.id,
    })),
    perTeacher: perTeacher.map(t => ({
      teacherId: t.teacherId,
      name: teacherMap[t.teacherId] ?? t.teacherId,
      earnings: t._sum.teacherEarning ?? 0,
      courses: t._count.id,
    })),
  };
};

const getRevenueTransactions = async (params: { page?: number; limit?: number; search?: string; courseId?: string }) => {
  const { page = 1, limit = 15, search, courseId } = params;
  const skip = (page - 1) * limit;
  const where: any = {};
  if (courseId) where.courseId = courseId;
  const [data, total] = await Promise.all([
    prisma.revenueTransaction.findMany({
      where,
      orderBy: { transactedAt: "desc" },
      skip, take: limit,
    }),
    prisma.revenueTransaction.count({ where }),
  ]);
  // Enrich student + course names
  const courseIds = [...new Set(data.map(d => d.courseId))];
  const userIds = [...new Set(data.map(d => d.studentId))];
  const [courses, users] = await Promise.all([
    prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } }),
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } }),
  ]);
  const cm = Object.fromEntries(courses.map(c => [c.id, c.title]));
  const um = Object.fromEntries(users.map(u => [u.id, u.name]));
  return {
    data: data.map(d => ({ ...d, courseTitle: cm[d.courseId], studentName: um[d.studentId] })),
    total, page, limit, totalPages: Math.ceil(total / limit),
  };
};


export const adminService = {
  createTeacher,createAdmin,  getPendingCourses, getAllCourses, getCourseById, approveCourse, rejectCourse,
  deleteCourse, toggleFeatured, setRevenuePercent,
  getPendingMissions, approveMission, rejectMission,
  getPendingPriceRequests, approvePriceRequest, rejectPriceRequest,
  getAllEnrollments,
  getRevenueSummary, getRevenueTransactions
};