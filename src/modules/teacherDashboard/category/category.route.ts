import { Router } from "express";
import { categoryController } from "./category.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/", categoryController.getCategories);
router.post("/", checkAuth(Role.TEACHER), categoryController.createCategory);
router.patch("/:id", checkAuth(Role.TEACHER), categoryController.updateCategory);
router.delete("/:id", checkAuth(Role.TEACHER), categoryController.deleteCategory);

export const categoryRouter = router;
