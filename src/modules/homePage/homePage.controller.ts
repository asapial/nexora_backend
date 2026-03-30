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
    message: "Featured course featched successfully",
    data: result,
  });
});




export const homePageController={
    getFeaturedCourse
}