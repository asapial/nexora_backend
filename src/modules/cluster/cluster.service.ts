import { envVars } from "../../config/env";
import { Cluster, MemberSubtype } from "../../generated/prisma/client";
import { Role } from "../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../utils/emailSender";
import { generatePassword } from "../../utils/generatePassword";
import { AddMembersResult, ClusterHealthBreakdown, iCreateCluster } from "./cluster.type";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";



const createCluster = async (clusterPayload: iCreateCluster, teacherUserId: string) => {

  const { name, slug, description, batchTag, emails = [] } = clusterPayload;

  const result: AddMembersResult = {
    added: [],
    invited: [],
    alreadyMember: [],
  };

  const existingSlug = await prisma.cluster.findUnique({
    where: { slug },
  });

  if (existingSlug) {
    throw new AppError(status.CONFLICT, "This slug is already taken — choose a different one");
  }

  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  })

  if (!teacherProfile) {
    throw new AppError(status.CONTINUE, "Teacher is not found");

  }

  const teacherId = teacherProfile.id;

  // ── Step 1: Transaction — cluster + teacher member create ──────────────
  const { cluster } = await prisma.$transaction(async (tx) => {

    const cluster = await tx.cluster.create({
      data: {
        name,
        slug,
        teacherId,
        ...(description && { description }),
        ...(batchTag && { batchTag }),

      },
    });


    // await tx.clusterMember.create({
    //   data: {
    //     clusterId: cluster.id,
    //     userId: teacherId
    //   },
    // });

    return { cluster };
  });

  // ── Step 2: emails process — transaction এর বাইরে ─────────────────────

  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true },
      });

      let studentUserId: string;

      if (existingUser) {
        // ── Existing user ──────────────────────────────────────────────
        const studentProfile = await prisma.studentProfile.upsert({
          where: { userId: existingUser.id },
          create: { userId: existingUser.id },
          update: {},
        });

        studentUserId = studentProfile.userId;

        const existingMembership = await prisma.clusterMember.findUnique({
          where: {
            clusterId_userId: { clusterId: cluster.id, userId: studentUserId },
          },
        });

        if (existingMembership) {
          result.alreadyMember.push(email);
          continue;
        }

        await prisma.clusterMember.create({
          data: { clusterId: cluster.id, userId: studentUserId, studentProfileId: studentProfile.id },
        });

        await sendEmail({
          to: email,
          subject: `You've been added to ${cluster.name} on Nexora`,
          templateName: "clusterWelcomeBack",
          templateData: {
            name: existingUser.name || email.split("@")[0],
            email,
            clusterName: cluster.name,
            loginUrl: `${envVars.FRONTEND_URL}/login`,
          },
        });

        result.added.push(email);

      } else {
        // ── New user ───────────────────────────────────────────────────
        const plainPassword = generatePassword(12);

        const newUser = await auth.api.signUpEmail({
          body: {
            name: email.split("@")[0]!,
            email,
            password: plainPassword,
          },
        });


        await prisma.$transaction(async (tx) => {
          const studentProfile = await tx.studentProfile.create({
            data: { userId: newUser.user.id },
          });

          await tx.clusterMember.create({
            data: { clusterId: cluster.id, userId: newUser.user.id, studentProfileId: studentProfile.id },
          });
        });

        studentUserId = newUser.user.id;

        await sendEmail({
          to: email,
          subject: `You've been added to ${cluster.name} on Nexora`,
          templateName: "sendCredentialEmail",
          templateData: {
            email,
            password: plainPassword,
            clusterName: cluster.name,
            loginUrl: `${envVars.FRONTEND_URL}/login`,
          },
        });

        result.invited.push(email);
      }

    } catch (err) {

      console.error(`Failed to process email ${email}:`, err);
    }
  }

  return {
    cluster,
    members: result,
  };
};


const getCluster = async (teacherUserId: string, userRole: string) => {

  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  })

  if (!teacherProfile) {
    throw new AppError(status.CONTINUE, "Teacher is not found");

  }

  const teacherId = teacherProfile.id;

  if (userRole === Role.TEACHER) {
    return await prisma.cluster.findMany(
      {
        where: {
          teacherId
        },
        include: {
          _count: {
            select: {
              members: true,
              sessions: true,
            }
          }
        }
      }
    );
  } else if (userRole === Role.ADMIN) {
    return await prisma.cluster.findMany({
      include: {
        _count: {
          select: {
            members: true,
            sessions: true,
          }
        }
      }
    });
  }
};

