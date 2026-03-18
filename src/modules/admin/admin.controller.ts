import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

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

export const adminController = {
  createTeacher,
};