import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { generatePassword } from "../../utils/generatePassword";
import { sendEmail } from "../../utils/emailSender";
import { envVars } from "../../config/env";
import { Role } from "../../generated/prisma/enums";

const createTeacher = async (emails: string[]) => {
  const result = {
    newAccountsCreated: [] as string[],
    existingUpgraded: [] as string[],
    alreadyRegisteredAsTeacher: [] as string[],
  };

  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { teacherProfile: true },
    });

    if (!existingUser) {
      // 1. User is not registered at all
      const plainPassword = generatePassword(12);

      const newUser = await auth.api.signUpEmail({
        body: {
          name: email.split("@")[0] as string,
          email,
          password: plainPassword,
        },
      });

      // Update role to TEACHER
      const user = await prisma.user.update({
        where: { id: newUser.user.id },
        data: { role: Role.TEACHER, needPasswordChange: true },
      });

      // Create TeacherProfile
      await prisma.teacherProfile.create({
        data: { userId: user.id },
      });

      // Send Welcome Email with Password
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Teacher Account Created`,
        templateName: "teacherWelcome",
        templateData: {
          email,
          password: plainPassword,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.newAccountsCreated.push(email);
    } else if (!existingUser.teacherProfile) {
      // 2. User exists but is not a teacher
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: Role.TEACHER },
      });

      await prisma.teacherProfile.create({
        data: { userId: existingUser.id },
      });

      // Send Welcome Email without password
      await sendEmail({
        to: email,
        subject: `Welcome to Nexora - Promoted to Teacher`,
        templateName: "teacherWelcome",
        templateData: {
          email,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.existingUpgraded.push(email);
    } else {
      // 3. User is already a Teacher
      result.alreadyRegisteredAsTeacher.push(email);
    }
  }

  return result;
};

export const adminService = {
  createTeacher,
};