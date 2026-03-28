import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { settingsController } from "./settings.controller";
import { updateAccountSettingsSchema } from "./settings.validation";

const router = Router();

router.get("/account", checkAuth(), settingsController.getAccount);
router.patch(
  "/account",
  checkAuth(),
  validateRequest(updateAccountSettingsSchema),
  settingsController.updateAccount
);

export const settingsRouter = router;
