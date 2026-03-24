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

const loginService = async (data: ILoginData) => {

    const result = await auth.api.signInEmail({
        body: data
    })

    if (result.user.isActive === false) {
        throw new AppError(status.FORBIDDEN, "User is not active");
    }

    const student = await prisma.studentProfile.findFirst({
        where:{
            userId:result.user.id
        }
    });

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

    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }

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
    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }
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
    if (!isUserExist.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Email not verified");
    }
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
    });

    const refreshToken = tokenUtils.createRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
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
