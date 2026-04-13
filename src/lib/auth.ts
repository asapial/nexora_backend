import { betterAuth, boolean } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP, twoFactor } from "better-auth/plugins";

import { prisma } from "./prisma";
import { Role } from "../generated/prisma/enums";
import { envVars } from "../config/env";
import { sendEmail } from "../utils/emailSender";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

    socialProviders:{
        google:{
            clientId: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            // callbackUrl: envVars.GOOGLE_CALLBACK_URL,
            mapProfileToUser: ()=>{
                return {
                    role : Role.STUDENT,
                    needPasswordChange : false,
                    emailVerified : true,
                    isDeleted : false,
                    deletedAt : null,
                }
            }
        }
    },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.STUDENT,
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      oneTimePassword: {
        type: "string",
        required: false,
      },
      needPasswordChange:{
        type:"boolean",
        required:false
      }
    },
    deleteUser:{
      enabled:true
    }
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  trustedOrigins: [
    envVars.BETTER_AUTH_URL,
    envVars.FRONTEND_URL,
  ],

  advanced: {
    useSecureCookies: envVars.NODE_ENV === "production",

    // Fallback for any cookie BetterAuth creates that isn't explicitly listed below.
    // Ensures OAuth state/PKCE cookies survive the cross-site redirect from Google
    // back to the .vercel.app public-suffix domain.
    defaultCookieAttributes: {
      sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
      secure: envVars.NODE_ENV === "production",
      path: "/",
    },

    cookies: {
      sessionToken: {
        attributes: {
          httpOnly: true,
          sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
          secure: envVars.NODE_ENV === "production",
          path: "/",
        },
      },
      // OAuth state cookie – must persist across the Google redirect
      state: {
        attributes: {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          path: "/",
        },
      },
      // PKCE code-verifier cookie
      pkCodeVerifier: {
        attributes: {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          path: "/",
        },
      },
    },
  },

  plugins: [
    bearer(),

    twoFactor({
      issuer: "Nexora",
    }),

    emailOTP({
      overrideDefaultEmailVerification: true,

      async sendVerificationOTP({ email, otp, type }) {

        if (type === "email-verification") {

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user && !user.emailVerified) {

            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "verifyOtp",
              templateData: {
                name: user.name,
                otp,
                email,
                expiresIn: "5 minutes",
              },
            });

          }
        }
        else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            }
          })

          if (user) {
            await sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "forgetPasswordOtp",
              templateData: {
                name: user.name,
                otp,
                email,
                expiresIn: "5 minutes",
              }
            })
          }
        }
      },

      expiresIn: 5 * 60,
      otpLength: 6,
    }),
  ],
});