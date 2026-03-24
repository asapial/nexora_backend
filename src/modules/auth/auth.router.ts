import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();



router.post("/register",authController.registerController);
router.post("/login",authController.loginController);
router.get("/me",checkAuth(),authController.getMyDataController);
router.post("/changePassword",checkAuth(),authController.changePasswordController);
router.post("/logout",authController.logoutController)
router.post("/verify-email", authController.verifyEmail)
router.post("/resend-verification-email", authController.resendVerificationEmail)
router.post("/forgetPassword", authController.forgetPassword)
router.post("/verifyResetOtp", authController.verifyResetOtp);
router.post("/resetPassword", authController.resetPassword);
router.patch("/updateProfile", checkAuth(), authController.updateProfileController);


router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);


export const authRouter = router;