import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createCourseSchema, createMissionSchema, createPriceRequestSchema, enrollmentQuerySchema, updateCourseSchema, updateMissionSchema } from "./course.validation";
import { courseController } from "./course.controller";

const router = Router();

// GET /api/courses/public — public catalog (no auth required)
router.get("/public", courseController.getPublicCourses);

// GET /api/courses/:id/public — public course detail (no auth required)
router.get("/:id/public", courseController.getPublicCourseById);


 
// GET    /api/teacher/courses           → list teacher's own courses
router.get(
  "/",
  checkAuth(Role.TEACHER),
  courseController.getMyCourses
);

// POST   /api/teacher/courses           → create a new course (DRAFT)
router.post(
  "/",
  checkAuth(Role.TEACHER),
  validateRequest(createCourseSchema),
  courseController.createCourse
);

// GET    /api/teacher/courses/:id       → get course detail
router.get(
  "/:id",
  checkAuth(Role.TEACHER),
  courseController.getCourseById
);

// PATCH  /api/teacher/courses/:id       → update course (DRAFT / REJECTED only)
router.patch(
  "/:id",
  checkAuth(Role.TEACHER),
  validateRequest(updateCourseSchema),
  courseController.updateCourse
);

// POST   /api/teacher/courses/:id/submit → submit for approval
router.post(
  "/:id/submit",
  checkAuth(Role.TEACHER),
  courseController.submitCourse
);

// POST   /api/teacher/courses/:id/close  → close published course
router.post(
  "/:id/close",
  checkAuth(Role.TEACHER),
  courseController.closeCourse
);

// ─────────────────────────────────────────────────────────
// TEACHER — ENROLLMENTS
// ─────────────────────────────────────────────────────────

// GET  /api/teacher/courses/:id/enrollments        → paginated enrollment list
router.get(
  "/:id/enrollments",
  checkAuth(Role.TEACHER),
  courseController.getEnrollments
);

// GET  /api/teacher/courses/:id/enrollments/stats  → aggregate stats
router.get(
  "/:id/enrollments/stats",
  checkAuth(Role.TEACHER),
  courseController.getEnrollmentStats
);

// ─────────────────────────────────────────────────────────
// TEACHER — PRICE REQUESTS
// ─────────────────────────────────────────────────────────

// POST  /api/teacher/courses/:id/price-request     → submit price request
router.post(
  "/:id/price-request",
  checkAuth(Role.TEACHER),
  validateRequest(createPriceRequestSchema),
  courseController.createPriceRequest
);

// GET   /api/teacher/courses/:id/price-requests    → list price requests for course
router.get(
  "/:id/price-requests",
  checkAuth(Role.TEACHER),
  courseController.getPriceRequests
);

// ─────────────────────────────────────────────────────────
// TEACHER — MISSIONS
// ─────────────────────────────────────────────────────────

// GET    /api/teacher/courses/:courseId/missions
router.get(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  courseController.getMissions
);

// POST   /api/teacher/courses/:courseId/missions
router.post(
  "/:courseId/missions",
  checkAuth(Role.TEACHER),
  validateRequest(createMissionSchema),
  courseController.createMission
);

// PATCH  /api/teacher/courses/:courseId/missions/:missionId
router.patch(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  validateRequest(updateMissionSchema),
  courseController.updateMission
);

// DELETE /api/teacher/courses/:courseId/missions/:missionId
router.delete(
  "/:courseId/missions/:missionId",
  checkAuth(Role.TEACHER),
  courseController.deleteMission
);

// POST   /api/teacher/courses/:courseId/missions/:missionId/submit
router.post(
  "/:courseId/missions/:missionId/submit",
  checkAuth(Role.TEACHER),
  courseController.submitMission
);


export const courseRouter=router;