import { Router } from "express";
import { studyPlannerController } from "./studyPlanner.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/", checkAuth(Role.STUDENT), studyPlannerController.getGoals);
router.get("/streak", checkAuth(Role.STUDENT), studyPlannerController.getStreak);
router.post("/", checkAuth(Role.STUDENT), studyPlannerController.createGoal);
router.patch("/:id", checkAuth(Role.STUDENT), studyPlannerController.updateGoal);
router.delete("/:id", checkAuth(Role.STUDENT), studyPlannerController.deleteGoal);

export const studyPlannerRouter = router;
