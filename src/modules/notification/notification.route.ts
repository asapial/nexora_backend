import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { notificationController } from "./notification.controller";
import { notificationIdParamsSchema, notificationListQuerySchema } from "./notification.validation";

const router = Router();

router.get("/", checkAuth(), validateRequest(notificationListQuerySchema, "query"), notificationController.list);
router.patch("/:id/read", checkAuth(), validateRequest(notificationIdParamsSchema, "params"), notificationController.markRead);

export const notificationRouter = router;
