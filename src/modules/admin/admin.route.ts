import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createTeacherSchema } from "./admin.type";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Create teachers by array of emails
router.post(
  "/createTeacher",
  checkAuth(Role.ADMIN), // Assuming only ADMIN can create teachers
//   validateRequest(createTeacherSchema),
  adminController.createTeacher
);

export const adminRouter = router;