import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { homePageService } from "./homePage.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getContentSections = catchAsync(async (_req: Request, res: Response) => {
  const result = await homePageService.getContentSections();

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Site content fetched successfully",
    data: result,
  });
});

const getContentSection = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageService.getContentSection(req.params.key as string);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Site content section fetched successfully",
    data: result,
  });
});

const upsertContentSection = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageService.upsertContentSection(
    req.params.key as string,
    req.body,
  );

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Site content section saved successfully",
    data: result,
  });
});

const deleteContentSection = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageService.deleteContentSection(req.params.key as string);

  sendResponse(res, {
    status: status.OK,
    success: true,
    message: "Site content section reset successfully",
    data: result,
  });
});

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
  getContentSections,
  getContentSection,
  upsertContentSection,
  deleteContentSection,
  getFeaturedCourse,
  getAllTeachersForHeroSelection,
  getFeaturedTeachers,
  upsertHeroSectionTeacher,
  removeHeroSectionTeacher,
};
