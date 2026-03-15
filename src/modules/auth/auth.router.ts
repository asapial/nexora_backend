import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();



router.post("/register",authController.registerController);
router.post("/login",authController.loginController);
router.post("/changePassword",authController.changePasswordController);
router.post("/logout",authController.logoutController)
router.post("/verify-email", authController.verifyEmail)
router.post("/forgetPassword", authController.forgetPassword)
router.post("/resetPassword", authController.resetPassword)


router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);


export const authRouter = router;