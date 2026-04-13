import { Router } from "express";
import { teacherApplicationController } from "./teacherApplication.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Authenticated user (any logged-in) — submit application
router.post("/apply", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), teacherApplicationController.apply);

// Authenticated user — check own application
router.get("/my", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), teacherApplicationController.getMyApplication);

// Admin — view all / pending applications
router.get("/admin/all",     checkAuth(Role.ADMIN), teacherApplicationController.getAll);
router.get("/admin/pending", checkAuth(Role.ADMIN), teacherApplicationController.getPending);

// Admin — approve / reject
router.post("/admin/:id/approve", checkAuth(Role.ADMIN), teacherApplicationController.approve);
router.post("/admin/:id/reject",  checkAuth(Role.ADMIN), teacherApplicationController.reject);

export const teacherApplicationRouter = router;
