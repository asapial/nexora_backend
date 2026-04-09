import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

// Public: get latest 6 approved testimonials
const getApproved = async () => {
  return prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
};

// Authenticated user: submit a testimonial
const create = async (
  userId: string,
  data: { name: string; role: string; quote: string; rating: number }
) => {
  // Check if user already has a pending/approved testimonial
  const existing = await prisma.testimonial.findFirst({
    where: { userId, status: { in: ["PENDING", "APPROVED"] } },
  });
  if (existing) {
    throw new AppError(
      status.CONFLICT,
      "You already have a testimonial submitted or approved."
    );
  }
  return prisma.testimonial.create({
    data: { userId, ...data },
  });
};

// Admin: get all submitted (PENDING) testimonials
const getPending = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    }),
    prisma.testimonial.count({ where: { status: "PENDING" } }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Admin: get all approved testimonials
const getAllApproved = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
    }),
    prisma.testimonial.count({ where: { status: "APPROVED" } }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Admin: approve a testimonial
const approve = async (id: string) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError(status.NOT_FOUND, "Testimonial not found.");
  return prisma.testimonial.update({
    where: { id },
    data: { status: "APPROVED" },
  });
};

// Admin: delete a testimonial
const remove = async (id: string) => {
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) throw new AppError(status.NOT_FOUND, "Testimonial not found.");
  await prisma.testimonial.delete({ where: { id } });
  return { message: "Testimonial deleted." };
};

export const testimonialService = {
  getApproved,
  create,
  getPending,
  getAllApproved,
  approve,
  remove,
};
