import { Router } from "express";
import { resourceController } from "./resource.controller";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Upload — auth optional (allow both teacher and student)
router.post(
  "/",
  checkAuth(Role.STUDENT, Role.TEACHER),
  multerUpload.single("file"),
  resourceController.uploadResource
);

// Browse with filters + bookmark metadata (auth optional)
router.get("/browse", resourceController.browseResources);

// My resources (logged-in user's uploads)
router.get("/my", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.myResources);

// All resources (admin / raw)
router.get("/", resourceController.allResources);

// Categories
router.get("/categories", resourceController.getCategories);

// Bookmarks
router.post("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.bookmarkResource);
router.delete("/:resourceId/bookmark", checkAuth(Role.STUDENT, Role.TEACHER), resourceController.removeBookmark);

export const resourceRouter = router;