import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();



router.post("/register",authController.registerController);
router.post("/login",authController.loginController);
router.post("/changePassword",authController.changePasswordController);
router.post("/logout",authController.logoutController)



export const authRouter = router;