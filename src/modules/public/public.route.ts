import { Router } from "express";
import { courseController } from "./course.controller";

const router = Router();

// GET /api/public/courses — public catalog (no auth required)
router.get("/courses", courseController.getPublicCourses);

// GET /api/public/courses/:id — public course detail (no auth required)
router.get("/courses/:id", courseController.getPublicCourseById);

export const publicRouter = router;
