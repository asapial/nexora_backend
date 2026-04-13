import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { settingsController } from "./settings.controller";
import { updateAccountSettingsSchema } from "./settings.validation";

const router = Router();

// Account settings
router.get("/account", checkAuth(), settingsController.getAccount);
router.patch(
  "/account",
  checkAuth(),
  validateRequest(updateAccountSettingsSchema),
  settingsController.updateAccount
);

// Sessions
router.get("/sessions", checkAuth(), settingsController.getActiveSessions);
router.post("/sessions/revoke-all", checkAuth(), settingsController.revokeAllOtherSessions);
router.post("/sessions/:sessionId/revoke", checkAuth(), settingsController.revokeSession);

// Danger zone
router.post("/deactivate", checkAuth(), settingsController.deactivateAccount);
router.post("/delete-account", checkAuth(), settingsController.deleteAccount);
router.post("/export-data", checkAuth(), settingsController.exportData);
router.get("/export-data-pdf", checkAuth(), settingsController.exportDataPDF);

// Two-factor authentication status
router.get("/two-factor-status", checkAuth(), settingsController.getTwoFactorStatus);

// Two-factor authentication operations
router.post("/two-factor/enable", checkAuth(), settingsController.enableTwoFactor);
router.post("/two-factor/verify-totp", checkAuth(), settingsController.verifyTOTP);
router.post("/two-factor/disable", checkAuth(), settingsController.disableTwoFactor);

// API Key management
router.get("/api-keys", checkAuth(), settingsController.getApiKeys);
router.post("/api-keys", checkAuth(), settingsController.generateApiKey);
router.delete("/api-keys/:keyId", checkAuth(), settingsController.deleteApiKey);
router.post("/api-keys/revoke-all", checkAuth(), settingsController.revokeAllApiKeys);

export const settingsRouter = router;
