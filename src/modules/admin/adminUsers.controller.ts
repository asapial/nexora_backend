import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminUsersService } from "./adminUsers.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const data = await adminUsersService.getUsers(req.query as any);
  sendResponse(res, { status: status.OK, success: true, message: "Users", data });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const data = await adminUsersService.getUserById(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "User", data });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const data = await adminUsersService.updateUser(req.params.id as string, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "User updated", data });
});

const deactivateUser = catchAsync(async (req: Request, res: Response) => {
  const data = await adminUsersService.deactivateUser(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "User deactivated", data });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const data = await adminUsersService.resetPassword(req.params.id as string);
  sendResponse(res, { status: status.OK, success: true, message: "Password reset email sent", data });
});

const impersonateUser = catchAsync(async (req: Request, res: Response) => {
  const adminUserId = req.user.userId;
  const data = await adminUsersService.impersonateUser(req.params.id as string, adminUserId);
  sendResponse(res, { status: status.OK, success: true, message: "Impersonation session prepared", data });
});

export const adminUsersController = {
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  resetPassword,
  impersonateUser,
};
