import { Router } from "express";
import { categoryController } from "./category.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { categoryCreateSchema, categoryUpdateSchema } from "../../../validation/requestSchemas";

const router = Router();
router.get("/", checkAuth(Role.TEACHER), categoryController.getCategories);
router.post("/", checkAuth(Role.TEACHER), validateRequest(categoryCreateSchema), categoryController.createCategory);
router.patch("/:id", checkAuth(Role.TEACHER), validateRequest(categoryUpdateSchema), categoryController.updateCategory);
router.delete("/:id", checkAuth(Role.TEACHER), categoryController.deleteCategory);

export const categoryRouter = router;
