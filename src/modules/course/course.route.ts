import { Router } from "express";
import { Role } from "../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { courseController } from "./course.controller";
import {
  createCourseSchema,
  createMissionSchema,
  createPriceRequestSchema,
  updateCourseSchema,
  updateMissionSchema,
} from "./course.validation";

const router = Router();

router.get("/public", courseController.getPublicCourses);
router.get("/:id/public", courseController.getPublicCourseById);

router.get(
  "/",
  checkAuth(Role.TEACHER),
  courseController.getMyCourses
);

router.post(
  "/",
  checkAuth(Role.TEACHER),
  validateRequest(createCourseSchema),
  courseController.createCourse
);

router.get(
  "/:id",
  checkAuth(Role.TEACHER),
  courseController.getCourseById
);

router.patch(
  "/:id",
  checkAuth(Role.TEACHER),
  validateRequest(updateCourseSchema),
  courseController.updateCourse
);

router.delete(
  "/:id",
  checkAuth(Role.TEACHER),
  courseController.deleteCourse
);

router.post(
  "/:id/submit",
  checkAuth(Role.TEACHER),
  courseController.submitCourse
);

router.post(
  "/:id/close",
  checkAuth(Role.TEACHER),
  courseController.closeCourse
);

router.post(
  "/:id/finish",
  checkAuth(Role.TEACHER),
  courseController.finishCourse
);

router.get(
  "/:id/enrollments",
  checkAuth(Role.TEACHER),
  courseController.getEnrollments
);

router.get(
  "/:id/enrollments/stats",
  checkAuth(Role.TEACHER),
  courseController.getEnrollmentStats
);

router.post(
  "/:id/price-request",
  checkAuth(Role.TEACHER),
  validateRequest(createPriceRequestSchema),
  courseController.createPriceRequest
);

router.get(
  "/:id/price-requests",
  checkAuth(Role.TEACHER),
  courseController.getPriceRequests
);

router.get(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  courseController.getMissions
);

router.post(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  validateRequest(createMissionSchema),
  courseController.createMission
);

router.patch(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  validateRequest(updateMissionSchema),
  courseController.updateMission
);

router.delete(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  courseController.deleteMission
);

router.post(
  "/:courseId/missions/:missionId/submit",
  checkAuth(Role.TEACHER),
  courseController.submitMission
);

export const courseRouter = router;
