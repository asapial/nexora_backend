import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../../utils/sendResponse";
import status from "http-status";

const getCategories = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await categoryService.getCategories(req.user?.userId);
  sendResponse(res, { status: status.OK, success: true, message: "Categories fetched", data: result });
});

const createCategory = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const result = await categoryService.createCategory(req.user.userId, req.body);
  sendResponse(res, { status: status.CREATED, success: true, message: "Category created", data: result });
});

const updateCategory = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { id } = req.params as { id: string };
  const result = await categoryService.updateCategory(req.user.userId, id, req.body);
  sendResponse(res, { status: status.OK, success: true, message: "Category updated", data: result });
});

const deleteCategory = catchAsync(async (req: Request, res: Response, _n: NextFunction) => {
  const { id } = req.params as { id: string };
  const result = await categoryService.deleteCategory(req.user.userId, id);
  sendResponse(res, { status: status.OK, success: true, message: "Category deleted", data: result });
});

export const categoryController = { getCategories, createCategory, updateCategory, deleteCategory };
