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
        await prisma.user.delete({
            where: {
                id: result.user.id
            }
        })

        throw new AppError(status.INTERNAL_SERVER_ERROR,"Student profile creation failed")

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
                    clusters: true,
                    coTeacherOf: true,
                    sessions: true,
                    taskTemplates: true
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


const logoutService= async (sessionToken : string)=>{

    const result= await auth.api.signOut({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    return result;
}

export const authService = {
    registerService,
    loginService,
    changePasswordService,
    logoutService
}
