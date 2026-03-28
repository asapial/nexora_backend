import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { paymentController } from "./payment.controller";
import express from "express";


const router = Router();

// POST /api/payments/create-intent  — authenticated student
router.post(
  "/create-intent",
  checkAuth(),
  paymentController.createIntent
);

// POST /api/payments/confirm — finalize enrollment after client-side payment success
router.post(
  "/confirm",
  checkAuth(),
  paymentController.confirmPayment
);

// POST /api/payments/sync/:courseId — recover enrollment when Stripe succeeded but webhook missed
router.post(
  "/sync/:courseId",
  checkAuth(),
  paymentController.syncCoursePayment
);

// POST /api/payments/sync-pending — finalize all pending payments that are already paid in Stripe
router.post(
  "/sync-pending",
  checkAuth(),
  paymentController.syncPendingPayments
);

// GET /api/payments/status/:courseId — check enrollment/payment status
router.get(
  "/status/:courseId",
  checkAuth(Role.STUDENT),
  paymentController.getStatus
);

// POST /api/courses/:courseId/enroll — free enrollment
router.post(
  "/enroll/:courseId",
  checkAuth(Role.STUDENT),
  paymentController.freeEnroll
);

// POST /api/payments/webhook — Stripe webhook (raw body, no auth)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

export const paymentRouter=router;