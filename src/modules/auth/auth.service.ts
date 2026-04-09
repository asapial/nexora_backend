import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { ILoginData, IRegisterData } from "./auth.type";
import { coerceValue } from "../../utils/coerceValue";



const registerService = async (data: IRegisterData) => {

    const result = await auth.api.signUpEmail({
        body: data
    })


    try {

        const student = await prisma.$transaction(async (tx) => {

            const studentTx = await tx.studentProfile.create({
                data: {
                    userId: result.user.id
                }
            })

            return studentTx;
        })
        const accessToken = tokenUtils.createAccessToken({
            userId: result.user.id,
            role: result.user.role,
            name: result.user.name,
            email: result.user.email,
            isActive: result.user.isActive,
            oneTimePassword: result.user.oneTimePassword,
            emailVerified: result.user.emailVerified,
        })

        const refreshToken = tokenUtils.createRefreshToken({
            userId: result.user.id,
            role: result.user.role,
            name: result.user.name,
            email: result.user.email,
            isActive: result.user.isActive,
            oneTimePassword: result.user.oneTimePassword,
            emailVerified: result.user.emailVerified,
        })

        return {
            ...result,
            accessToken,
            refreshToken
        }
    } catch (error) {
        await prisma.user.deleteMany({
            where: {
                id: result.user.id
            }
        })

        throw new AppError(status.INTERNAL_SERVER_ERROR, "Student profile creation failed")

    }

}

const loginService = async (data: ILoginData, cookieHeader?: string) => {

    const email = (data.email ?? "").trim().toLowerCase();

    // ── STEP 1: User must exist in OUR DB ────────────────────────────────────
    // We check this BEFORE calling BetterAuth so BetterAuth's twoFactor plugin
    // can never intercept a "user not found" case and return twoFactorRedirect.
    const dbUser = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            isDeleted: true,
            isActive: true,
            twoFactorEnabled: true,
            twoFactorSecret: true,
        },
    });

    if (!dbUser || dbUser.isDeleted) {
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
    }

    if (dbUser.isActive === false) {
        throw new AppError(status.FORBIDDEN, "Your account has been deactivated. Please contact support.");
    }

    // ── STEP 2: Call BetterAuth to authenticate ───────────────────────────────
    const reqHeaders = new Headers();
    if (cookieHeader) reqHeaders.set("cookie", cookieHeader);

    let response: Response;
    try {
        response = await auth.api.signInEmail({
            body: { ...data, email },
            headers: reqHeaders,
            asResponse: true,
        }) as unknown as Response;
    } catch {
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
    }

    // Capture Set-Cookie headers (needed for 2FA pending-session cookie)
    const responseCookies: string[] = [];
    response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") responseCookies.push(value);
    });

    let result: any;
    try {
        result = await response.json();
    } catch {
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
    }

    // ── STEP 3: Handle wrong password ────────────────────────────────────────
    // BetterAuth returns non-2xx for incorrect passwords.
    // We check this FIRST before twoFactorRedirect so wrong passwords
    // are always rejected with a clean 401 — never shown the 2FA modal.
    if (!response.ok) {
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
    }

    // ── STEP 4: Handle 2FA redirect ───────────────────────────────────────────
    // BetterAuth's twoFactor plugin returns { twoFactorRedirect: true } when
    // the user has 2FA enabled. We cross-check our own DB flag to catch
    // phantom redirects (e.g., stale TwoFactor table rows).
    if (result.twoFactorRedirect) {
        const hasRealTOTP = dbUser.twoFactorEnabled && dbUser.twoFactorSecret;

        if (!hasRealTOTP) {
            // Stale/phantom 2FA — clear all 2FA data and reject cleanly
            await prisma.user.update({
                where: { id: dbUser.id },
                data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackupCodes: null },
            }).catch(() => {});
            await prisma.twoFactor.deleteMany({ where: { userId: dbUser.id } }).catch(() => {});
            throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
        }

        return {
            twoFactorRedirect: true,
            message: "Two-factor authentication required",
            _responseCookies: responseCookies,
        };
    }

    // ── STEP 5: Successful login ──────────────────────────────────────────────
    if (!result.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password.");
    }

    if (result.user.isActive === false) {
        throw new AppError(status.FORBIDDEN, "User is not active");
    }

    const student = await prisma.studentProfile.findFirst({
        where: { userId: result.user.id }
    });

    const accessToken = tokenUtils.createAccessToken({
        userId: result.user.id,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
        isActive: result.user.isActive,
        oneTimePassword: result.user.oneTimePassword,
        emailVerified: result.user.emailVerified,
    });

    const refreshToken = tokenUtils.createRefreshToken({
        userId: result.user.id,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
        isActive: result.user.isActive,
        oneTimePassword: result.user.oneTimePassword,
        emailVerified: result.user.emailVerified,
    });

    return {
        ...result,
        accessToken,
        refreshToken,
        _responseCookies: responseCookies,
    };
}


