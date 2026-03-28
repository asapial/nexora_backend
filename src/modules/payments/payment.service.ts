
import { status } from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

/** Shared by Stripe webhook and POST /payments/confirm — idempotent. */
const finalizeSuccessfulPaymentIntent = async (intent: Stripe.PaymentIntent) => {
  if (intent.status !== "succeeded") {
    throw new AppError(status.BAD_REQUEST, "Payment has not completed successfully yet.");
  }

  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: intent.id },
  });
  if (!payment) {
    throw new AppError(status.NOT_FOUND, "No payment record found for this Stripe payment.");
  }

  if (payment.status === "PAID") {
    const existing = await prisma.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } },
    });
    if (existing) {
      return { enrollmentId: existing.id, alreadyFinalized: true as const };
    }
    // Payment row marked PAID but enrollment missing — repair (partial failure).
    await prisma.$transaction(async (tx) => {
      const enrollment = await tx.courseEnrollment.create({
        data: {
          courseId: payment.courseId,
          userId: payment.userId,
          paymentStatus: "PAID",
          paymentId: payment.stripePaymentIntentId,
          amountPaid: payment.amount,
          teacherEarning: payment.teacherEarning,
          platformEarning: payment.platformEarning,
        },
      });
      await tx.payment.update({
        where: { id: payment.id },
        data: { enrollmentId: enrollment.id },
      });
      const course = await tx.course.findUnique({
        where: { id: payment.courseId },
        select: { teacherId: true },
      });
      if (course) {
        const rt = await tx.revenueTransaction.findUnique({ where: { enrollmentId: enrollment.id } });
        if (!rt) {
          await tx.revenueTransaction.create({
            data: {
              enrollmentId: enrollment.id,
              courseId: payment.courseId,
              teacherId: course.teacherId,
              studentId: payment.userId,
              totalAmount: payment.amount,
              teacherPercent: payment.teacherRevenuePercent,
              teacherEarning: payment.teacherEarning,
              platformEarning: payment.platformEarning,
            },
          });
        }
      }
    });
    return { enrollmentId: (await prisma.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } },
    }))!.id, alreadyFinalized: false as const };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: new Date() },
    });

    let enrollment = await tx.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } },
    });

    if (!enrollment) {
      enrollment = await tx.courseEnrollment.create({
        data: {
          courseId: payment.courseId,
          userId: payment.userId,
          paymentStatus: "PAID",
          paymentId: payment.stripePaymentIntentId,
          amountPaid: payment.amount,
          teacherEarning: payment.teacherEarning,
          platformEarning: payment.platformEarning,
        },
      });
    }

    await tx.payment.update({
      where: { id: payment.id },
      data: { enrollmentId: enrollment.id },
    });

    const course = await tx.course.findUnique({
      where: { id: payment.courseId },
      select: { teacherId: true },
    });
    if (!course) {
      throw new AppError(status.NOT_FOUND, "Course not found.");
    }

    const existingRt = await tx.revenueTransaction.findUnique({
      where: { enrollmentId: enrollment.id },
    });
    if (!existingRt) {
      await tx.revenueTransaction.create({
        data: {
          enrollmentId: enrollment.id,
          courseId: payment.courseId,
          teacherId: course.teacherId,
          studentId: payment.userId,
          totalAmount: payment.amount,
          teacherPercent: payment.teacherRevenuePercent,
          teacherEarning: payment.teacherEarning,
          platformEarning: payment.platformEarning,
        },
      });
    }
  });

  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId: payment.courseId, userId: payment.userId } },
  });
  return { enrollmentId: enrollment!.id, alreadyFinalized: false as const };
};

const confirmPaymentFromClient = async (userId: string, paymentIntentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });
  if (!payment) {
    throw new AppError(status.NOT_FOUND, "Payment record not found.");
  }
  if (payment.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "This payment does not belong to your account.");
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return finalizeSuccessfulPaymentIntent(intent);
};

/**
 * If Stripe shows succeeded but webhook never ran (common on localhost), finalize using the latest payment for this course.
 */
/** Scan pending DB payments and finalize any that Stripe already marked succeeded (webhook miss). */
const syncAllPendingPaymentsForUser = async (userId: string) => {
  const pending = await prisma.payment.findMany({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
  let finalized = 0;
  for (const p of pending) {
    try {
      const intent = await stripe.paymentIntents.retrieve(p.stripePaymentIntentId);
      if (intent.status === "succeeded") {
        await finalizeSuccessfulPaymentIntent(intent);
        finalized += 1;
      }
    } catch (e) {
      console.error("[syncAllPendingPaymentsForUser]", p.id, e);
    }
  }

  const paidMissingEnrollment = await prisma.payment.findMany({
    where: { userId, status: "PAID", enrollmentId: null },
  });
  let repaired = 0;
  for (const p of paidMissingEnrollment) {
    try {
      const intent = await stripe.paymentIntents.retrieve(p.stripePaymentIntentId);
      await finalizeSuccessfulPaymentIntent(intent);
      repaired += 1;
    } catch (e) {
      console.error("[syncAllPendingPaymentsForUser] repair", p.id, e);
    }
  }

  return { pendingCount: pending.length, finalized, repairedPaidWithoutEnrollment: repaired };
};

const syncLatestPaymentForCourse = async (userId: string, courseId: string) => {
  const enrolled = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } },
  });
  if (enrolled) {
    return { enrollmentId: enrolled.id, synced: false as const, message: "Already enrolled" };
  }

  const payment = await prisma.payment.findFirst({
    where: { courseId, userId },
    orderBy: { createdAt: "desc" },
  });
  if (!payment) {
    return { enrollmentId: null, synced: false as const, message: "No payment record" };
  }

  const intent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
  if (intent.status !== "succeeded") {
    return { enrollmentId: null, synced: false as const, stripeStatus: intent.status };
  }

  const result = await finalizeSuccessfulPaymentIntent(intent);
  return { enrollmentId: result.enrollmentId, synced: !result.alreadyFinalized, alreadyFinalized: result.alreadyFinalized };
};