const getClusterById = async (
  teacherUserId: string,
  userRole: string,
  id: string
) => {

  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      userId: teacherUserId
    }
  })

  if (!teacherProfile) {
    throw new AppError(status.CONTINUE, "Teacher is not found");

  }

  const teacherId = teacherProfile.id;

  if (userRole === Role.TEACHER) {
    const clusterData = await prisma.cluster.findFirst(
      {
        where: {
          teacherId,
          id
        },
        include: {
          members: {
            select: {
              clusterId: true,
              userId: true,
              subtype: true,
              joinedAt: true,
              studentProfileId: true,
              user: {
                select: {
                  name: true,
                  email: true
                }
              }

            }
          }
        }
      }
    );

    // console.log("cluster data :", clusterData);
    return clusterData;
  } else if (userRole === Role.ADMIN) {
    return await prisma.cluster.findMany(
      {
        where: {
          id
        },
        include: {
          members: {
            select: {
              clusterId: true,
              userId: true,
              subtype: true,
              joinedAt: true,
              user: {
                select: {
                  email: true
                }
              }

            }
          }
        }
      }
    );
  }
};

const patchClusterById = async (id: string, data: Cluster) => {
  return await prisma.cluster.update({ where: { id }, data });
};

const deleteClusterById = async (id: string) => {
  return await prisma.cluster.delete({ where: { id } });
};

const addedClusterMemberByEmail = async (
  clusterId: string,
  emails: string[]
) => {
  const result: AddMembersResult = {
    added: [],
    invited: [],
    alreadyMember: [],
  };

  const cluster = await prisma.cluster.findUniqueOrThrow({
    where: { id: clusterId },
    select: { id: true, name: true },
  });

  for (const rawEmail of emails) {
    const email = rawEmail.trim().toLowerCase();
    if (!email) continue;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    let studentUserId: string;

    if (existingUser) {
      // ── User already registered — upsert StudentProfile (may not exist yet) ──
      const studentProfile = await prisma.studentProfile.upsert({
        where: { userId: existingUser.id },
        create: { userId: existingUser.id },
        update: {},
        // select: { userId: true },
      });

      studentUserId = studentProfile.userId;
      const studentProfileId = studentProfile.id;

      // Check membership first — no email if they're already in
      const existingMembership = await prisma.clusterMember.findUnique({
        where: { clusterId_userId: { clusterId, userId: studentUserId } },
      });

      if (existingMembership) {
        result.alreadyMember.push(email);
        continue;
      }

      // Not yet a member — add and notify with welcome-back email
      await prisma.clusterMember.create({
        data: { clusterId, userId: studentUserId, studentProfileId: studentProfileId },
      });

      await sendEmail({
        to: email,
        subject: `You've been added to ${cluster.name} on Nexora`,
        templateName: "clusterWelcomeBack",
        templateData: {
          name: existingUser.name || email.split("@")[0],
          email,
          clusterName: cluster.name,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.added.push(email);

    } else {
      // ── Brand new user — create account + profile + send credentials ──────
      const plainPassword = generatePassword(12);

      const newUser = await auth.api.signUpEmail({
        body: {
          name: email.split("@")[0] as string,
          email,
          password: plainPassword,
        },
      });

      const newStudent = await prisma.studentProfile.create({
        data: { userId: newUser.user.id },
      });

      studentUserId = newUser.user.id;

      await prisma.clusterMember.create({
        data: { clusterId, userId: studentUserId, studentProfileId: newStudent.id },
      });

      await sendEmail({
        to: email,
        subject: `You've been added to ${cluster.name} on Nexora`,
        templateName: "sendCredentialEmail",
        templateData: {
          email,
          password: plainPassword,
          clusterName: cluster.name,
          loginUrl: `${envVars.FRONTEND_URL}/login`,
        },
      });

      result.invited.push(email);
    }
  }

  return result;
};

const updateMemberSubtype = async (
  clusterId: string,
  userId: string,
  subtype: MemberSubtype
) => {
  // Verify cluster exists
  const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } });
  if (!cluster) {
    throw new AppError(status.NOT_FOUND, "Cluster not found.");
  }

  // Verify membership exists
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } },
  });
  if (!membership) {
    throw new AppError(
      status.NOT_FOUND,
      "This user is not a member of the cluster."
    );
  }

  const updated = await prisma.clusterMember.update({
    where: { clusterId_userId: { clusterId, userId } },
    data: { subtype },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return updated;
};

const removeMember = async (clusterId: string, userId: string) => {
  // Verify cluster exists
  const cluster = await prisma.cluster.findUnique({ where: { id: clusterId } });
  if (!cluster) {
    throw new AppError(status.NOT_FOUND, "Cluster not found.");
  }

  // Verify membership exists
  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } },
  });
  if (!membership) {
    throw new AppError(
      status.NOT_FOUND,
      "This user is not a member of the cluster. Nothing to remove."
    );
  }

  // Soft-delete hint: if they want archive instead, use PATCH to set subtype ALUMNI.
  await prisma.clusterMember.delete({
    where: { clusterId_userId: { clusterId, userId } },
  });

  return { removed: true, userId, clusterId };
};

