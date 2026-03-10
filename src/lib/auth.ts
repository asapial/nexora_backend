import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role } from "../generated/prisma/enums";
import { envVars } from "../config/env";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,

    emailAndPassword: {
        enabled: true
    },

    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.STUDENT
            },
            isActive: {
                type: "boolean",
                required: true,
                defaultValue: true
            },
            oneTimePassword: {
                type: "string",
                required: false
            }
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    // advanced: {
    //     cookiePrefix: "better-auth",
    //     useSecureCookies: process.env.NODE_ENV === "production",
    //     crossSubDomainCookies: {
    //         enabled: false,
    //     },
    //     // disableCSRFCheck: true, 

    //     defaultCookieAttributes: {
    //         sameSite: "none",
    //         secure: true,
    //         httpOnly: false
    //     }
    // }

    trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL],

    advanced: {
        // disableCSRFCheck: true,
        useSecureCookies: false,
        cookies: {
            state: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            },
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/",
                }
            }
        }
    },
    plugins:[
        bearer(),
    ]
});