import { Router } from "express";
import { testimonialController } from "./testimonial.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { testimonialCreateSchema } from "../../validation/requestSchemas";

const router = Router();

// Public — get latest 6 approved
router.get("/", testimonialController.getApproved);

// Authenticated user — submit testimonial
router.post("/", checkAuth(Role.STUDENT, Role.TEACHER, Role.ADMIN), validateRequest(testimonialCreateSchema), testimonialController.create);

// Admin routes
router.get("/admin/pending", checkAuth(Role.ADMIN), testimonialController.getPending);
router.get("/admin/approved", checkAuth(Role.ADMIN), testimonialController.getAllApproved);
router.post("/admin/:id/approve", checkAuth(Role.ADMIN), testimonialController.approve);
router.delete("/admin/:id", checkAuth(Role.ADMIN), testimonialController.remove);

export const testimonialRouter = router;