const resendMemberCredentials = async (
  clusterId: string,
  userId: string,
  sessionToken: string
) => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, name: true },
  });
  if (!cluster) throw new AppError(status.NOT_FOUND, "Cluster not found.");

  const membership = await prisma.clusterMember.findUnique({
    where: { clusterId_userId: { clusterId, userId } },
  });
  if (!membership)
    throw new AppError(status.NOT_FOUND, "This user is not a member of the cluster.");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) throw new AppError(status.NOT_FOUND, "User account not found.");

  const newPassword = generatePassword(12);

  // ✅ Use setUserPassword — no currentPassword check, targets the member not the caller
  await auth.api.setPassword({
    body: {
      newPassword,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  await prisma.user.update({
    where: { id: userId },
    data: { needPasswordChange: true },
  });

  await sendEmail({
    to: user.email,
    subject: `Your new credentials for ${cluster.name} on Nexora`,
    templateName: "sendCredentialEmail",
    templateData: {
      email: user.email,
      password: newPassword,
      clusterName: cluster.name,
      loginUrl: `${envVars.FRONTEND_URL}/login`,
    },
  });

  return { emailSentTo: user.email, userId: user.id };
};

const getClusterHealth = async (clusterId: string): Promise<ClusterHealthBreakdown> => {
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    include: {
      members: {
        select: { userId: true },
      },
      sessions: {
        select: {
          id: true,
          scheduledAt: true,
          tasks: {
            select: {
              id: true,
              status: true,
              homework: true,
              deadline: true,
              submission: { select: { id: true } },
            },
          },
          attendance: {
            select: { studentProfileId: true, status: true },
          },
        },
      },
    },
  });

  if (!cluster) {
    throw new AppError(status.NOT_FOUND, "Cluster not found.");
  }

  const totalMembers = cluster.members.length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // ── Task submission rate ─────────────────────────────────────────────────
  const allTasks = cluster.sessions.flatMap((s) => s.tasks);
  const submittedTasks = allTasks.filter(
    (t) => t.submission !== null || t.status === "SUBMITTED" || t.status === "REVIEWED"
  );
  const taskSubmissionRate =
    allTasks.length > 0
      ? Math.round((submittedTasks.length / allTasks.length) * 100)
      : 100; // No tasks = full score (nothing to fail)

  // ── Attendance rate ──────────────────────────────────────────────────────
  const allAttendance = cluster.sessions.flatMap((s) => s.attendance);
  const presentCount = allAttendance.filter(
    (a) => a.status === "PRESENT" || a.status === "EXCUSED"
  ).length;
  const attendanceRate =
    allAttendance.length > 0
      ? Math.round((presentCount / allAttendance.length) * 100)
      : 100;

  // ── Homework completion rate ─────────────────────────────────────────────
  const tasksWithHomework = allTasks.filter((t) => t.homework && t.homework.trim() !== "");
  const completedHomework = tasksWithHomework.filter(
    (t) => t.status === "SUBMITTED" || t.status === "REVIEWED"
  ).length;
  const homeworkCompletionRate =
    tasksWithHomework.length > 0
      ? Math.round((completedHomework / tasksWithHomework.length) * 100)
      : 100;

  // ── Recent activity score (sessions in last 30 days) ────────────────────
  const recentSessions = cluster.sessions.filter(
    (s) => new Date(s.scheduledAt) >= thirtyDaysAgo
  );
  // Heuristic: ≥2 sessions per month = 100, 1 = 50, 0 = 0
  const recentActivityScore =
    recentSessions.length >= 2
      ? 100
      : recentSessions.length === 1
        ? 50
        : 0;

  // ── Composite score ──────────────────────────────────────────────────────
  const score = Math.round(
    taskSubmissionRate * 0.35 +
    attendanceRate * 0.35 +
    homeworkCompletionRate * 0.15 +
    recentActivityScore * 0.15
  );

  const colour: "green" | "amber" | "red" =
    score >= 70 ? "green" : score >= 40 ? "amber" : "red";

  return {
    score,
    colour,
    taskSubmissionRate,
    attendanceRate,
    homeworkCompletionRate,
    recentActivityScore,
  };
};

