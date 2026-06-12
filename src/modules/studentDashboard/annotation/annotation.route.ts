import { Router } from "express";
import { annotationController } from "./annotation.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middleware/validateRequest";
import { annotationCreateSchema, annotationUpdateSchema } from "../../../validation/requestSchemas";

const router = Router();
router.get("/resources", checkAuth(Role.STUDENT), annotationController.getResources);
router.get("/", checkAuth(Role.STUDENT), annotationController.getAnnotations);
router.get("/shared", checkAuth(Role.STUDENT), annotationController.getSharedAnnotations);
router.post("/", checkAuth(Role.STUDENT), validateRequest(annotationCreateSchema), annotationController.createAnnotation);
router.patch("/:id", checkAuth(Role.STUDENT), validateRequest(annotationUpdateSchema), annotationController.updateAnnotation);
router.delete("/:id", checkAuth(Role.STUDENT), annotationController.deleteAnnotation);

export const annotationRouter = router;
