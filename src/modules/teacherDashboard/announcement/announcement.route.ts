import { Router } from "express";
import { announcementController } from "./announcement.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { teacherAnnouncementSchema } from "../../../validation/requestSchemas";

const router = Router();
router.get("/clusters", checkAuth(Role.TEACHER), announcementController.getMyClusters);
router.get("/", checkAuth(Role.TEACHER), announcementController.getMyAnnouncements);
router.post("/", checkAuth(Role.TEACHER), validateRequest(teacherAnnouncementSchema), announcementController.createAnnouncement);
router.delete("/:id", checkAuth(Role.TEACHER), announcementController.deleteAnnouncement);

export const teacherAnnouncementRouter = router;
