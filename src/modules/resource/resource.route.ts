import { Router } from "express";
import { resourceController } from "./resource.controller";
import { multerUpload, multerMemory } from "../../config/multer.config";
import { checkAuth, optionalAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Upload — auth optional (allow both teacher and student)
router.post(
  "/",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerUpload.single("file"),
  resourceController.uploadResource
);

// Suggest AI Metadata from PDF (memory storage — no Cloudinary upload)
router.post(
  "/suggest-metadata",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerMemory.single("file"),
  resourceController.suggestMetadata
);

// Browse with filters + bookmark metadata (authenticated users see cluster resources too)
router.get("/browse", optionalAuth, resourceController.browseResources);

// My resources (logged-in user's uploads)
router.get("/my", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.myResources);

// All resources (admin / raw)
router.get("/", resourceController.allResources);

// Categories
router.get("/categories", resourceController.getCategories);

// Cloudinary signed URL — resolves /image/upload/ PDF 401 issues on unverified accounts
router.get("/cloudinary-sign", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.cloudinarySign);

// Bookmarks
router.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);

// Update resource metadata (uploader only)
router.patch("/:resourceId", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.updateResource);

// Delete resource (uploader only)
router.delete("/:resourceId", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.deleteResource);

export const resourceRouter = router;