import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { changePasswordSchema, demoLoginSchema, emailSchema, loginSchema, otpSchema, registerSchema, resetPasswordSchema } from "../../validation/requestSchemas";

const router = Router();



router.post("/register", validateRequest(registerSchema), authController.registerController);
router.post("/login", validateRequest(loginSchema), authController.loginController);
router.post("/demo-login", validateRequest(demoLoginSchema), authController.demoLoginController);
router.post("/verify-login-totp", authController.verifyLoginTOTPController);
router.get("/me", checkAuth(), authController.getMyDataController);
router.post("/changePassword", checkAuth(), validateRequest(changePasswordSchema), authController.changePasswordController);
router.post("/logout", authController.logoutController);
router.post("/verify-email", validateRequest(otpSchema), authController.verifyEmail);
router.post("/resend-verification-email", validateRequest(emailSchema), authController.resendVerificationEmail);
router.post("/forgetPassword", validateRequest(emailSchema), authController.forgetPassword);
router.post("/verifyResetOtp", validateRequest(otpSchema), authController.verifyResetOtp);
router.post("/resetPassword", validateRequest(resetPasswordSchema), authController.resetPassword);
router.patch("/updateProfile", checkAuth(), authController.updateProfileController);


router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);


export const authRouter = router;
