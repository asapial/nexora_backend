import { Router } from "express";
import { annotationController } from "./annotation.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/resources", checkAuth(Role.STUDENT), annotationController.getResources);
router.get("/", checkAuth(Role.STUDENT), annotationController.getAnnotations);
router.get("/shared", checkAuth(Role.STUDENT), annotationController.getSharedAnnotations);
router.post("/", checkAuth(Role.STUDENT), annotationController.createAnnotation);
router.patch("/:id", checkAuth(Role.STUDENT), annotationController.updateAnnotation);
router.delete("/:id", checkAuth(Role.STUDENT), annotationController.deleteAnnotation);

export const annotationRouter = router;
