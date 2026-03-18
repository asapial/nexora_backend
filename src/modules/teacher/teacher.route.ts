import { Router } from "express";
import { teacherController } from "./teacher.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { updateTeacherProfileSchema } from "./teacher.type";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Retrieve logged-in teacher's profile
router.get(
  "/",
  checkAuth(Role.TEACHER),
  teacherController.getTeacherProfile
);

// Update logged-in teacher's profile
router.patch(
  "/",
  checkAuth(Role.TEACHER),
  validateRequest(updateTeacherProfileSchema),
  teacherController.updateTeacherProfile
);

// Soft delete logged-in teacher's profile
router.delete(
  "/",
  checkAuth(Role.TEACHER),
  teacherController.deleteTeacherProfile
);

export const teacherRouter = router;