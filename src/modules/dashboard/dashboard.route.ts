import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { dashboardController } from "./dashboard.controller";

const router = Router();

// GET /api/dashboard/stats — role-based dashboard stats
router.get(
  "/stats",
  checkAuth(Role.TEACHER, Role.STUDENT, Role.ADMIN),
  dashboardController.getDashboardStats
);

export const dashboardRouter = router;
