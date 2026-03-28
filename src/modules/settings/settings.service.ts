import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import type { UpdateAccountSettingsBody } from "./settings.validation";

const getAccount = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teacherProfile: true,
      studentProfile: true,
      adminProfile: true,
      accountSettings: true,
    },
  });

  if (!user || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Account not found.");
  }

  const base = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };

  const prefs = user.accountSettings
    ? {
        timezone: user.accountSettings.timezone ?? undefined,
        language: user.accountSettings.language ?? undefined,
        emailNotifications: (user.accountSettings.emailNotifications ?? undefined) as
          | Record<string, boolean>
          | undefined,
        pushNotifications: (user.accountSettings.pushNotifications ?? undefined) as
          | Record<string, boolean>
          | undefined,
        privacy: (user.accountSettings.privacy ?? undefined) as
          | Record<string, boolean | string>
          | undefined,
      }
    : null;

  if (user.role === Role.TEACHER && user.teacherProfile) {
    return { user: base, profile: user.teacherProfile, profileType: "teacher" as const, preferences: prefs };
  }
  if (user.role === Role.STUDENT && user.studentProfile) {
    return { user: base, profile: user.studentProfile, profileType: "student" as const, preferences: prefs };
  }
  if (user.role === Role.ADMIN && user.adminProfile) {
    return { user: base, profile: user.adminProfile, profileType: "admin" as const, preferences: prefs };
  }

  return { user: base, profile: null, profileType: "none" as const, preferences: prefs };
};

const updateAccount = async (userId: string, body: UpdateAccountSettingsBody) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Account not found.");
  }

  if (body.name !== undefined || body.image !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.image !== undefined ? { image: body.image } : {}),
      },
    });
  }

  if (user.role === Role.TEACHER && body.teacherProfile) {
    const tp = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (tp) {
      const d = body.teacherProfile;
      await prisma.teacherProfile.update({
        where: { id: tp.id },
        data: {
          ...(d.designation !== undefined ? { designation: d.designation } : {}),
          ...(d.department !== undefined ? { department: d.department } : {}),
          ...(d.institution !== undefined ? { institution: d.institution } : {}),
          ...(d.bio !== undefined ? { bio: d.bio } : {}),
          ...(d.website !== undefined ? { website: d.website || null } : {}),
          ...(d.linkedinUrl !== undefined ? { linkedinUrl: d.linkedinUrl || null } : {}),
          ...(d.specialization !== undefined ? { specialization: d.specialization } : {}),
          ...(d.googleScholarUrl !== undefined ? { googleScholarUrl: d.googleScholarUrl || null } : {}),
          ...(d.officeHours !== undefined ? { officeHours: d.officeHours } : {}),
          ...(d.researchInterests !== undefined ? { researchInterests: d.researchInterests } : {}),
        },
      });
    }
  }

  if (user.role === Role.STUDENT && body.studentProfile) {
    const sp = await prisma.studentProfile.findUnique({ where: { userId } });
    if (sp) {
      const d = body.studentProfile;
      await prisma.studentProfile.update({
        where: { id: sp.id },
        data: {
          ...(d.phone !== undefined ? { phone: d.phone } : {}),
          ...(d.address !== undefined ? { address: d.address } : {}),
          ...(d.bio !== undefined ? { bio: d.bio } : {}),
          ...(d.institution !== undefined ? { institution: d.institution } : {}),
          ...(d.department !== undefined ? { department: d.department } : {}),
          ...(d.batch !== undefined ? { batch: d.batch } : {}),
          ...(d.programme !== undefined ? { programme: d.programme } : {}),
          ...(d.linkedinUrl !== undefined ? { linkedinUrl: d.linkedinUrl || null } : {}),
          ...(d.githubUrl !== undefined ? { githubUrl: d.githubUrl || null } : {}),
          ...(d.website !== undefined ? { website: d.website || null } : {}),
          ...(d.nationality !== undefined ? { nationality: d.nationality } : {}),
        },
      });
    }
  }

  if (user.role === Role.ADMIN && body.adminProfile) {
    const ap = await prisma.adminProfile.findUnique({ where: { userId } });
    if (ap) {
      const d = body.adminProfile;
      await prisma.adminProfile.update({
        where: { id: ap.id },
        data: {
          ...(d.phone !== undefined ? { phone: d.phone } : {}),
          ...(d.bio !== undefined ? { bio: d.bio } : {}),
          ...(d.nationality !== undefined ? { nationality: d.nationality } : {}),
          ...(d.designation !== undefined ? { designation: d.designation } : {}),
          ...(d.department !== undefined ? { department: d.department } : {}),
          ...(d.organization !== undefined ? { organization: d.organization } : {}),
          ...(d.linkedinUrl !== undefined ? { linkedinUrl: d.linkedinUrl || null } : {}),
          ...(d.website !== undefined ? { website: d.website || null } : {}),
        },
      });
    }
  }

  if (body.preferences) {
    const p = body.preferences;
    await prisma.userAccountSettings.upsert({
      where: { userId },
      create: {
        userId,
        timezone: p.timezone ?? undefined,
        language: p.language ?? undefined,
        emailNotifications: p.emailNotifications ?? undefined,
        pushNotifications: p.pushNotifications ?? undefined,
        privacy: p.privacy ?? undefined,
      },
      update: {
        ...(p.timezone !== undefined ? { timezone: p.timezone || null } : {}),
        ...(p.language !== undefined ? { language: p.language || null } : {}),
        ...(p.emailNotifications !== undefined ? { emailNotifications: p.emailNotifications } : {}),
        ...(p.pushNotifications !== undefined ? { pushNotifications: p.pushNotifications } : {}),
        ...(p.privacy !== undefined ? { privacy: p.privacy } : {}),
      },
    });
  }

  return getAccount(userId);
};

export const settingsService = {
  getAccount,
  updateAccount,
};
