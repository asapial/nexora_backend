import { Router } from "express";
import { teacherTaskController } from "./teacherTask.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Sessions & members
router.get("/sessions", checkAuth(Role.TEACHER), teacherTaskController.getSessionsWithTasks);
router.get("/sessions/:sessionId/members", checkAuth(Role.TEACHER), teacherTaskController.getSessionMembers);
router.get("/clusters/:clusterId/members-progress", checkAuth(Role.TEACHER), teacherTaskController.getClusterMembersProgress);
router.get("/homework", checkAuth(Role.TEACHER), teacherTaskController.getHomeworkManagement);

// Assign task
router.post("/sessions/:sessionId/assign", checkAuth(Role.TEACHER), teacherTaskController.assignTask);
router.post("/sessions/:sessionId/members/:studentProfileId/assign", checkAuth(Role.TEACHER), teacherTaskController.assignTaskToMember);

// Task CRUD
router.patch("/tasks/:taskId", checkAuth(Role.TEACHER), teacherTaskController.updateTask);
router.delete("/tasks/:taskId", checkAuth(Role.TEACHER), teacherTaskController.deleteTask);

// Submission
router.get("/tasks/:taskId/submission", checkAuth(Role.TEACHER), teacherTaskController.getSubmissionDetail);
router.patch("/tasks/:taskId/review", checkAuth(Role.TEACHER), teacherTaskController.reviewSubmission);

export const teacherTaskRouter = router;
