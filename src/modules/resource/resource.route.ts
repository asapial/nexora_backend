import { Router } from "express";
import multer from "multer";
import { Role } from "../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { checkAuth, optionalAuth } from "../../middleware/checkAuth";
import { resourceAiController } from "./resourceAi.controller";
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
  "/upload-signature",
  checkAuth(Role.STUDENT, Role.TEACHER),
  resourceController.createUploadSignature
);

router.post(
  "/",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerUpload.single("file"),
  resourceController.uploadResource
);

router.get("/browse", optionalAuth, resourceController.browseResources);
router.get("/teacher-library", checkAuth(Role.TEACHER), resourceController.teacherLibraryResources);
router.get("/my", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.myResources);
router.get("/categories", resourceController.getCategories);
router.get("/cloudinary-sign", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.cloudinarySign);
router.get("/", resourceController.allResources);

router.get("/:resourceId/processing-status", checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT), resourceAiController.processingStatus);
router.get("/:resourceId/summary", checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT), resourceAiController.summary);
router.get("/:resourceId/citations", checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT), resourceAiController.citations);
router.get("/:resourceId/graph", checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT), resourceAiController.graph);
router.post(
  "/:resourceId/process-ai",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT),
  resourceAiController.processAi
);
router.post(
  "/:resourceId/summary/regenerate",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT),
  resourceAiController.regenerateSummary
);
router.patch(
  "/:resourceId/summary/visibility",
  checkAuth(Role.ADMIN, Role.TEACHER),
  resourceAiController.updateSummaryVisibility
);
router.post(
  "/:resourceId/citations/reanalyze",
  checkAuth(Role.ADMIN, Role.TEACHER, Role.STUDENT),
  resourceAiController.reanalyzeCitations
);

router.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);
router.patch("/:resourceId", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.updateResource);
router.delete("/:resourceId", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.deleteResource);

export const resourceRouter = router;
