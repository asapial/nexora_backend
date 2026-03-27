import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";


const createIntent = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { courseId } = req.body;
  if (!courseId) return sendResponse(res, { status: status.BAD_REQUEST, success: false, message: "courseId required", data: null });
  const result = await paymentService.createPaymentIntent(userId, courseId);
  sendResponse(res, { status: status.CREATED, success: true, message: "PaymentIntent created", data: result });
});

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const result = await paymentService.handleWebhook(req.body as Buffer, sig);
  res.json(result);
});

const getStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { courseId } = req.params;
  const result = await paymentService.getPaymentStatus(userId, courseId as string);
  sendResponse(res, { status: status.OK, success: true, message: "Payment status", data: result });
});

const freeEnroll = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { courseId } = req.params;
  const result = await paymentService.freeEnroll(userId, courseId as string);
  sendResponse(res, { status: status.CREATED, success: true, message: "Enrolled successfully", data: result });
});

export const paymentController = { createIntent, stripeWebhook, getStatus, freeEnroll };
