
import { status } from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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
  const teacherEarning = parseFloat((amount * teacherPct / 100).toFixed(2));
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
    await handlePaymentSuccess(intent);
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await handlePaymentFailed(intent);
  }

  return { received: true };
};

const handlePaymentSuccess = async (intent: Stripe.PaymentIntent) => {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: intent.id },
  });
  if (!payment || payment.status === "PAID") return;

  await prisma.$transaction(async (tx) => {
    // Update payment
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: new Date() },
    });

    // Create enrollment
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

    // Link payment to enrollment
    await tx.payment.update({
      where: { id: payment.id },
      data: { enrollmentId: enrollment.id },
    });

    // Create revenue transaction
    await tx.revenueTransaction.create({
      data: {
        enrollmentId: enrollment.id,
        courseId: payment.courseId,
        teacherId: (await tx.course.findUnique({ where: { id: payment.courseId }, select: { teacherId: true } }))!.teacherId,
        studentId: payment.userId,
        totalAmount: payment.amount,
        teacherPercent: payment.teacherRevenuePercent,
        teacherEarning: payment.teacherEarning,
        platformEarning: payment.platformEarning,
      },
    });
  });
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
  freeEnroll,
};