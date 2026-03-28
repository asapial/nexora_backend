import { Router } from "express";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { studentMissionController } from "./studentMission.controller";

const router = Router();

router.get(
  "/:missionId/contents",
  checkAuth(Role.STUDENT),
  studentMissionController.getContents
);

export const studentMissionRouter = router;
