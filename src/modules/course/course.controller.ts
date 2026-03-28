import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { courseService } from "./course.service";

const getPublicCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await courseService.getPublicCourses(req.query as any);
 
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: result,
  });
});
 
const getPublicCourseById = catchAsync(async (req: Request, res: Response) => {
  const result = await courseService.getPublicCourseById(req.params.id);
 
  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});
 

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.createCourse(userId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Course created successfully", data: result });
});

const getMyCourses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.getMyCourses(userId);
  sendResponse(res, { status: status.OK, success: true, message: "Courses retrieved", data: result });
});

const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.getCourseById(userId, req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Course retrieved", data: result });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.updateCourse(userId, req.params.id as string, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Course updated", data: result });
});

const submitCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.submitCourse(userId, req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Course submitted for approval", data: result });
});

const closeCourse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.closeCourse(userId, req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Course closed", data: result });
});

// ─────────────────────────────────────────────────────────
// ENROLLMENTS
// ─────────────────────────────────────────────────────────

const getEnrollments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.getEnrollments(userId, req.params.id as string, req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "Enrollments retrieved", data: result });
});

const getEnrollmentStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.getEnrollmentStats(userId, req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Enrollment stats retrieved", data: result });
});


// ─────────────────────────────────────────────────────────
// PRICE REQUESTS
// ─────────────────────────────────────────────────────────

const createPriceRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.createPriceRequest(userId, req.params.id as string, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Price request submitted", data: result });
});

const getPriceRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.getPriceRequests(userId, req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Price requests retrieved", data: result });
});

// ─────────────────────────────────────────────────────────
// MISSIONS
// ─────────────────────────────────────────────────────────

const getMissions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.getMissions(userId, req.params.courseId as string);
  sendResponse(res, { status: status.OK, success: true, message: "Missions retrieved", data: result });
});

const createMission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.createMission(userId, req.params.courseId as string, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Mission created", data: result });
});

const updateMission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.updateMission(userId, req.params.courseId as string, req.params.missionId as string, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Mission updated", data: result });
});

const deleteMission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.deleteMission(userId, req.params.courseId as string, req.params.missionId as string);
  sendResponse(res, { status: status.OK, success: true, message: "Mission deleted", data: result });
});

const submitMission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await courseService.submitMission(userId, req.params.courseId  as string, req.params.missionId as string);
  sendResponse(res, { status: status.OK, success: true, message: "Mission submitted for approval", data: result });
});



export const courseController={
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
    getMissions,
    createMission,
    updateMission,
    deleteMission,
    submitMission

    
}