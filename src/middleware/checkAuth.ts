/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Role } from "../generated/prisma/enums";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";

import { jwtUtils } from "../utils/jwt";
import { cookieUtils } from "../utils/cookie";




declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string;
                role: Role;
                email: string;
            }
        }
    }
}

export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ── 1. Verify session token ───────────────────────────────────────────
        const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

        // console.log("sessionToken",sessionToken)

        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No session token provided.');
        }

        const sessionExists = await prisma.session.findFirst({
            where: {
                token: sessionToken,
                // expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });
        
   
        // Session not found or expired → reject immediately
        if (!sessionExists || !sessionExists.user) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Session is invalid or has expired. Please log in again.');
        }

        const user = sessionExists.user;

        if (user.isDeleted) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User account has been deleted.');
        }

        // Warn client when session is close to expiry
        const now = new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

        if (percentRemaining < 20) {
            res.setHeader('X-Session-Refresh', 'true');
            res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
            res.setHeader('X-Time-Remaining', timeRemaining.toString());
            // console.log("Session Expiring Soon!!");
        }

        // Role-based access guard
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(status.FORBIDDEN, `Forbidden! This resource requires one of: [${authRoles.join(', ')}].`);
        }

        // ── 2. Populate req.user from session (authoritative source) ─────────
        req.user = {
            userId: user.id,
            role:   user.role,
            email:  user.email,
        };

        // ── 3. Verify access token ────────────────────────────────────────────
        const accessToken = cookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
        }

        const verifiedToken = jwtUtils.vefifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Access token is invalid or expired.');
        }

        next();
    } catch (error: any) {
        next(error);
    }
};