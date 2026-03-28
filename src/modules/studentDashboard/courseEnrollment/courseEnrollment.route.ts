import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { studentCourseEnrollmentController } from "./courseEnrollment.controller";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), studentCourseEnrollmentController.listEnrollments);
router.get(
  "/:courseId",
  checkAuth(Role.STUDENT),
  studentCourseEnrollmentController.getEnrollment
);
router.post(
  "/:courseId/missions/:missionId/complete",
  checkAuth(Role.STUDENT),
  studentCourseEnrollmentController.completeMission
);

export const studentCourseEnrollmentRouter = router;
