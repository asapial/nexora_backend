import { Router } from "express";
import { teacherController } from "./teacher.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { updateTeacherProfileSchema } from "./teacher.type";
import { Role } from "../../generated/prisma/enums";
import { earningsQuerySchema } from "./teacher.validation";

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


// GET  /api/teacher/earnings
router.get(
  "/earnings",
  checkAuth(Role.TEACHER),
  teacherController.getEarningsSummary
);

// GET  /api/teacher/earnings/transactions
router.get(
  "/earnings/transactions",
  checkAuth(Role.TEACHER),
  // validateRequest(earningsQuerySchema, "query"),
  validateRequest(earningsQuerySchema),
  teacherController.getTransactions
);

export const teacherRouter = router;