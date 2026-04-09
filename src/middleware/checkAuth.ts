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
        // ── 1. Read the BetterAuth session token from cookies ─────────────────
        // The cookie "better-auth.session_token" is set during login using
        // result.token from auth.api.signInEmail — which is the EXACT value
        // stored in prisma.session.token by BetterAuth.
        const sessionToken = cookieUtils.getBetterAuthSessionToken(req);

        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Please log in to continue.");
        }

        // ── 2. Look up session in database ────────────────────────────────────
        // When BetterAuth's cookieCache is enabled (auth.ts), the session_token
        // cookie value is stored as "<rawToken>.<HMACSignature>" (signed format).
        // Prisma only stores the raw token, so we must strip the signature suffix
        // before the DB lookup — otherwise every Google OAuth session returns null.
        const rawSessionToken = sessionToken.includes(".")
            ? sessionToken.split(".")[0]
            : sessionToken;

        const sessionExists = await prisma.session.findFirst({
            where: { token: rawSessionToken },
            include: { user: true },
        });

        if (!sessionExists || !sessionExists.user) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Session is invalid or has expired. Please log in again.");
        }

        const user = sessionExists.user;

        if (user.isDeleted) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! User account has been deleted.");
        }

        // ── 3. Session expiry warning ─────────────────────────────────────────
        const now = new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = sessionLifeTime > 0 ? (timeRemaining / sessionLifeTime) * 100 : 100;

        if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
        }

        // ── 4. Role-based access guard ────────────────────────────────────────
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
                status.FORBIDDEN,
                `Forbidden! This resource requires one of: [${authRoles.join(", ")}].`
            );
        }

        // ── 5. Populate req.user from session ─────────────────────────────────
        req.user = {
            userId: user.id,
            role:   user.role,
            email:  user.email,
        };

        // ── 6. Verify our custom access token (JWT) ───────────────────────────
        const accessToken = cookieUtils.getCookie(req, "accessToken");

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No access token provided.");
        }

        const verifiedToken = jwtUtils.vefifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Access token is invalid or expired.");
        }

        next();
    } catch (error: any) {
        next(error);
    }
};