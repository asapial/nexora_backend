import { Router } from "express";
import { taskController } from "./task.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), taskController.getMyTasks);
router.post("/:taskId/submit", checkAuth(Role.STUDENT), taskController.submitTask);
router.patch("/:taskId/submit", checkAuth(Role.STUDENT), taskController.editSubmission);

export const studentTaskRouter = router;
