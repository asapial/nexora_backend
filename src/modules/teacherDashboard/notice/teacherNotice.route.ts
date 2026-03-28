import { Router } from "express";
import { teacherNoticeController } from "./teacherNotice.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.TEACHER), teacherNoticeController.getNotices);
router.patch("/:id/read", checkAuth(Role.TEACHER), teacherNoticeController.markAsRead);

export const teacherNoticeRouter = router;
