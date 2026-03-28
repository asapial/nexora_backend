import { Router } from "express";
import { studentController } from "./student.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { updateStudentProfileSchema } from "./student.type";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Retrieve logged-in student's profile
router.get(
  "/",
  checkAuth(Role.STUDENT),
  studentController.getStudentProfile
);

// Update logged-in student's profile
router.patch(
  "/",
  checkAuth(Role.STUDENT),
  validateRequest(updateStudentProfileSchema),
  studentController.updateStudentProfile
);

// Soft delete logged-in student's profile
router.delete(
  "/",
  checkAuth(Role.STUDENT),
  studentController.deleteStudentProfile
);

export const studentRouter = router;