// ─── Create PaymentIntent ─────────────────────────────────
const createPaymentIntent = async (userId: string, courseId: string) => {
  // Get course
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  if (course.status !== "PUBLISHED") throw new AppError(status.BAD_REQUEST, "Course is not published.");
  if (course.isFree) throw new AppError(status.BAD_REQUEST, "This course is free — use the free enroll endpoint.");
  if (course.priceApprovalStatus !== "APPROVED") throw new AppError(status.BAD_REQUEST, "Course pricing has not been approved yet.");

  // Prevent duplicate enrollment
  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError(status.CONFLICT, "You are already enrolled in this course.");

  // Calculate split
  const amount = course.price;
  const teacherPct = course.teacherRevenuePercent;
  const teacherEarning = parseFloat(((amount * teacherPct) / 100).toFixed(2));
  const platformEarning = parseFloat((amount - teacherEarning).toFixed(2));

  // Create Stripe PaymentIntent
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // cents
    currency: "usd",
    metadata: { courseId, userId, teacherPct: String(teacherPct) },
    automatic_payment_methods: { enabled: true },
  });

  // Persist Payment record
  const payment = await prisma.payment.create({
    data: {
      courseId,
      userId,
      stripePaymentIntentId: intent.id,
      stripeClientSecret: intent.client_secret!,
      amount,
      status: "PENDING",
      teacherRevenuePercent: teacherPct,
      teacherEarning,
      platformEarning,
    },
  });

  return {
    clientSecret: intent.client_secret!,
    paymentId: payment.id,
    paymentIntentId: intent.id,
    amount,
  };
};

// ─── Stripe Webhook Handler ───────────────────────────────
const handleWebhook = async (rawBody: Buffer, sig: string) => {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    throw new AppError(status.BAD_REQUEST, "Webhook signature verification failed.");
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    try {
      await finalizeSuccessfulPaymentIntent(intent);
    } catch (e) {
      console.error("[stripe webhook] finalizeSuccessfulPaymentIntent:", e);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentFailed(intent);
  }

  return { received: true };
};

const handlePaymentFailed = async (intent: Stripe.PaymentIntent) => {
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: intent.id },
    data: { status: "FAILED", failedAt: new Date() },
  });
};

// ─── Get payment status (for client polling) ─────────────
const getPaymentStatus = async (userId: string, courseId: string) => {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_userId: { courseId, userId } },
  });
  if (enrollment) return { status: "PAID", enrollmentId: enrollment.id };

  const payment = await prisma.payment.findFirst({
    where: { courseId, userId },
    orderBy: { createdAt: "desc" },
  });
  return { status: payment?.status ?? "NONE", paymentId: payment?.id };
};

// ─── Student payment history (course purchases) ───────────
const getMyPaymentHistory = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true, thumbnailUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const paid = payments.filter((p) => p.status === "PAID");
  const summary = {
    totalPaidUsd: paid.reduce((s, p) => s + p.amount, 0),
    totalAttempts: payments.length,
    paidCount: paid.length,
    pendingCount: payments.filter((p) => p.status === "PENDING").length,
    failedCount: payments.filter((p) => p.status === "FAILED").length,
    refundedCount: payments.filter((p) => p.status === "REFUNDED").length,
  };

  const rows = payments.map((p) => ({
    id: p.id,
    courseId: p.courseId,
    courseTitle: p.course.title,
    courseThumbnailUrl: p.course.thumbnailUrl,
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    stripePaymentIntentId: p.stripePaymentIntentId,
    paidAt: p.paidAt?.toISOString() ?? null,
    failedAt: p.failedAt?.toISOString() ?? null,
    refundedAt: p.refundedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  return { summary, payments: rows };
};

// ─── Free enrollment ──────────────────────────────────────
const freeEnroll = async (userId: string, courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(status.NOT_FOUND, "Course not found.");
  if (!course.isFree) throw new AppError(status.BAD_REQUEST, "This course is paid — use the payment flow.");
  if (course.status !== "PUBLISHED") throw new AppError(status.BAD_REQUEST, "Course is not published.");

  const existing = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId } } });
  if (existing) throw new AppError(status.CONFLICT, "Already enrolled.");

  return prisma.courseEnrollment.create({
    data: { courseId, userId, paymentStatus: "FREE", amountPaid: 0, teacherEarning: 0, platformEarning: 0 },
  });
};

export const paymentService = {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
  getMyPaymentHistory,
  freeEnroll,
  confirmPaymentFromClient,
  syncLatestPaymentForCourse,
  syncAllPendingPaymentsForUser,
};
