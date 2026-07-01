import { Router } from "express";
import { annotationController } from "./annotation.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { annotationCreateSchema, annotationUpdateSchema } from "../../../validation/requestSchemas";

const router = Router();
router.get("/resources", checkAuth(Role.STUDENT, Role.TEACHER), annotationController.getResources);
router.get("/", checkAuth(Role.STUDENT, Role.TEACHER), annotationController.getAnnotations);
router.get("/shared", checkAuth(Role.STUDENT, Role.TEACHER), annotationController.getSharedAnnotations);
router.post("/", checkAuth(Role.STUDENT, Role.TEACHER), validateRequest(annotationCreateSchema), annotationController.createAnnotation);
router.patch("/:id", checkAuth(Role.STUDENT, Role.TEACHER), validateRequest(annotationUpdateSchema), annotationController.updateAnnotation);
router.delete("/:id", checkAuth(Role.STUDENT, Role.TEACHER), annotationController.deleteAnnotation);

export const annotationRouter = router;