const addCoTeacher = async (
  clusterId: string,
  requestingUserId: string,
  coTeacherUserId: string,
  canEdit: boolean
) => {
  // Verify cluster exists and requesting user is the owner
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, name: true, teacherId: true },
  });
  if (!cluster) {
    throw new AppError(status.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacherId !== requestingUserId) {
    throw new AppError(
      status.FORBIDDEN,
      "Only the cluster owner can invite co-teachers."
    );
  }

  // Verify target user exists and is a TEACHER
  const targetUser = await prisma.user.findUnique({
    where: { id: coTeacherUserId },
    select: { id: true, role: true, name: true, email: true },
  });
  if (!targetUser) {
    throw new AppError(status.NOT_FOUND, "Target user not found.");
  }
  if (targetUser.role !== Role.TEACHER) {
    throw new AppError(
      status.BAD_REQUEST,
      "The specified user is not a registered teacher."
    );
  }

  // Prevent adding the cluster owner as co-teacher
  if (coTeacherUserId === cluster.teacherId) {
    throw new AppError(
      status.BAD_REQUEST,
      "The cluster owner cannot be added as a co-teacher."
    );
  }

  // Check if already a co-teacher
  const existing = await prisma.coTeacher.findFirst({
    where: { clusterId, userId: coTeacherUserId },
  });
  if (existing) {
    throw new AppError(
      status.CONFLICT,
      "This teacher is already a co-supervisor of the cluster."
    );
  }

  const coTeacher = await prisma.coTeacher.create({
    data: {
      clusterId,
      userId: coTeacherUserId,
      canEdit,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return coTeacher;
};

const removeCoTeacher = async (
  clusterId: string,
  requestingUserId: string,
  coTeacherUserId: string
) => {
  // Verify cluster exists and requesting user is the owner
  const cluster = await prisma.cluster.findUnique({
    where: { id: clusterId },
    select: { id: true, teacherId: true },
  });
  if (!cluster) {
    throw new AppError(status.NOT_FOUND, "Cluster not found.");
  }
  if (cluster.teacherId !== requestingUserId) {
    throw new AppError(
      status.FORBIDDEN,
      "Only the cluster owner can revoke co-teacher access."
    );
  }

  // Find the co-teacher record
  const coTeacher = await prisma.coTeacher.findFirst({
    where: { clusterId, userId: coTeacherUserId },
  });
  if (!coTeacher) {
    throw new AppError(
      status.NOT_FOUND,
      "This teacher is not a co-supervisor of the cluster."
    );
  }

  await prisma.coTeacher.delete({ where: { id: coTeacher.id } });

  return { removed: true, userId: coTeacherUserId, clusterId };
};

export const clusterService = {
  createCluster,
  getCluster,
  getClusterById,
  patchClusterById,
  deleteClusterById,
  addedClusterMemberByEmail,
  updateMemberSubtype,
  removeMember,
  resendMemberCredentials,
  getClusterHealth,
  addCoTeacher,
  removeCoTeacher,
};