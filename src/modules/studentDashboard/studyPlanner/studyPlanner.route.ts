import { Router } from "express";
import { studyPlannerController } from "./studyPlanner.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { goalCreateSchema, goalUpdateSchema } from "../../../validation/requestSchemas";

const router = Router();
router.get("/", checkAuth(Role.STUDENT), studyPlannerController.getGoals);
router.get("/streak", checkAuth(Role.STUDENT), studyPlannerController.getStreak);
router.post("/", checkAuth(Role.STUDENT), validateRequest(goalCreateSchema), studyPlannerController.createGoal);
router.patch("/:id", checkAuth(Role.STUDENT), validateRequest(goalUpdateSchema), studyPlannerController.updateGoal);
router.delete("/:id", checkAuth(Role.STUDENT), studyPlannerController.deleteGoal);

export const studyPlannerRouter = router;
