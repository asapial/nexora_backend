import { Router } from "express";
import { taskController } from "./task.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { taskSubmissionSchema } from "../../../validation/requestSchemas";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), taskController.getMyTasks);
router.get("/:taskId", checkAuth(Role.STUDENT), taskController.getTaskById);
router.post("/:taskId/submit", checkAuth(Role.STUDENT), validateRequest(taskSubmissionSchema), taskController.submitTask);
router.patch("/:taskId/submit", checkAuth(Role.STUDENT), validateRequest(taskSubmissionSchema), taskController.editSubmission);

export const studentTaskRouter = router;
