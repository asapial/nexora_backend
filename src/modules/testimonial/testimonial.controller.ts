import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { testimonialService } from "./testimonial.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

// Public — GET approved testimonials (latest 6)
const getApproved = catchAsync(async (_req: Request, res: Response) => {
  const data = await testimonialService.getApproved();
  sendResponse(res, { status: status.OK, success: true, message: "Approved testimonials", data });
});

// Authenticated user — POST submit testimonial
const create = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { name, role, quote, rating } = req.body;
  const data = await testimonialService.create(userId, { name, role, quote, rating });
  sendResponse(res, { status: status.CREATED, success: true, message: "Testimonial submitted", data });
});

// Admin — GET pending testimonials
const getPending = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const data = await testimonialService.getPending(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Pending testimonials", data });
});

// Admin — GET all approved testimonials
const getAllApproved = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const data = await testimonialService.getAllApproved(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Approved testimonials (admin)", data });
});

// Admin — POST approve testimonial
const approve = catchAsync(async (req: Request, res: Response) => {
  const data = await testimonialService.approve(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Testimonial approved", data });
});

// Admin — DELETE testimonial
const remove = catchAsync(async (req: Request, res: Response) => {
  const data = await testimonialService.remove(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Testimonial deleted", data });
});

export const testimonialController = {
  getApproved,
  create,
  getPending,
  getAllApproved,
  approve,
  remove,
};
