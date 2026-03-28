import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";
import { studentCourseEnrollmentService } from "./courseEnrollment.service";

const listEnrollments = catchAsync(
  async (req: Request, res: Response, _n: NextFunction) => {
    const userId = req.user!.userId;
    const data = await studentCourseEnrollmentService.listMyEnrollments(userId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Enrollments retrieved",
      data,
    });
  }
);

const getEnrollment = catchAsync(
  async (req: Request, res: Response, _n: NextFunction) => {
    const userId = req.user!.userId;
    const { courseId } = req.params as { courseId: string };
    const data = await studentCourseEnrollmentService.getEnrollmentForCourse(userId, courseId);
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Enrollment retrieved",
      data,
    });
  }
);

const completeMission = catchAsync(
  async (req: Request, res: Response, _n: NextFunction) => {
    const userId = req.user!.userId;
    const { courseId, missionId } = req.params as { courseId: string; missionId: string };
    const data = await studentCourseEnrollmentService.completeMissionForStudent(
      userId,
      courseId,
      missionId
    );
    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Mission marked complete",
      data,
    });
  }
);

export const studentCourseEnrollmentController = {
  listEnrollments,
  getEnrollment,
  completeMission,
};
