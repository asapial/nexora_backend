import { Router } from "express";
import { teacherTaskController } from "./teacherTask.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { taskAssignmentSchema, taskReviewSchema, taskUpdateSchema } from "../../../validation/requestSchemas";

const router = Router();

// Sessions & members
router.get("/sessions", checkAuth(Role.TEACHER), teacherTaskController.getSessionsWithTasks);
router.get("/sessions/:sessionId/members", checkAuth(Role.TEACHER), teacherTaskController.getSessionMembers);
router.get("/clusters/:clusterId/members-progress", checkAuth(Role.TEACHER), teacherTaskController.getClusterMembersProgress);
router.get("/clusters/:clusterId/members", checkAuth(Role.TEACHER), teacherTaskController.getClusterMembers);
router.get("/homework", checkAuth(Role.TEACHER), teacherTaskController.getHomeworkManagement);

// Assign task
router.post("/sessions/:sessionId/assign", checkAuth(Role.TEACHER), validateRequest(taskAssignmentSchema), teacherTaskController.assignTask);
router.post("/sessions/:sessionId/members/:studentProfileId/assign", checkAuth(Role.TEACHER), validateRequest(taskAssignmentSchema), teacherTaskController.assignTaskToMember);

// Task CRUD
router.patch("/tasks/:taskId", checkAuth(Role.TEACHER), validateRequest(taskUpdateSchema), teacherTaskController.updateTask);
router.delete("/tasks/:taskId", checkAuth(Role.TEACHER), teacherTaskController.deleteTask);

// Submission
router.get("/tasks/:taskId/submission", checkAuth(Role.TEACHER), teacherTaskController.getSubmissionDetail);
router.patch("/tasks/:taskId/review", checkAuth(Role.TEACHER), validateRequest(taskReviewSchema), teacherTaskController.reviewSubmission);

export const teacherTaskRouter = router;
