/* ── helpers ──────────────────────────────────────────────────────────────── */

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

export const findSessionOrThrow = async (sessionId: string) => {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });
  if (!session) throw new AppError(status.NOT_FOUND, "Session not found.");
  return session;
};

export const getTeacherProfileId = async (userId: string): Promise<string> => {
  const profile = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new AppError(
      status.FORBIDDEN,
      "Only teachers with an active profile can manage sessions."
    );
  }
  return profile.id;
};

export const assertSessionTeacher = async (sessionId: string, userId: string) => {
  const session = await findSessionOrThrow(sessionId);
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!teacherProfile) {
    throw new AppError(status.FORBIDDEN, "Teacher profile not found.");
  }
  const isOwner = session.createdById === teacherProfile.id;
  if (!isOwner) {
    const isCoTeacher = await prisma.coTeacher.findFirst({
      where: { clusterId: session.clusterId, userId },
    });
    if (!isCoTeacher) {
      throw new AppError(
        status.FORBIDDEN,
        "You do not have permission to manage this session."
      );
    }
  }
  return session;
};

/* ── resolve studentId (userId) → StudentProfile.id ──────────────────────── */
export const resolveStudentProfileId = async (userId: string): Promise<string> => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) throw new AppError(status.NOT_FOUND, `StudentProfile not found for user ${userId}.`);
  return profile.id;
};