import { Router } from "express";
import { noticeController } from "./notice.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), noticeController.getNotices);
router.patch("/:id/read", checkAuth(Role.STUDENT), noticeController.markAsRead);

export const noticeRouter = router;
