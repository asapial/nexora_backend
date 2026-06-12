import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { homePageService } from "./homePage.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getFeaturedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageService.getFeaturedCourse();

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Featured course fetched successfully",
    data: result,
  });
});

const getAllTeachersForHeroSelection = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageService.getAllTeachersForHeroSelection();

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Teachers fetched successfully",
    data: result,
  });
});

const getFeaturedTeachers = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageService.getFeaturedTeachers();

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Featured teachers fetched successfully",
    data: result,
  });
});

const upsertHeroSectionTeacher = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageService.upsertHeroSectionTeacher(req.body);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Hero section teacher updated successfully",
    data: result,
  });
});

const removeHeroSectionTeacher = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await homePageService.removeHeroSectionTeacher(userId as string);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Teacher removed from hero section",
    data: result,
  });
});

export const homePageController = {
  getFeaturedCourse,
  getAllTeachersForHeroSelection,
  getFeaturedTeachers,
  upsertHeroSectionTeacher,
  removeHeroSectionTeacher,
};
