import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";


// catchAsync(
//     async(req:Request,res:Response,next:NextFunction)=>{

//     }
// )

const registerController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;

        const result = await authService.registerService(data);
        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            status: status.CREATED,
            success: true,
            message: "User created successfully",
            data: result
        })
    }
)

const loginController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body;
        const result = await authService.loginService(data);

        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);
        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "User logged in successfully",
            data: result
        })
    }
)

const getMyDataController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const userId=req.user.userId;
        const userEmail=req.user.email;
        console.log(userId, userEmail)

        const result = await authService.getMyData(userId as string, userEmail as string);

        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "User featched successfully",
            data: result
        })
    }
)

const changePasswordController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const { oldPassword, newPassword } = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        const result = await authService.changePasswordService(newPassword as string, oldPassword as string, betterAuthSessionToken);

        

        const { accessToken, refreshToken, token, ...rest } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "Password changes successfully",
            data: result
        })
    }
)

const logoutController=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{

                const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        const result = await authService.logoutService(betterAuthSessionToken);

        cookieUtils.clearCookie(res, 'accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'better-auth.session_token', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "User logged out successfully",
            data: result
        })
    }
)

const verifyEmail = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        await authService.verifyEmail(email, otp);

        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "Email verified successfully",
        });
    }
)

const resendVerificationEmail = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await authService.resendVerificationEmail(email);

        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "A fresh verification code has been sent to your email. It expires in 5 minutes.",
        });
    }
)

const forgetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await authService.forgetPassword(email);

        sendResponse(res, {
            status: status.OK,
            success: true,
            message: "Password reset OTP sent to email successfully",
        });
    }
)


const verifyResetOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await authService.verifyResetOtp(email, otp);

    sendResponse(res, {
        status: status.OK,
        success: true,
        message: "OTP verified successfully",
    });
});


const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);

    sendResponse(res, {
        status: status.OK,
        success: true,
        message: "Password reset successfully",
    });
});


const googleLogin = catchAsync((req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", {
        callbackURL : callbackURL,
        betterAuthUrl : envVars.BETTER_AUTH_URL,
    })
})

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if(!sessionToken){
        return res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers:{
            "Cookie" : `better-auth.session_token=${sessionToken}`
        }
    })

    if (!session) {
        return res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=no_session_found`);
    }

    if(session && !session.user){
        return res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=no_user_found`);
    }

    const result = await authService.googleLoginSuccess(session);

    const {accessToken, refreshToken} = result;

    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

    // Redirect to the Next.js /auth/google/callback route.
    // IMPORTANT: Must be outside /api/ — Next.js rewrite rules proxy /api/* to the backend,
    // so any route under /api/ would 404. /auth/google/callback is not affected by rewrites.
    const setTokensUrl = new URL(`${envVars.FRONTEND_URL}/auth/google/callback`);
    setTokensUrl.searchParams.set("accessToken", accessToken);
    setTokensUrl.searchParams.set("refreshToken", refreshToken);
    setTokensUrl.searchParams.set("redirect", finalRedirectPath);

    res.redirect(setTokensUrl.toString());
})

const handleOAuthError = catchAsync((req: Request, res: Response) => {
    const error = req.query.error as string || "oauth_failed";
    res.redirect(`${envVars.FRONTEND_URL}/auth/login?error=${error}`);
})

const updateProfileController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const role   = req.user.role;    
    const patch = req.body;            
 
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      return sendResponse(res, {
        status:  status.BAD_REQUEST,
        success: false,
        message: "Request body must be a plain object",
      });
    }
 
    const result = await authService.updateProfileService(userId, role, patch);
 
    sendResponse(res, {
      status:  status.OK,
      success: true,
      message: "Profile updated successfully",
      data:    result,
    });
  }
);
 



export const authController = {
    registerController,
    loginController,
    getMyDataController,
    changePasswordController,
    logoutController,
    verifyEmail,
    resendVerificationEmail,
    forgetPassword,
    resetPassword,
    googleLogin,
    googleLoginSuccess,
    handleOAuthError,
    verifyResetOtp,
    updateProfileController
}