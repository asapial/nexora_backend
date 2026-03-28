import { Router } from "express";
import { homeworkController } from "./homework.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), homeworkController.getHomework);
router.patch("/:taskId/done", checkAuth(Role.STUDENT), homeworkController.markHomeworkDone);

export const homeworkRouter = router;
