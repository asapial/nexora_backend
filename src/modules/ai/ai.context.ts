import { prisma } from "../../lib/prisma";

/**
 * Build a concise, human-readable context string for the AI chat.
 * Uses correct Prisma relations per role and returns structured text,
 * not raw JSON, to reduce token usage and improve response quality.
 */
export async function buildContext(userId: string, role: string): Promise<string> {
  try {
    if (role === "STUDENT") {
      return await buildStudentContext(userId);
    }
    if (role === "TEACHER") {
      return await buildTeacherContext(userId);
    }
    if (role === "ADMIN") {
      return await buildAdminContext();
    }
    return "No data available.";
  } catch (err) {
    console.error("buildContext error:", err);
    return "Could not load user data.";
  }
}

// ── Student Context ───────────────────────────────────────────────────────────
async function buildStudentContext(userId: string): Promise<string> {
  // Single query for student profile with all related data
  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { name: true, email: true } },
      tasks: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          StudySession: { select: { title: true, scheduledAt: true } },
          submission: { select: { submittedAt: true } },
        },
      },
      taskSubmission: {
        orderBy: { submittedAt: "desc" },
        take: 10,
        include: { task: { select: { title: true, status: true, score: true } } },
      },
      attendances: {
        orderBy: { markedAt: "desc" },
        take: 10,
        include: {
          session: { select: { title: true, scheduledAt: true } },
        },
      },
      goals: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!student) return "Student profile not found.";

  // Separate queries for data not directly on StudentProfile
  const [enrollments, memberships] = await Promise.all([
    // Course enrollments (on User model, not StudentProfile)
    prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            status: true,
            isFree: true,
            price: true,
            teacher: {
              select: { user: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 10,
    }),

    // Cluster memberships (students connect via ClusterMember)
    prisma.clusterMember.findMany({
      where: { userId },
      include: {
        cluster: {
          include: {
            teacher: {
              include: { user: { select: { name: true, email: true } } },
            },
            sessions: {
              orderBy: { scheduledAt: "desc" },
              take: 5,
              select: {
                title: true,
                scheduledAt: true,
                status: true,
                location: true,
                durationMins: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const lines: string[] = [];
  lines.push(`=== STUDENT PROFILE ===`);
  lines.push(`Name: ${student.user.name}`);
  lines.push(`Email: ${student.user.email}`);
  if (student.institution) lines.push(`Institution: ${student.institution}`);
  if (student.department) lines.push(`Department: ${student.department}`);
  if (student.batch) lines.push(`Batch: ${student.batch}`);
  if (student.skills.length > 0) lines.push(`Skills: ${student.skills.join(", ")}`);

  // Clusters
  if (memberships.length > 0) {
    lines.push(`\n=== MY CLUSTERS (${memberships.length}) ===`);
    for (const m of memberships) {
      const c = m.cluster;
      lines.push(`- Cluster: "${c.name}" | Teacher: ${c.teacher.user.name} (${c.teacher.user.email})`);
      if (c.sessions.length > 0) {
        lines.push(`  Upcoming/Recent Sessions:`);
        for (const s of c.sessions) {
          lines.push(`    • ${s.title} — ${s.scheduledAt.toISOString().split("T")[0]} (${s.status})`);
        }
      }
    }
  } else {
    lines.push(`\nNot a member of any cluster yet.`);
  }

  // Enrollments
  if (enrollments.length > 0) {
    lines.push(`\n=== MY COURSE ENROLLMENTS (${enrollments.length}) ===`);
    for (const e of enrollments) {
      const c = e.course;
      lines.push(`- "${c.title}" by ${c.teacher.user.name} | Progress: ${e.progress}% | Status: ${c.status}${c.isFree ? "" : ` | Price: $${c.price}`}`);
      if (e.completedAt) lines.push(`  Completed: ${e.completedAt.toISOString().split("T")[0]}`);
    }
  } else {
    lines.push(`\nNo course enrollments yet.`);
  }

  // Tasks
  if (student.tasks.length > 0) {
    lines.push(`\n=== MY TASKS (${student.tasks.length} recent) ===`);
    for (const t of student.tasks) {
      const submitted = t.submission ? `Submitted: ${t.submission.submittedAt.toISOString().split("T")[0]}` : "Not submitted";
      lines.push(`- "${t.title}" | Status: ${t.status} | Score: ${t.score ?? "N/A"} | ${submitted}`);
      if (t.deadline) lines.push(`  Deadline: ${t.deadline.toISOString().split("T")[0]}`);
    }
  }

  // Attendance
  if (student.attendances.length > 0) {
    lines.push(`\n=== RECENT ATTENDANCE (${student.attendances.length}) ===`);
    for (const a of student.attendances) {
      lines.push(`- ${a.session.title} (${a.markedAt.toISOString().split("T")[0]}) — ${a.status}`);
    }
  }

  // Goals
  if (student.goals.length > 0) {
    lines.push(`\n=== MY GOALS (${student.goals.length}) ===`);
    for (const g of student.goals) {
      lines.push(`- "${g.title}" | Status: ${g.kanbanStatus} | Achieved: ${g.isAchieved ? "Yes" : "No"}`);
    }
  }

  return lines.join("\n");
}

// ── Teacher Context ───────────────────────────────────────────────────────────
async function buildTeacherContext(userId: string): Promise<string> {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { name: true, email: true } },
      teacherClusters: {
        where: { isActive: true },
        include: {
          members: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
          sessions: {
            orderBy: { scheduledAt: "desc" },
            take: 5,
            select: {
              title: true,
              scheduledAt: true,
              status: true,
              durationMins: true,
              tasks: {
                select: { title: true, status: true },
                take: 5,
              },
            },
          },
        },
      },
      courses: {
        select: {
          title: true,
          status: true,
          price: true,
          isFree: true,
          isFeatured: true,
          priceApprovalStatus: true,
          enrollments: {
            select: { userId: true, progress: true },
          },
        },
      },
      revenueTransactions: {
        orderBy: { transactedAt: "desc" },
        take: 5,
        select: {
          totalAmount: true,
          teacherEarning: true,
          transactedAt: true,
        },
      },
    },
  });

  if (!teacher) return "Teacher profile not found.";

  const lines: string[] = [];
  lines.push(`=== TEACHER PROFILE ===`);
  lines.push(`Name: ${teacher.user.name}`);
  lines.push(`Email: ${teacher.user.email}`);
  if (teacher.designation) lines.push(`Designation: ${teacher.designation}`);
  if (teacher.department) lines.push(`Department: ${teacher.department}`);
  if (teacher.institution) lines.push(`Institution: ${teacher.institution}`);
  if (teacher.specialization) lines.push(`Specialization: ${teacher.specialization}`);
  lines.push(`Verified: ${teacher.isVerified ? "Yes" : "No"}`);

  // Clusters
  const clusters = teacher.teacherClusters;
  if (clusters.length > 0) {
    lines.push(`\n=== MY CLUSTERS (${clusters.length}) ===`);
    for (const c of clusters) {
      lines.push(`- "${c.name}" | ${c.members.length} student(s) | Health: ${c.healthStatus}`);
      if (c.members.length > 0) {
        lines.push(`  Students: ${c.members.map(m => m.user.name).join(", ")}`);
      }
      if (c.sessions.length > 0) {
        lines.push(`  Recent Sessions:`);
        for (const s of c.sessions) {
          const taskSummary = s.tasks.length > 0
            ? ` | Tasks: ${s.tasks.map(t => `${t.title}(${t.status})`).join(", ")}`
            : "";
          lines.push(`    • ${s.title} — ${s.scheduledAt.toISOString().split("T")[0]} (${s.status})${taskSummary}`);
        }
      }
    }
  } else {
    lines.push(`\nNo active clusters.`);
  }

  // Courses
  if (teacher.courses.length > 0) {
    lines.push(`\n=== MY COURSES (${teacher.courses.length}) ===`);
    for (const c of teacher.courses) {
      const enrollCount = c.enrollments.length;
      const avgProgress = enrollCount > 0
        ? (c.enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollCount).toFixed(0)
        : 0;
      lines.push(`- "${c.title}" | Status: ${c.status} | ${c.isFree ? "Free" : `$${c.price}`} | Enrollments: ${enrollCount} | Avg Progress: ${avgProgress}%${c.isFeatured ? " | ⭐ Featured" : ""}`);
    }
  }

  // Revenue
  if (teacher.revenueTransactions.length > 0) {
    const totalRevenue = teacher.revenueTransactions.reduce((s, t) => s + t.teacherEarning, 0);
    lines.push(`\n=== RECENT REVENUE ===`);
    lines.push(`Total (last ${teacher.revenueTransactions.length} txns): $${totalRevenue.toFixed(2)}`);
  }

  return lines.join("\n");
}

// ── Admin Context ─────────────────────────────────────────────────────────────
async function buildAdminContext(): Promise<string> {
  const [
    totalUsers, totalTeachers, totalStudents, totalAdmins,
    totalCourses, activeCourses, totalClusters, activeClusters,
    totalEnrollments,
    pendingCourses, pendingPriceRequests,
    recentUsers, recentCourses,
    recentTickets,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.teacherProfile.count(),
    prisma.studentProfile.count(),
    prisma.adminProfile.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.cluster.count(),
    prisma.cluster.count({ where: { isActive: true } }),
    prisma.courseEnrollment.count(),
    prisma.course.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.coursePriceRequest.count({ where: { status: "PENDING" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { name: true, email: true, role: true, createdAt: true, isActive: true },
    }),
    prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        title: true,
        status: true,
        price: true,
        isFree: true,
        teacher: { select: { user: { select: { name: true } } } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { subject: true, status: true, createdAt: true },
    }).catch(() => []),
  ]);

  const lines: string[] = [];
  lines.push(`=== PLATFORM OVERVIEW ===`);
  lines.push(`Total Users: ${totalUsers} (Students: ${totalStudents}, Teachers: ${totalTeachers}, Admins: ${totalAdmins})`);
  lines.push(`Courses: ${totalCourses} total, ${activeCourses} published`);
  lines.push(`Clusters: ${totalClusters} total, ${activeClusters} active`);
  lines.push(`Total Enrollments: ${totalEnrollments}`);

  if (pendingCourses > 0 || pendingPriceRequests > 0) {
    lines.push(`\n=== PENDING ACTIONS ===`);
    if (pendingCourses > 0) lines.push(`- ${pendingCourses} course(s) pending approval`);
    if (pendingPriceRequests > 0) lines.push(`- ${pendingPriceRequests} price request(s) pending review`);
  }

  if (recentUsers.length > 0) {
    lines.push(`\n=== RECENT USERS (last ${recentUsers.length}) ===`);
    for (const u of recentUsers) {
      lines.push(`- ${u.name} (${u.email}) | Role: ${u.role} | Joined: ${u.createdAt.toISOString().split("T")[0]} | Active: ${u.isActive}`);
    }
  }

  if (recentCourses.length > 0) {
    lines.push(`\n=== RECENT COURSES (last ${recentCourses.length}) ===`);
    for (const c of recentCourses) {
      lines.push(`- "${c.title}" by ${c.teacher.user.name} | Status: ${c.status} | Enrollments: ${c._count.enrollments}${c.isFree ? "" : ` | $${c.price}`}`);
    }
  }

  if (recentTickets.length > 0) {
    lines.push(`\n=== RECENT SUPPORT TICKETS ===`);
    for (const t of recentTickets) {
      lines.push(`- "${t.subject}" | Status: ${t.status}`);
    }
  }

  return lines.join("\n");
}