const verifyLoginTOTP = async (code: string, cookieHeader: string) => {
    // BetterAuth's verify-totp during login needs the pending 2FA session cookie
    const result = await (auth.api as any).verifyTOTP({
        body: { code },
        headers: new Headers({
            Cookie: cookieHeader,
        }),
    });

    if (!result || !result.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid TOTP code");
    }

    if (result.user.isActive === false) {
        throw new AppError(status.FORBIDDEN, "User is not active");
    }

    const accessToken = tokenUtils.createAccessToken({
        userId: result.user.id,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
        isActive: result.user.isActive,
        oneTimePassword: result.user.oneTimePassword,
        emailVerified: result.user.emailVerified,
    });

    const refreshToken = tokenUtils.createRefreshToken({
        userId: result.user.id,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
        isActive: result.user.isActive,
        oneTimePassword: result.user.oneTimePassword,
        emailVerified: result.user.emailVerified,
    });

    return {
        ...result,
        accessToken,
        refreshToken,
    };
}


const getMyData = async (userId: string, email: string) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            studentProfile: {
                include: {
                    clusterMembers: true,
                    tasks: true,
                    attendances: true,
                    readingLists: true,
                    studyGroups: true
                }
            },
            teacherProfile: {
                include: {
                    coTeacherOf: true,
                    sessions: true,
                    taskTemplates: true,
                    
                }
            },
            adminProfile:{
                include:{
                    activityLogs:true,

                }
            }
            
        }
    })


    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    const {studentProfile,teacherProfile,adminProfile,...userData}=isUserExists;

    return {
        userData,
        studentProfile,
        teacherProfile,
        adminProfile
    };
}

const changePasswordService = async (newPassword: string, oldPassword: string, sessionToken: string) => {


    const session = await auth.api.getSession({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    if (!session) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token")
    }


    const result = await auth.api.changePassword({
        body: {
            currentPassword: oldPassword,
            newPassword,
            revokeOtherSessions: true

        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    if (session.user.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                needPasswordChange: false,
            }
        })
    }


    const accessToken = tokenUtils.createAccessToken({
        userId: result.user.id,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
        isActive: result.user.isActive,
        oneTimePassword: result.user.oneTimePassword,
        emailVerified: result.user.emailVerified,
    })

    const refreshToken = tokenUtils.createRefreshToken({
        userId: result.user.id,
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
        isActive: result.user.isActive,
        oneTimePassword: result.user.oneTimePassword,
        emailVerified: result.user.emailVerified,
    })


    return {
        ...result,
        accessToken,
        refreshToken
    }
}


const logoutService = async (sessionToken: string) => {

    const result = await auth.api.signOut({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    return result;
}

const verifyEmail = async (email: string, otp: string) => {

    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp,
        }
    })

    if (result.status && !result.user.emailVerified) {
        await prisma.user.update({
            where: {
                email,
            },
            data: {
                emailVerified: true,
            }
        })
    }
}

const resendVerificationEmail = async (email: string) => {
    // Verify the user actually exists
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, emailVerified: true, isDeleted: true },
    });



    if (!user) {
        throw new AppError(status.NOT_FOUND, "No account found with this email address.");
    }

    if (user.isDeleted) {
        throw new AppError(status.NOT_FOUND, "No account found with this email address.");
    }

    if (user.emailVerified) {
        throw new AppError(
            status.BAD_REQUEST,
            "This email is already verified. No need to resend a verification code."
        );
    }

    // Use BetterAuth's emailOTP plugin to generate + send a fresh OTP
    await auth.api.sendVerificationEmail({
        body: { email },
    });
};

const forgetPassword = async (email: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    // if (!isUserExist.emailVerified) {
    //     throw new AppError(status.BAD_REQUEST, "Email not verified");
    // }

    if (isUserExist.isDeleted) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    await auth.api.requestPasswordResetEmailOTP({
        body: {
            email,
        }
    })
}


const verifyResetOtp = async (email: string, otp: string) => {
    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    // if (!isUserExist.emailVerified) {
    //     throw new AppError(status.BAD_REQUEST, "Email not verified");
    // }
    if (isUserExist.isDeleted) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }


    if (!otp || otp.length !== 6) {
        throw new AppError(status.BAD_REQUEST, "Invalid OTP");
    }


};


