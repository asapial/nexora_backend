import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { prisma } from "../../lib/prisma";

const createTeacher = catchAsync(async (req: Request, res: Response) => {
  const { emails } = req.body;
  
  const result = await adminService.createTeacher(emails);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Teacher creation process completed",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { emails } = req.body;
  
  const result = await adminService.createAdmin(emails);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Admin creation process completed",
    data: result,
  });
});


// ── Courses ─────────────────────────────────────
const getPendingCourses = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const result = await adminService.getPendingCourses(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Pending courses", data: result });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllCourses(req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "All courses", data: result });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getCourseById(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Course detail", data: result });
});

const approveCourse = catchAsync(async (req: Request, res: Response) => {
  const adminUserId = req.user.userId;
  
  const adminProfile= await prisma.adminProfile.findFirstOrThrow({
    where:{
      userId:adminUserId
    }
  })

  const adminId=adminProfile.id;

  
  const result = await adminService.approveCourse(req.params.id as string, adminId);
  sendResponse(res, { status: status.OK, success: true, message: "Course approved", data: result });
});

const rejectCourse = catchAsync(async (req: Request, res: Response) => {
   const adminUserId = req.user.userId;
  
  const adminProfile= await prisma.adminProfile.findFirstOrThrow({
    where:{
      userId:adminUserId
    }
  })

  const adminId=adminProfile.id;
  const result = await adminService.rejectCourse(req.params.id as string, req.body.note, adminId);
  sendResponse(res, { status: status.OK, success: true, message: "Course rejected", data: result });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.deleteCourse(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Course deleted", data: result });
});

const toggleFeatured = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.toggleFeatured(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Featured toggled", data: result });
});

const setRevenuePercent = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.setRevenuePercent(req.params.id as string, req.body.percent);
  sendResponse(res, { status: status.OK, success: true, message: "Revenue percent updated", data: result });
});

// ── Missions ─────────────────────────────────────
const getPendingMissions = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const result = await adminService.getPendingMissions(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Pending missions", data: result });
});

const approveMission = catchAsync(async (req: Request, res: Response) => {
    const adminUserId = req.user.userId;
  
  const adminProfile= await prisma.adminProfile.findFirstOrThrow({
    where:{
      userId:adminUserId
    }
  })

  const adminId=adminProfile.id;

  const result = await adminService.approveMission(req.params.id as string, adminId);
  sendResponse(res, { status: status.OK, success: true, message: "Mission approved", data: result });
});

const rejectMission = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.rejectMission(req.params.id as string, req.body.note);
  sendResponse(res, { status: status.OK, success: true, message: "Mission rejected", data: result });
});

// ── Price Requests ────────────────────────────────
const getPendingPriceRequests = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const result = await adminService.getPendingPriceRequests(+page || 1, +limit || 20);
  sendResponse(res, { status: status.OK, success: true, message: "Pending price requests", data: result });
});

const approvePriceRequest = catchAsync(async (req: Request, res: Response) => {
  
    const adminUserId = req.user.userId;
  
  const adminProfile= await prisma.adminProfile.findFirstOrThrow({
    where:{
      userId:adminUserId
    }
  })

  const adminId=adminProfile.id;

  const result = await adminService.approvePriceRequest(req.params.id as string, req.body.price, adminId);
  sendResponse(res, { status: status.OK, success: true, message: "Price request approved", data: result });
});

const rejectPriceRequest = catchAsync(async (req: Request, res: Response) => {
  
    const adminUserId = req.user.userId;
  
  const adminProfile= await prisma.adminProfile.findFirstOrThrow({
    where:{
      userId:adminUserId
    }
  })

  const adminId=adminProfile.id;

  const result = await adminService.rejectPriceRequest(req.params.id as string, req.body.note, adminId);
  sendResponse(res, { status: status.OK, success: true, message: "Price request rejected", data: result });
});

// ── Enrollments ───────────────────────────────────
const getAllEnrollments = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllEnrollments(req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "All enrollments", data: result });
});

// ── Revenue ───────────────────────────────────────
const getRevenueSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getRevenueSummary();
  sendResponse(res, { status: status.OK, success: true, message: "Revenue summary", data: result });
});

const getRevenueTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getRevenueTransactions(req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "Revenue transactions", data: result });
});


export const adminController = {
  createTeacher,createAdmin,  getPendingCourses, getAllCourses, getCourseById, approveCourse, rejectCourse,
  deleteCourse, toggleFeatured, setRevenuePercent,
  getPendingMissions, approveMission, rejectMission,
  getPendingPriceRequests, approvePriceRequest, rejectPriceRequest,
  getAllEnrollments, getRevenueSummary, getRevenueTransactions
};