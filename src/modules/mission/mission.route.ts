import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { missionController } from "./mission.controller";
import { createContentSchema, reorderContentsSchema } from "./mission.validation";

const router=Router();


// GET    /api/teacher/missions/:missionId/contents
router.get(
  "/:missionId/contents",
  checkAuth(Role.TEACHER),
  missionController.getContents
);

// POST   /api/teacher/missions/:missionId/contents
router.post(
  "/:missionId/contents",
  checkAuth(Role.TEACHER),
  validateRequest(createContentSchema),
  missionController.createContent
);

// PATCH  /api/teacher/missions/:missionId/contents/:contentId
router.patch(
  "/:missionId/contents/:contentId",
  checkAuth(Role.TEACHER),
  missionController.updateContent
);

// DELETE /api/teacher/missions/:missionId/contents/:contentId
router.delete(
  "/:missionId/contents/:contentId",
  checkAuth(Role.TEACHER),
  missionController.deleteContent
);

// PATCH  /api/teacher/missions/:missionId/contents/reorder
router.patch(
  "/:missionId/contents/reorder",
  checkAuth(Role.TEACHER),
  validateRequest(reorderContentsSchema),
  missionController.reorderContents
);


export const missionRouter=router;