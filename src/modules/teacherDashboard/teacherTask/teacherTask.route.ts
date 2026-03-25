import { Router } from "express";
import { teacherTaskController } from "./teacherTask.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/sessions", checkAuth(Role.TEACHER), teacherTaskController.getSessionsWithTasks);
router.get("/homework", checkAuth(Role.TEACHER), teacherTaskController.getHomeworkManagement);
router.post("/sessions/:sessionId/assign", checkAuth(Role.TEACHER), teacherTaskController.assignTask);
router.patch("/tasks/:taskId/review", checkAuth(Role.TEACHER), teacherTaskController.reviewSubmission);

export const teacherTaskRouter = router;
