import { betterAuth, boolean } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

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
    requireEmailVerification: true,
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

    cookies: {
      sessionToken: {
        attributes: {
          httpOnly: true,
          sameSite: "lax",
          secure: envVars.NODE_ENV === "production",
          path: "/",
        },
      },
    },
  },

  plugins: [
    bearer(),

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
            sendEmail({
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