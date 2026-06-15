import { Router } from "express";
import { studyPlannerController } from "./studyPlanner.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { goalCreateSchema, goalFocusSchema, goalUpdateSchema } from "../../../validation/requestSchemas";

const router = Router();
router.get("/", checkAuth(Role.STUDENT), studyPlannerController.getGoals);
router.get("/streak", checkAuth(Role.STUDENT), studyPlannerController.getStreak);
router.get("/summary", checkAuth(Role.STUDENT), studyPlannerController.getSummary);
router.post("/", checkAuth(Role.STUDENT), validateRequest(goalCreateSchema), studyPlannerController.createGoal);
router.post("/:id/focus", checkAuth(Role.STUDENT), validateRequest(goalFocusSchema), studyPlannerController.logFocus);
router.patch("/:id", checkAuth(Role.STUDENT), validateRequest(goalUpdateSchema), studyPlannerController.updateGoal);
router.delete("/:id", checkAuth(Role.STUDENT), studyPlannerController.deleteGoal);

export const studyPlannerRouter = router;
