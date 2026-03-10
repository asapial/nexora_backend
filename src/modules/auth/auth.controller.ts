import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";


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



export const authController = {
    registerController,
    loginController,
    changePasswordController,
    logoutController
}