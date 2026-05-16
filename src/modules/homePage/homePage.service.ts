import { PriceApprovalStatus } from "../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const getFeaturedCourse= async ()=>{

    const featuredCourse= await prisma.course.findMany({
        where:{
            isFeatured:true,
            priceApprovalStatus:PriceApprovalStatus.APPROVED
        },
        include:{
            _count:{
                select:{
                    enrollments:true,
                    missions:true
                }
            }
        },
        take:6,
        orderBy:{
            createdAt:"desc"
        }

    })

    return featuredCourse;
}

// --- Hero Section: fetch ALL teachers (admin view, any verification status) ---
const getAllTeachersForHeroSelection = async () => {
    const teachers = await prisma.user.findMany({
        where: {
            role: "TEACHER",
        },
        select: {
            id: true,
            name: true,
            image: true,
            email: true,
            isActive: true,
            teacherProfile: {
                select: {
                    designation: true,
                    department: true,
                    specialization: true,
                    researchInterests: true,
                    bio: true,
                    isVerified: true,
                    institution: true,
                }
            },
            // include their current hero section entry if any
            heroSectionEntry: {
                select: {
                    id: true,
                    displayName: true,
                    displayDesignation: true,
                    displayDepartment: true,
                    displayBio: true,
                    order: true,
                    isActive: true,
                }
            }
        },
        orderBy: { name: "asc" }
    });
    return teachers;
}

// --- Hero Section: fetch only currently active featured teachers (public API) ---
const getFeaturedTeachers = async () => {
    const entries = await prisma.heroSectionTeacher.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    teacherProfile: {
                        select: {
                            designation: true,
                            department: true,
                            specialization: true,
                            researchInterests: true,
                        }
                    }
                }
            }
        }
    });

    if (entries.length === 0) {
        // Fallback: return up to 3 verified teachers
        const fallbackTeachers = await prisma.user.findMany({
            where: {
                role: "TEACHER",
                teacherProfile: { isVerified: true }
            },
            select: {
                id: true,
                name: true,
                image: true,
                teacherProfile: {
                    select: {
                        designation: true,
                        department: true,
                        specialization: true,
                        researchInterests: true,
                    }
                }
            },
            take: 3,
            orderBy: { createdAt: "desc" }
        });
        return fallbackTeachers;
    }

    // Merge: admin overrides take priority over profile data
    return entries.map(entry => ({
        id: entry.user.id,
        name: entry.displayName || entry.user.name,
        image: entry.user.image,
        teacherProfile: {
            designation: entry.displayDesignation ?? entry.user.teacherProfile?.designation ?? null,
            department: entry.displayDepartment ?? entry.user.teacherProfile?.department ?? null,
            specialization: entry.user.teacherProfile?.specialization ?? null,
            researchInterests: entry.user.teacherProfile?.researchInterests ?? [],
            displayBio: entry.displayBio ?? null,
        }
    }));
}

// --- Hero Section: upsert a teacher entry (admin action) ---
const upsertHeroSectionTeacher = async (payload: {
    userId: string;
    displayName?: string | null;
    displayDesignation?: string | null;
    displayDepartment?: string | null;
    displayBio?: string | null;
    order?: number;
    isActive: boolean;
}) => {
    const result = await prisma.heroSectionTeacher.upsert({
        where: { userId: payload.userId },
        update: {
            displayName: payload.displayName,
            displayDesignation: payload.displayDesignation,
            displayDepartment: payload.displayDepartment,
            displayBio: payload.displayBio,
            order: payload.order ?? 0,
            isActive: payload.isActive,
        },
        create: {
            userId: payload.userId,
            displayName: payload.displayName,
            displayDesignation: payload.displayDesignation,
            displayDepartment: payload.displayDepartment,
            displayBio: payload.displayBio,
            order: payload.order ?? 0,
            isActive: payload.isActive,
        }
    });
    return result;
}

// --- Hero Section: remove a teacher from hero section ---
const removeHeroSectionTeacher = async (userId: string) => {
    const result = await prisma.heroSectionTeacher.deleteMany({
        where: { userId }
    });
    return result;
}

export const homePageService={
    getFeaturedCourse,
    getAllTeachersForHeroSelection,
    getFeaturedTeachers,
    upsertHeroSectionTeacher,
    removeHeroSectionTeacher,
}