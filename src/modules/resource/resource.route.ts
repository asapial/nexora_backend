import { Router } from "express";
import multer from "multer";
import { Role } from "../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { resourceController } from "./resource.controller";

const router = Router();

const pdfMetadataUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 },
});

router.post(
  "/suggest-metadata",
  checkAuth(Role.STUDENT, Role.TEACHER),
  pdfMetadataUpload.single("file"),
  resourceController.suggestMetadata
);

router.post(
  "/",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerUpload.single("file"),
  resourceController.uploadResource
);

router.get("/browse", resourceController.browseResources);
router.get("/my", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.myResources);
router.get("/", resourceController.allResources);
router.get("/categories", resourceController.getCategories);

router.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);

export const resourceRouter = router;