const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }
    // if (!isUserExist.emailVerified) {
    //     throw new AppError(status.BAD_REQUEST, "Email not verified");
    // }
    if (isUserExist.isDeleted) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    await auth.api.resetPasswordEmailOTP({
        body: { email, otp, password: newPassword }
    });

    if (isUserExist.needPasswordChange) {
        await prisma.user.update({
            where: { id: isUserExist.id },
            data: { needPasswordChange: false }
        });
    }

    await prisma.session.deleteMany({
        where: { userId: isUserExist.id }
    });
};

const googleLoginSuccess= async (session: Record<string, any>)=>{
    const isStudentExists= await prisma.studentProfile.findUnique({
        where:{
            userId:session.user.id
        }
    })

    if(!isStudentExists){
        await prisma.studentProfile.create({
            data:{
                userId:session.user.id
            }
        })
    }

        const accessToken = tokenUtils.createAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        isActive: session.user.isActive,
        oneTimePassword: session.user.oneTimePassword,
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = tokenUtils.createRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        isActive: session.user.isActive,
        oneTimePassword: session.user.oneTimePassword,
        emailVerified: session.user.emailVerified,
    });

    return {
        accessToken,
        refreshToken,
    }
}

 
// ─── Fields allowed on the User table ─────────────────────
const USER_TABLE_FIELDS = new Set(["name", "email", "image"]);
 
// ─── Allowed fields per role ───────────────────────────────
const ALLOWED_FIELDS: Record<string, Set<string>> = {
  STUDENT: new Set([
    "phone", "address", "bio", "nationality",
    "institution", "department", "batch", "programme",
    "cgpa", "enrollmentYear", "expectedGraduation",
    "skills", "linkedinUrl", "githubUrl", "website", "portfolioUrl",
  ]),
  TEACHER: new Set([
    "designation", "department", "institution", "bio",
    "website", "linkedinUrl", "specialization", "experience",
    "researchInterests", "googleScholarUrl", "officeHours",
  ]),
  ADMIN: new Set([
    "phone", "bio", "nationality", "avatarUrl",
    "designation", "department", "organization",
    "linkedinUrl", "website",
  ]),
};
 


const updateProfileService = async (
  userId: string,
  role: string,
  patch: Record<string, unknown>
) => {
  // Validate role
  if (!["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
    throw new AppError(status.FORBIDDEN, "Invalid role");
  }
 
  const allowedProfile = ALLOWED_FIELDS[role];
 
  // Split patch into userPatch and profilePatch
  const userPatch:    Record<string, unknown> = {};
  const profilePatch: Record<string, unknown> = {};
 
  for (const [key, rawValue] of Object.entries(patch)) {
    if (USER_TABLE_FIELDS.has(key)) {
      // Validate it's in the user-allowed list
      if (!["name", "email", "image"].includes(key)) {
        throw new AppError(
          status.BAD_REQUEST,
          `Field '${key}' is not allowed`
        );
      }
      userPatch[key] = rawValue;
    } else if (allowedProfile!.has(key)) {
      profilePatch[key] = coerceValue(key, rawValue);
    } else {
      // Unknown or forbidden field — reject silently or throw
      throw new AppError(
        status.BAD_REQUEST,
        `Field '${key}' is not allowed for role ${role}`
      );
    }
  }
 
  // Nothing to do
  if (
    Object.keys(userPatch).length === 0 &&
    Object.keys(profilePatch).length === 0
  ) {
    throw new AppError(status.BAD_REQUEST, "No valid fields to update");
  }
 
  // Run both updates in a single transaction
  await prisma.$transaction(async (tx) => {
    // ── User table ────────────────────────────────────────
    if (Object.keys(userPatch).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userPatch,
      });
    }
 
    // ── Profile table (role-specific) ─────────────────────
    if (Object.keys(profilePatch).length > 0) {
      if (role === "STUDENT") {
        await tx.studentProfile.update({
          where: { userId },
          data: profilePatch,
        });
      } else if (role === "TEACHER") {
        await tx.teacherProfile.update({
          where: { userId },
          data: profilePatch,
        });
      } else if (role === "ADMIN") {
        await tx.adminProfile.update({
          where: { userId },
          data: profilePatch,
        });
      }
    }
  });
 
  // Return updated data so the frontend can sync local state
  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true },
  });
 
  return { updatedUser };
};


export const authService = {
    registerService,
    loginService,
    verifyLoginTOTP,
    getMyData,
    changePasswordService,
    logoutService,
    verifyEmail,
    resendVerificationEmail,
    forgetPassword,
    resetPassword,
    verifyResetOtp,
    googleLoginSuccess,
    updateProfileService
}

