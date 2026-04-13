import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { Role } from "../../generated/prisma/enums";
import crypto from "crypto";
import type { UpdateAccountSettingsBody } from "./settings.validation";
import { auth } from "../../lib/auth";

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
    const createData: Record<string, unknown> = { userId };
    if (p.timezone !== undefined) createData.timezone = p.timezone;
    if (p.language !== undefined) createData.language = p.language;
    if (p.emailNotifications !== undefined) createData.emailNotifications = p.emailNotifications;
    if (p.pushNotifications !== undefined) createData.pushNotifications = p.pushNotifications;
    if (p.privacy !== undefined) createData.privacy = p.privacy;

    await prisma.userAccountSettings.upsert({
      where: { userId },
      create: createData as any,
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

// ─────────────────────────────────────────────────────────
// ACTIVE SESSIONS
// ─────────────────────────────────────────────────────────

const getActiveSessions = async (userId: string, currentSessionToken?: string) => {
  const sessions = await prisma.session.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      expiresAt: true,
      token: true,
    },
  });

  return sessions.map(s => ({
    id: s.id,
    ipAddress: s.ipAddress ?? "Unknown",
    userAgent: s.userAgent ?? "Unknown device",
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
    isCurrent: currentSessionToken ? s.token === currentSessionToken : false,
    device: parseUserAgent(s.userAgent),
  }));
};

function parseUserAgent(ua: string | null): string {
  if (!ua) return "Unknown device";
  let browser = "Unknown browser";
  if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";

  let os = "";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return os ? `${browser} on ${os}` : browser;
}

const revokeSession = async (userId: string, sessionId: string) => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) throw new AppError(status.NOT_FOUND, "Session not found.");
  await prisma.session.delete({ where: { id: sessionId } });
  return { message: "Session revoked." };
};

const revokeAllOtherSessions = async (userId: string, currentSessionToken?: string) => {
  const where: any = { userId };
  if (currentSessionToken) {
    where.NOT = { token: currentSessionToken };
  }
  const result = await prisma.session.deleteMany({ where });
  return { revoked: result.count, message: `${result.count} session(s) revoked.` };
};

// ─────────────────────────────────────────────────────────
// DEACTIVATE ACCOUNT
// ─────────────────────────────────────────────────────────

const deactivateAccount = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(status.NOT_FOUND, "Account not found.");
  if (!user.isActive) throw new AppError(status.BAD_REQUEST, "Account is already deactivated.");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  // Revoke all sessions
  await prisma.session.deleteMany({ where: { userId } });

  return { message: "Account deactivated. You can reactivate by logging in again." };
};

// ─────────────────────────────────────────────────────────
// DELETE ACCOUNT
// ─────────────────────────────────────────────────────────

const deleteAccount = async (userId: string, confirmText: string) => {
  if (confirmText !== "DELETE") {
    throw new AppError(status.BAD_REQUEST, "Please type DELETE to confirm account deletion.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(status.NOT_FOUND, "Account not found.");

  // Soft delete — mark as deleted and deactivate
  await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      isActive: false,
      name: `Deleted User ${userId.slice(0, 8)}`,
      email: `deleted_${userId}@nexora.removed`,
    },
  });

  // Revoke all sessions
  await prisma.session.deleteMany({ where: { userId } });

  return { message: "Account permanently deleted." };
};

// ─────────────────────────────────────────────────────────
// EXPORT DATA
// ─────────────────────────────────────────────────────────

const exportData = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teacherProfile: true,
      studentProfile: true,
      adminProfile: true,
      accountSettings: true,
      enrollments: { include: { course: { select: { title: true } } } },
      certificates: true,
      memberships: { include: { cluster: { select: { name: true } } } },
      badges: { include: { milestone: { select: { name: true } } } },
    },
  });

  if (!user) throw new AppError(status.NOT_FOUND, "Account not found.");

  return {
    exportedAt: new Date().toISOString(),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    profile: user.teacherProfile || user.studentProfile || user.adminProfile || null,
    settings: user.accountSettings,
    enrollments: user.enrollments.map(e => ({
      courseTitle: e.course?.title,
      enrolledAt: e.enrolledAt,
      progress: e.progress,
      completedAt: e.completedAt,
      paymentStatus: e.paymentStatus,
    })),
    certificates: user.certificates.map(c => ({
      title: c.title,
      issuedAt: c.issuedAt,
      verifyCode: c.verifyCode,
      pdfUrl: c.pdfUrl,
    })),
    clusterMemberships: user.memberships.map(m => ({
      clusterName: m.cluster?.name,
      joinedAt: m.joinedAt,
      subtype: m.subtype,
    })),
    badges: user.badges.map(b => ({
      milestoneName: b.milestone?.name,
      awardedAt: b.awardedAt,
    })),
  };
};

