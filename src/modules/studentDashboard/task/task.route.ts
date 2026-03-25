import { Router } from "express";
import { taskController } from "./task.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { multerUpload } from "../../../config/multer.config";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.STUDENT), taskController.getMyTasks);
router.post(
  "/:taskId/submit",
  checkAuth(Role.STUDENT),
  multerUpload.single("file"),
  taskController.submitTask
);
router.patch(
  "/:taskId/submit",
  checkAuth(Role.STUDENT),
  multerUpload.single("file"),
  taskController.editSubmission
);

export const studentTaskRouter = router;
