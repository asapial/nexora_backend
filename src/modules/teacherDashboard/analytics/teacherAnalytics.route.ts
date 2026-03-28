import { Router } from "express";
import { teacherAnalyticsController } from "./teacherAnalytics.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Analytics
router.get("/analytics", checkAuth(Role.TEACHER), teacherAnalyticsController.getAnalytics);
router.get("/session-history", checkAuth(Role.TEACHER), teacherAnalyticsController.getSessionHistory);

// Task Templates
router.get("/task-templates", checkAuth(Role.TEACHER), teacherAnalyticsController.getTemplates);
router.post("/task-templates", checkAuth(Role.TEACHER), teacherAnalyticsController.createTemplate);
router.patch("/task-templates/:id", checkAuth(Role.TEACHER), teacherAnalyticsController.updateTemplate);
router.delete("/task-templates/:id", checkAuth(Role.TEACHER), teacherAnalyticsController.deleteTemplate);

export const teacherAnalyticsRouter = router;