const exportDataPDF = async (userId: string): Promise<Buffer> => {
  const data = await exportData(userId);
  const { generateDataExportPDF } = await import("../../utils/generateDataExportPDF");
  return generateDataExportPDF(data as any);
};

// ─────────────────────────────────────────────────────────
// TWO-FACTOR AUTH STATUS
// ─────────────────────────────────────────────────────────

const getTwoFactorStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true },
  });
  if (!user) throw new AppError(status.NOT_FOUND, "Account not found.");
  return { twoFactorEnabled: user.twoFactorEnabled };
};

// ─────────────────────────────────────────────────────────
// TWO-FACTOR AUTH OPERATIONS
// Uses Bearer token auth (same pattern as changePassword)
// ─────────────────────────────────────────────────────────

const enableTwoFactor = async (sessionToken: string, password: string) => {
  const result = await (auth.api as any).enableTwoFactor({
    body: { password },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
  return result;
};

const verifyTOTP = async (sessionToken: string, code: string) => {
  const result = await (auth.api as any).verifyTOTP({
    body: { code },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
  return result;
};

const disableTwoFactor = async (sessionToken: string, password: string) => {
  const result = await (auth.api as any).disableTwoFactor({
    body: { password },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
  return result;
};

// ─────────────────────────────────────────────────────────
// API KEY MANAGEMENT
// ─────────────────────────────────────────────────────────

type StoredApiKey = {
  id: string;
  label: string;
  keyPrefix: string; // first 8 chars for display
  keyHash: string;
  createdAt: string;
  lastUsedAt: string | null;
};

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

const getApiKeys = async (userId: string): Promise<StoredApiKey[]> => {
  const settings = await prisma.userAccountSettings.findUnique({
    where: { userId },
  });
  if (!settings) return [];
  const priv = settings.privacy as Record<string, unknown> | null;
  const keys = (priv?.apiKeys ?? []) as StoredApiKey[];
  return Array.isArray(keys) ? keys : [];
};

const generateApiKey = async (
  userId: string,
  label: string
): Promise<{ apiKey: string; storedKey: StoredApiKey }> => {
  if (!label || label.trim().length === 0) {
    throw new AppError(status.BAD_REQUEST, "A label is required for the API key.");
  }

  const rawKey = `nxra_${crypto.randomBytes(32).toString("hex")}`;
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12);
  const id = crypto.randomUUID();

  const storedKey: StoredApiKey = {
    id,
    label: label.trim(),
    keyPrefix,
    keyHash,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
  };

  // Get existing keys
  const existingKeys = await getApiKeys(userId);
  if (existingKeys.length >= 5) {
    throw new AppError(status.BAD_REQUEST, "Maximum 5 API keys allowed. Revoke an existing key first.");
  }

  const updatedKeys = [...existingKeys, storedKey];

  // Get existing privacy settings to preserve other fields
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const existingPrivacy = (settings?.privacy ?? {}) as Record<string, unknown>;

  await prisma.userAccountSettings.upsert({
    where: { userId },
    create: { userId, privacy: { ...existingPrivacy, apiKeys: updatedKeys } },
    update: { privacy: { ...existingPrivacy, apiKeys: updatedKeys } },
  });

  return { apiKey: rawKey, storedKey };
};

const deleteApiKey = async (userId: string, keyId: string) => {
  const existingKeys = await getApiKeys(userId);
  const filtered = existingKeys.filter((k) => k.id !== keyId);
  if (filtered.length === existingKeys.length) {
    throw new AppError(status.NOT_FOUND, "API key not found.");
  }

  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const existingPrivacy = (settings?.privacy ?? {}) as Record<string, unknown>;

  await prisma.userAccountSettings.update({
    where: { userId },
    data: { privacy: { ...existingPrivacy, apiKeys: filtered } },
  });

  return { deleted: true };
};

const revokeAllApiKeys = async (userId: string) => {
  const settings = await prisma.userAccountSettings.findUnique({ where: { userId } });
  const existingPrivacy = (settings?.privacy ?? {}) as Record<string, unknown>;

  await prisma.userAccountSettings.update({
    where: { userId },
    data: { privacy: { ...existingPrivacy, apiKeys: [] } },
  });

  return { revoked: true };
};

export const settingsService = {
  getAccount,
  updateAccount,
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
  deactivateAccount,
  deleteAccount,
  exportData,
  exportDataPDF,
  getTwoFactorStatus,
  enableTwoFactor,
  verifyTOTP,
  disableTwoFactor,
  getApiKeys,
  generateApiKey,
  deleteApiKey,
  revokeAllApiKeys,
};

