import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth"
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { ILoginData, IRegisterData } from "./auth.type";



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
                select: {
                    institution: true,
                    batch: true,
                    programme: true,
                    bio: true,
                    linkedinUrl: true,
                    githubUrl: true,
                },
                include: {
                    clusterMembers: true,
                    tasks: true,
                    attendances: true,
                    readingLists: true,
                    studyGroups: true
                }
            },
            teacherProfile: {
                select: {
                    designation: true,
                    department: true,
                    institution: true,
                    bio: true,
                    website: true,
                    linkedinUrl: true
                },
                include: {
                    coTeacherOf: true,
                    sessions: true,
                    taskTemplates: true,
                    
                }
            },
        }
    })

    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    return isUserExists;
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

const resetPassword = async (email: string, otp: string, newPassword: string) => {
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

    await auth.api.resetPasswordEmailOTP({
        body: {
            email,
            otp,
            password: newPassword,
        }
    })

    if (isUserExist.needPasswordChange) {
        await prisma.user.update({
            where: {
                id: isUserExist.id,
            },
            data: {
                needPasswordChange: false,
            }
        })
    }

    await prisma.session.deleteMany({
        where: {
            userId: isUserExist.id,
        }
    })
}


const googleLoginSuccess= async (session: Record<string, any>)=>{
    const isStudentExists= await prisma.studentProfile.findUnique({
        where:{
            userId:session.user.id
        }
    })

    if(!isStudentExists){
        await prisma.studentProfile.create({
            data:{
                userId:session.user.userId
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

export const authService = {
    registerService,
    loginService,
    changePasswordService,
    logoutService,
    verifyEmail,
    resendVerificationEmail,
    forgetPassword,
    resetPassword,
    googleLoginSuccess
}
