/**
 * Creates or updates the demo teacher and demo student accounts.
 *
 * Credentials are read only from the backend environment:
 *   DEMO_TEACHER_EMAIL, DEMO_TEACHER_PASSWORD
 *   DEMO_STUDENT_EMAIL, DEMO_STUDENT_PASSWORD
 *
 * Run with: npm run seed:demo-users
 */

import "dotenv/config";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";
import { MemberSubtype, Role } from "../generated/prisma/enums.js";

const DEMO_USERS = [
  {
    name: "Nexora Demo Teacher",
    email: process.env.DEMO_TEACHER_EMAIL,
    password: process.env.DEMO_TEACHER_PASSWORD,
    role: Role.TEACHER,
  },
  {
    name: "Nexora Demo Student",
    email: process.env.DEMO_STUDENT_EMAIL,
    password: process.env.DEMO_STUDENT_PASSWORD,
    role: Role.STUDENT,
  },
] as const;

function requireCredentials(seed: (typeof DEMO_USERS)[number]) {
  if (!seed.email || !seed.password) {
    throw new Error(
      `${seed.role} demo credentials are missing. Configure DEMO_${seed.role}_EMAIL and DEMO_${seed.role}_PASSWORD.`,
    );
  }

  return {
    email: seed.email.trim().toLowerCase(),
    password: seed.password,
  };
}

async function ensureDemoUser(seed: (typeof DEMO_USERS)[number]) {
  const { email, password } = requireCredentials(seed);
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  let userId: string;

  if (!existingUser) {
    const result = await auth.api.signUpEmail({
      body: { name: seed.name, email, password },
    });
    userId = result.user.id;
    console.log(`Created ${seed.role.toLowerCase()} account: ${email}`);
  } else {
    userId = existingUser.id;
    console.log(`Updating existing ${seed.role.toLowerCase()} account: ${email}`);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: seed.name,
      role: seed.role,
      emailVerified: true,
      isActive: true,
      isDeleted: false,
      needPasswordChange: false,
      oneTimePassword: null,
      oneTimeExpiry: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
    },
  });

  await prisma.twoFactor.deleteMany({ where: { userId } });

  if (seed.role === Role.TEACHER) {
    await prisma.teacherProfile.upsert({
      where: { userId },
      update: {
        designation: "Senior Software Engineering Instructor",
        department: "Computer Science and Engineering",
        institution: "Nexora Learning Academy",
        bio: "An experienced educator and full-stack engineer focused on practical, project-based learning and helping students build production-ready software.",
        website: "https://nexora-learning.vercel.app",
        linkedinUrl: "https://www.linkedin.com/in/nexora-demo-teacher",
        specialization: "Full-Stack Web Development, Cloud Engineering, and Software Architecture",
        experience: 9,
        researchInterests: [
          "Online Learning",
          "Software Engineering Education",
          "Cloud Architecture",
          "Developer Productivity",
        ],
        googleScholarUrl: "https://scholar.google.com",
        officeHours: "Sunday and Tuesday, 7:00 PM - 9:00 PM",
        isVerified: true,
        verifiedAt: new Date(),
        rejectedAt: null,
        rejectReason: null,
      },
      create: {
        userId,
        designation: "Senior Software Engineering Instructor",
        department: "Computer Science and Engineering",
        institution: "Nexora Learning Academy",
        bio: "An experienced educator and full-stack engineer focused on practical, project-based learning and helping students build production-ready software.",
        website: "https://nexora-learning.vercel.app",
        linkedinUrl: "https://www.linkedin.com/in/nexora-demo-teacher",
        specialization: "Full-Stack Web Development, Cloud Engineering, and Software Architecture",
        experience: 9,
        researchInterests: [
          "Online Learning",
          "Software Engineering Education",
          "Cloud Architecture",
          "Developer Productivity",
        ],
        googleScholarUrl: "https://scholar.google.com",
        officeHours: "Sunday and Tuesday, 7:00 PM - 9:00 PM",
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  } else {
    await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        studentType: MemberSubtype.RUNNING,
        phone: "+8801700000000",
        address: "Dhaka, Bangladesh",
        bio: "A motivated computer science student exploring full-stack development, data analysis, and collaborative learning.",
        nationality: "Bangladeshi",
        institution: "Nexora Learning Academy",
        department: "Computer Science and Engineering",
        batch: "Spring 2026",
        programme: "BSc in Computer Science and Engineering",
        cgpa: 3.78,
        enrollmentYear: "2023",
        expectedGraduation: "2027",
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL"],
        linkedinUrl: "https://www.linkedin.com/in/nexora-demo-student",
        githubUrl: "https://github.com/nexora-demo-student",
        website: "https://nexora-learning.vercel.app",
        portfolioUrl: "https://nexora-learning.vercel.app",
      },
      create: {
        userId,
        studentType: MemberSubtype.RUNNING,
        phone: "+8801700000000",
        address: "Dhaka, Bangladesh",
        bio: "A motivated computer science student exploring full-stack development, data analysis, and collaborative learning.",
        nationality: "Bangladeshi",
        institution: "Nexora Learning Academy",
        department: "Computer Science and Engineering",
        batch: "Spring 2026",
        programme: "BSc in Computer Science and Engineering",
        cgpa: 3.78,
        enrollmentYear: "2023",
        expectedGraduation: "2027",
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL"],
        linkedinUrl: "https://www.linkedin.com/in/nexora-demo-student",
        githubUrl: "https://github.com/nexora-demo-student",
        website: "https://nexora-learning.vercel.app",
        portfolioUrl: "https://nexora-learning.vercel.app",
      },
    });
  }

  return { userId, email, role: seed.role };
}

const IDS = {
  cluster: "demo-cluster-full-stack-2026",
  category: "demo-category-web-development",
  template: "demo-template-feature-build",
  rubric: "demo-rubric-production-feature",
  sessionCompleted: "demo-session-react-foundations",
  sessionUpcoming: "demo-session-api-security",
  sessionOngoing: "demo-session-project-clinic",
  resourceGuide: "demo-resource-typescript-guide",
  resourceChecklist: "demo-resource-api-checklist",
  announcement: "demo-announcement-capstone",
  studyGroup: "demo-study-group-builders",
  milestone: "demo-milestone-first-submission",
  badge: "demo-badge-first-submission",
  readingList: "demo-reading-list-full-stack",
  goalDone: "demo-goal-typescript-module",
  goalProgress: "demo-goal-capstone-api",
  goalTodo: "demo-goal-cloud-deployment",
  notificationTask: "demo-notification-task-reviewed",
  notificationSession: "demo-notification-session",
  courseFullStack: "demo-course-full-stack",
  courseData: "demo-course-data-analysis",
  enrollmentFullStack: "demo-enrollment-full-stack",
  enrollmentData: "demo-enrollment-data-analysis",
  certificate: "demo-certificate-data-analysis",
} as const;

const daysFromNow = (days: number, hour = 18) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

async function seedTeacherAndStudentData(teacherUserId: string, studentUserId: string) {
  const teacher = await prisma.teacherProfile.findUniqueOrThrow({ where: { userId: teacherUserId } });
  const student = await prisma.studentProfile.findUniqueOrThrow({ where: { userId: studentUserId } });

  await prisma.cluster.upsert({
    where: { slug: "full-stack-builders-spring-2026" },
    update: {
      name: "Full-Stack Builders",
      description: "A project-based learning cluster for building and shipping modern web applications.",
      batchTag: "Spring 2026",
      teacherId: teacher.id,
      healthScore: 92,
      healthStatus: "HEALTHY",
      isActive: true,
    },
    create: {
      id: IDS.cluster,
      slug: "full-stack-builders-spring-2026",
      name: "Full-Stack Builders",
      description: "A project-based learning cluster for building and shipping modern web applications.",
      batchTag: "Spring 2026",
      teacherId: teacher.id,
      healthScore: 92,
      healthStatus: "HEALTHY",
      isActive: true,
    },
  });

  await prisma.clusterMember.upsert({
    where: { clusterId_userId: { clusterId: IDS.cluster, userId: studentUserId } },
    update: { subtype: MemberSubtype.RUNNING, studentProfileId: student.id },
    create: {
      id: "demo-cluster-member-student",
      clusterId: IDS.cluster,
      userId: studentUserId,
      studentProfileId: student.id,
      subtype: MemberSubtype.RUNNING,
    },
  });

  await prisma.taskTemplate.upsert({
    where: { id: IDS.template },
    update: {
      teacherId: teacherUserId,
      teacherProfileId: teacher.id,
      title: "Production Feature Build",
      description: "Plan, implement, test, and document a production-ready feature.",
    },
    create: {
      id: IDS.template,
      teacherId: teacherUserId,
      teacherProfileId: teacher.id,
      title: "Production Feature Build",
      description: "Plan, implement, test, and document a production-ready feature.",
    },
  });

  await prisma.gradingRubric.upsert({
    where: { id: IDS.rubric },
    update: {
      teacherId: teacherUserId,
      name: "Production Feature Rubric",
      criteria: [
        { name: "Correctness", weight: 35, description: "The feature satisfies its requirements." },
        { name: "Code Quality", weight: 25, description: "The implementation is readable and maintainable." },
        { name: "Testing", weight: 25, description: "Critical behavior is covered by meaningful tests." },
        { name: "Documentation", weight: 15, description: "Decisions and usage are clearly documented." },
      ],
    },
    create: {
      id: IDS.rubric,
      teacherId: teacherUserId,
      name: "Production Feature Rubric",
      criteria: [
        { name: "Correctness", weight: 35, description: "The feature satisfies its requirements." },
        { name: "Code Quality", weight: 25, description: "The implementation is readable and maintainable." },
        { name: "Testing", weight: 25, description: "Critical behavior is covered by meaningful tests." },
        { name: "Documentation", weight: 15, description: "Decisions and usage are clearly documented." },
      ],
    },
  });

  const sessions = [
    {
      id: IDS.sessionCompleted,
      title: "React and TypeScript Foundations",
      description: "Build reliable components with TypeScript, composition, and accessible interaction patterns.",
      scheduledAt: daysFromNow(-7),
      status: "completed" as const,
      recordingUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      recordingNotes: "Reviewed component composition, state boundaries, and accessible forms.",
    },
    {
      id: IDS.sessionOngoing,
      title: "Capstone Project Clinic",
      description: "Live debugging and architecture review for student capstone projects.",
      scheduledAt: daysFromNow(0),
      status: "ongoing" as const,
      recordingUrl: null,
      recordingNotes: null,
    },
    {
      id: IDS.sessionUpcoming,
      title: "Secure API Design",
      description: "Design authenticated APIs with validation, authorization, and secure cookie sessions.",
      scheduledAt: daysFromNow(5),
      status: "upcoming" as const,
      recordingUrl: null,
      recordingNotes: null,
    },
  ];

  for (const session of sessions) {
    await prisma.studySession.upsert({
      where: { id: session.id },
      update: {
        clusterId: IDS.cluster,
        createdById: teacher.id,
        templateId: IDS.template,
        title: session.title,
        description: session.description,
        scheduledAt: session.scheduledAt,
        durationMins: 90,
        location: "Nexora Live Classroom",
        taskDeadline: daysFromNow(8),
        status: session.status,
        recordingUrl: session.recordingUrl,
        recordingNotes: session.recordingNotes,
      },
      create: {
        id: session.id,
        clusterId: IDS.cluster,
        createdById: teacher.id,
        templateId: IDS.template,
        title: session.title,
        description: session.description,
        scheduledAt: session.scheduledAt,
        durationMins: 90,
        location: "Nexora Live Classroom",
        taskDeadline: daysFromNow(8),
        status: session.status,
        recordingUrl: session.recordingUrl,
        recordingNotes: session.recordingNotes,
      },
    });
  }

  const agendaItems = [
    { id: "demo-agenda-1", startTime: "18:00", durationMins: 20, topic: "Architecture review", order: 0 },
    { id: "demo-agenda-2", startTime: "18:20", durationMins: 45, topic: "Guided implementation", order: 1 },
    { id: "demo-agenda-3", startTime: "19:05", durationMins: 25, topic: "Testing and Q&A", order: 2 },
  ];
  for (const item of agendaItems) {
    await prisma.studySessionAgenda.upsert({
      where: { id: item.id },
      update: { ...item, studySessionId: IDS.sessionUpcoming, presenter: "Nexora Demo Teacher" },
      create: { ...item, studySessionId: IDS.sessionUpcoming, presenter: "Nexora Demo Teacher" },
    });
  }

  await prisma.attendance.upsert({
    where: {
      studySessionId_studentProfileId: {
        studySessionId: IDS.sessionCompleted,
        studentProfileId: student.id,
      },
    },
    update: { status: "PRESENT", note: "Participated actively in the component design exercise." },
    create: {
      id: "demo-attendance-student",
      studySessionId: IDS.sessionCompleted,
      studentProfileId: student.id,
      status: "PRESENT",
      note: "Participated actively in the component design exercise.",
    },
  });
  await prisma.studySessionFeedback.upsert({
    where: {
      studySessionId_memberId: {
        studySessionId: IDS.sessionCompleted,
        memberId: studentUserId,
      },
    },
    update: {
      rating: 5,
      comment: "The live implementation exercise made the TypeScript patterns easy to apply.",
    },
    create: {
      id: "demo-session-feedback-student",
      studySessionId: IDS.sessionCompleted,
      memberId: studentUserId,
      rating: 5,
      comment: "The live implementation exercise made the TypeScript patterns easy to apply.",
    },
  });

  const tasks = [
    {
      id: "demo-task-reviewed",
      sessionId: IDS.sessionCompleted,
      title: "Build an Accessible Course Card",
      description: "Create a typed, responsive course card with keyboard-accessible interactions.",
      status: "REVIEWED" as const,
      score: "EXCELLENT" as const,
      finalScore: 94,
      reviewNote: "Excellent component structure and accessibility. Add one loading-state test.",
      deadline: daysFromNow(-3),
    },
    {
      id: "demo-task-submitted",
      sessionId: IDS.sessionOngoing,
      title: "Implement a Secure Demo Login Endpoint",
      description: "Create a role-only backend login flow using HTTP-only cookies.",
      status: "SUBMITTED" as const,
      score: null,
      finalScore: null,
      reviewNote: null,
      deadline: daysFromNow(2),
    },
    {
      id: "demo-task-pending",
      sessionId: IDS.sessionUpcoming,
      title: "Document an API Threat Model",
      description: "Identify assets, trust boundaries, threats, and mitigations for a course API.",
      status: "PENDING" as const,
      score: null,
      finalScore: null,
      reviewNote: null,
      deadline: daysFromNow(8),
    },
  ];
  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {
        studySessionId: task.sessionId,
        studentProfileId: student.id,
        rubricId: IDS.rubric,
        title: task.title,
        description: task.description,
        status: task.status,
        score: task.score,
        finalScore: task.finalScore,
        reviewNote: task.reviewNote,
        peerReviewOn: true,
        deadline: task.deadline,
      },
      create: {
        id: task.id,
        studySessionId: task.sessionId,
        studentProfileId: student.id,
        rubricId: IDS.rubric,
        title: task.title,
        description: task.description,
        status: task.status,
        score: task.score,
        finalScore: task.finalScore,
        reviewNote: task.reviewNote,
        peerReviewOn: true,
        deadline: task.deadline,
      },
    });
  }

  for (const submission of [
    {
      id: "demo-submission-reviewed",
      taskId: "demo-task-reviewed",
      body: "Implemented the accessible course card with typed props, keyboard support, focus states, and responsive layouts.",
      textBody: "Repository includes component tests, accessibility notes, and a short implementation retrospective.",
    },
    {
      id: "demo-submission-pending-review",
      taskId: "demo-task-submitted",
      body: "Implemented the backend demo login endpoint and removed public credentials from the frontend.",
      textBody: "The frontend now posts only the selected role and receives HTTP-only cookies.",
    },
  ]) {
    await prisma.taskSubmission.upsert({
      where: { taskId: submission.taskId },
      update: { studentProfileId: student.id, body: submission.body, textBody: submission.textBody },
      create: { ...submission, studentProfileId: student.id },
    });
  }
  await prisma.taskDraft.upsert({
    where: { id: "demo-task-draft-student" },
    update: {
      taskId: "demo-task-pending",
      body: "Draft threat model: identify the session cookie, personal data, and course content as protected assets.",
    },
    create: {
      id: "demo-task-draft-student",
      taskId: "demo-task-pending",
      body: "Draft threat model: identify the session cookie, personal data, and course content as protected assets.",
    },
  });
  await prisma.peerReview.upsert({
    where: { id: "demo-peer-review-student" },
    update: {
      taskId: "demo-task-reviewed",
      reviewerId: studentUserId,
      score: 5,
      comment: "Clear structure, strong accessibility details, and useful tests.",
    },
    create: {
      id: "demo-peer-review-student",
      taskId: "demo-task-reviewed",
      reviewerId: studentUserId,
      score: 5,
      comment: "Clear structure, strong accessibility details, and useful tests.",
    },
  });

  await prisma.resourceCategory.upsert({
    where: { id: IDS.category },
    update: {
      name: "Web Development",
      description: "Practical guides and references for modern web engineering.",
      color: "#14b8a6",
      teacherId: teacherUserId,
      clusterId: IDS.cluster,
      isFeatured: true,
    },
    create: {
      id: IDS.category,
      name: "Web Development",
      description: "Practical guides and references for modern web engineering.",
      color: "#14b8a6",
      teacherId: teacherUserId,
      clusterId: IDS.cluster,
      isFeatured: true,
    },
  });

  const resources = [
    {
      id: IDS.resourceGuide,
      title: "Practical TypeScript Patterns",
      description: "A concise guide to type-safe application boundaries and reusable patterns.",
      fileUrl: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html",
      fileType: "LINK",
      tags: ["TypeScript", "Patterns", "Frontend"],
      authors: ["Nexora Demo Teacher"],
      viewCount: 128,
      isFeatured: true,
    },
    {
      id: IDS.resourceChecklist,
      title: "Secure API Review Checklist",
      description: "A practical checklist for authentication, authorization, validation, and observability.",
      fileUrl: "https://owasp.org/www-project-api-security/",
      fileType: "LINK",
      tags: ["API", "Security", "Backend"],
      authors: ["Nexora Demo Teacher"],
      viewCount: 84,
      isFeatured: false,
    },
  ];
  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {
        uploaderId: teacherUserId,
        clusterId: IDS.cluster,
        clusterIds: [IDS.cluster],
        categoryId: IDS.category,
        visibility: "CLUSTER",
        year: 2026,
        ...resource,
      },
      create: {
        uploaderId: teacherUserId,
        clusterId: IDS.cluster,
        clusterIds: [IDS.cluster],
        categoryId: IDS.category,
        visibility: "CLUSTER",
        year: 2026,
        ...resource,
      },
    });
  }
  await prisma.resource.upsert({
    where: { id: "demo-resource-student-capstone-notes" },
    update: {
      uploaderId: studentUserId,
      clusterId: IDS.cluster,
      clusterIds: [IDS.cluster],
      categoryId: IDS.category,
      title: "Capstone Architecture Notes",
      description: "Student-authored notes covering the capstone API boundaries and deployment plan.",
      fileUrl: "https://www.typescriptlang.org/docs/",
      fileType: "LINK",
      visibility: "CLUSTER",
      tags: ["Capstone", "Architecture", "Notes"],
      authors: ["Nexora Demo Student"],
      year: 2026,
      viewCount: 26,
    },
    create: {
      id: "demo-resource-student-capstone-notes",
      uploaderId: studentUserId,
      clusterId: IDS.cluster,
      clusterIds: [IDS.cluster],
      categoryId: IDS.category,
      title: "Capstone Architecture Notes",
      description: "Student-authored notes covering the capstone API boundaries and deployment plan.",
      fileUrl: "https://www.typescriptlang.org/docs/",
      fileType: "LINK",
      visibility: "CLUSTER",
      tags: ["Capstone", "Architecture", "Notes"],
      authors: ["Nexora Demo Student"],
      year: 2026,
      viewCount: 26,
    },
  });

  await prisma.resourceQuiz.upsert({
    where: { id: "demo-resource-quiz-typescript" },
    update: {
      resourceId: IDS.resourceGuide,
      passMark: 70,
      questions: [
        {
          question: "Why use unknown instead of any at an untrusted boundary?",
          options: ["It is shorter", "It requires validation before use", "It disables TypeScript", "It improves network speed"],
          correctIndex: 1,
          explanation: "unknown preserves type safety by requiring narrowing before use.",
        },
      ],
    },
    create: {
      id: "demo-resource-quiz-typescript",
      resourceId: IDS.resourceGuide,
      passMark: 70,
      questions: [
        {
          question: "Why use unknown instead of any at an untrusted boundary?",
          options: ["It is shorter", "It requires validation before use", "It disables TypeScript", "It improves network speed"],
          correctIndex: 1,
          explanation: "unknown preserves type safety by requiring narrowing before use.",
        },
      ],
    },
  });

  await prisma.resourceAnnotation.upsert({
    where: { id: "demo-resource-annotation-student" },
    update: {
      resourceId: IDS.resourceGuide,
      userId: studentUserId,
      highlight: "Validate data at system boundaries.",
      note: "Use this pattern in the capstone API.",
      page: 1,
      isShared: true,
    },
    create: {
      id: "demo-resource-annotation-student",
      resourceId: IDS.resourceGuide,
      userId: studentUserId,
      highlight: "Validate data at system boundaries.",
      note: "Use this pattern in the capstone API.",
      page: 1,
      isShared: true,
    },
  });

  await prisma.resourceComment.upsert({
    where: { id: "demo-resource-comment-student" },
    update: {
      resourceId: IDS.resourceGuide,
      authorId: studentUserId,
      body: "The section on narrowing unknown values made API validation much clearer.",
      isPinned: true,
    },
    create: {
      id: "demo-resource-comment-student",
      resourceId: IDS.resourceGuide,
      authorId: studentUserId,
      body: "The section on narrowing unknown values made API validation much clearer.",
      isPinned: true,
    },
  });

  await prisma.announcement.upsert({
    where: { id: IDS.announcement },
    update: {
      authorId: teacherUserId,
      title: "Capstone checkpoint this week",
      body: "Bring your current architecture diagram and one technical challenge to the project clinic.",
      urgency: "IMPORTANT",
      publishedAt: new Date(),
      isGlobal: false,
    },
    create: {
      id: IDS.announcement,
      authorId: teacherUserId,
      title: "Capstone checkpoint this week",
      body: "Bring your current architecture diagram and one technical challenge to the project clinic.",
      urgency: "IMPORTANT",
      publishedAt: new Date(),
      isGlobal: false,
    },
  });
  await prisma.announcementCluster.upsert({
    where: { announcementId_clusterId: { announcementId: IDS.announcement, clusterId: IDS.cluster } },
    update: {},
    create: { announcementId: IDS.announcement, clusterId: IDS.cluster },
  });
  await prisma.announcementRead.upsert({
    where: { announcementId_userId: { announcementId: IDS.announcement, userId: studentUserId } },
    update: { readAt: new Date() },
    create: {
      id: "demo-announcement-read-student",
      announcementId: IDS.announcement,
      userId: studentUserId,
    },
  });

  await prisma.studyGroup.upsert({
    where: { id: IDS.studyGroup },
    update: { clusterId: IDS.cluster, name: "Capstone Builders", maxMembers: 5 },
    create: { id: IDS.studyGroup, clusterId: IDS.cluster, name: "Capstone Builders", maxMembers: 5 },
  });
  await prisma.studyGroupMember.upsert({
    where: { groupId_userId: { groupId: IDS.studyGroup, userId: studentUserId } },
    update: { studentProfileId: student.id },
    create: {
      id: "demo-study-group-member-student",
      groupId: IDS.studyGroup,
      userId: studentUserId,
      studentProfileId: student.id,
    },
  });

  const courses = [
    {
      id: IDS.courseFullStack,
      title: "Build and Ship a Full-Stack Application",
      description: "A complete project course covering product planning, interfaces, APIs, databases, testing, and deployment.",
      thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Deployment"],
      price: 69,
      isFree: false,
      isFeatured: true,
    },
    {
      id: IDS.courseData,
      title: "Data Analysis Foundations",
      description: "Use Python and pandas to clean data, discover patterns, and communicate evidence clearly.",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      tags: ["Python", "Pandas", "Analytics", "Visualization"],
      price: 0,
      isFree: true,
      isFeatured: false,
    },
  ];
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        teacherId: teacher.id,
        status: "PUBLISHED",
        priceApprovalStatus: "APPROVED",
        teacherRevenuePercent: 75,
        approvedAt: new Date(),
        ...course,
      },
      create: {
        teacherId: teacher.id,
        status: "PUBLISHED",
        priceApprovalStatus: "APPROVED",
        teacherRevenuePercent: 75,
        approvedAt: new Date(),
        ...course,
      },
    });
  }

  const courseMissions = [
    { id: "demo-mission-full-stack-1", courseId: IDS.courseFullStack, title: "Plan the Product", order: 0 },
    { id: "demo-mission-full-stack-2", courseId: IDS.courseFullStack, title: "Build the API", order: 1 },
    { id: "demo-mission-full-stack-3", courseId: IDS.courseFullStack, title: "Test and Deploy", order: 2 },
    { id: "demo-mission-data-1", courseId: IDS.courseData, title: "Clean the Dataset", order: 0 },
    { id: "demo-mission-data-2", courseId: IDS.courseData, title: "Explore the Data", order: 1 },
    { id: "demo-mission-data-3", courseId: IDS.courseData, title: "Present the Findings", order: 2 },
  ];
  for (const mission of courseMissions) {
    await prisma.courseMission.upsert({
      where: { id: mission.id },
      update: { ...mission, description: `Complete the ${mission.title.toLowerCase()} practical assignment.`, status: "PUBLISHED", approvedAt: new Date() },
      create: { ...mission, description: `Complete the ${mission.title.toLowerCase()} practical assignment.`, status: "PUBLISHED", approvedAt: new Date() },
    });
    await prisma.missionContent.upsert({
      where: { id: `${mission.id}-content` },
      update: {
        missionId: mission.id,
        type: "TEXT",
        title: `${mission.title} guide`,
        order: 0,
        textBody: `## ${mission.title}\n\nFollow the practical guide, record your decisions, and submit your reflection.`,
      },
      create: {
        id: `${mission.id}-content`,
        missionId: mission.id,
        type: "TEXT",
        title: `${mission.title} guide`,
        order: 0,
        textBody: `## ${mission.title}\n\nFollow the practical guide, record your decisions, and submit your reflection.`,
      },
    });
  }

  await prisma.courseEnrollment.upsert({
    where: { courseId_userId: { courseId: IDS.courseFullStack, userId: studentUserId } },
    update: {
      progress: 67,
      paymentStatus: "PAID",
      amountPaid: 69,
      teacherEarning: 51.75,
      platformEarning: 17.25,
    },
    create: {
      id: IDS.enrollmentFullStack,
      courseId: IDS.courseFullStack,
      userId: studentUserId,
      progress: 67,
      paymentStatus: "PAID",
      amountPaid: 69,
      teacherEarning: 51.75,
      platformEarning: 17.25,
      enrolledAt: daysFromNow(-35),
    },
  });
  await prisma.courseEnrollment.upsert({
    where: { courseId_userId: { courseId: IDS.courseData, userId: studentUserId } },
    update: { progress: 100, completedAt: daysFromNow(-5), paymentStatus: "FREE" },
    create: {
      id: IDS.enrollmentData,
      courseId: IDS.courseData,
      userId: studentUserId,
      progress: 100,
      completedAt: daysFromNow(-5),
      paymentStatus: "FREE",
      enrolledAt: daysFromNow(-60),
    },
  });

  for (const mission of courseMissions) {
    const enrollmentId = mission.courseId === IDS.courseFullStack ? IDS.enrollmentFullStack : IDS.enrollmentData;
    const isCompleted = mission.courseId === IDS.courseData || mission.order < 2;
    await prisma.studentMissionProgress.upsert({
      where: { enrollmentId_missionId: { enrollmentId, missionId: mission.id } },
      update: {
        isCompleted,
        completedAt: isCompleted ? daysFromNow(-5) : null,
        lastAccessedAt: new Date(),
      },
      create: {
        id: `demo-progress-${mission.id}`,
        enrollmentId,
        missionId: mission.id,
        isCompleted,
        completedAt: isCompleted ? daysFromNow(-5) : null,
        lastAccessedAt: new Date(),
      },
    });
  }

  await prisma.revenueTransaction.upsert({
    where: { enrollmentId: IDS.enrollmentFullStack },
    update: {
      courseId: IDS.courseFullStack,
      teacherId: teacher.id,
      studentId: studentUserId,
      totalAmount: 69,
      teacherPercent: 75,
      teacherEarning: 51.75,
      platformEarning: 17.25,
    },
    create: {
      id: "demo-revenue-full-stack",
      enrollmentId: IDS.enrollmentFullStack,
      courseId: IDS.courseFullStack,
      teacherId: teacher.id,
      studentId: studentUserId,
      totalAmount: 69,
      teacherPercent: 75,
      teacherEarning: 51.75,
      platformEarning: 17.25,
      transactedAt: daysFromNow(-35),
    },
  });
  await prisma.payment.upsert({
    where: { stripePaymentIntentId: "pi_nexora_demo_full_stack" },
    update: {
      courseId: IDS.courseFullStack,
      userId: studentUserId,
      enrollmentId: IDS.enrollmentFullStack,
      stripeClientSecret: "pi_nexora_demo_full_stack_secret_demo",
      amount: 69,
      currency: "usd",
      status: "PAID",
      teacherRevenuePercent: 75,
      teacherEarning: 51.75,
      platformEarning: 17.25,
      paidAt: daysFromNow(-35),
    },
    create: {
      id: "demo-payment-full-stack",
      courseId: IDS.courseFullStack,
      userId: studentUserId,
      enrollmentId: IDS.enrollmentFullStack,
      stripePaymentIntentId: "pi_nexora_demo_full_stack",
      stripeClientSecret: "pi_nexora_demo_full_stack_secret_demo",
      amount: 69,
      currency: "usd",
      status: "PAID",
      teacherRevenuePercent: 75,
      teacherEarning: 51.75,
      platformEarning: 17.25,
      paidAt: daysFromNow(-35),
    },
  });
  await prisma.courseEnrollment.update({
    where: { id: IDS.enrollmentFullStack },
    data: { paymentId: "demo-payment-full-stack" },
  });

  await prisma.certificate.upsert({
    where: { id: IDS.certificate },
    update: {
      userId: studentUserId,
      courseId: IDS.courseData,
      title: "Data Analysis Foundations Certificate",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    create: {
      id: IDS.certificate,
      userId: studentUserId,
      courseId: IDS.courseData,
      title: "Data Analysis Foundations Certificate",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      verifyCode: "NEXORA-DEMO-DATA-2026",
    },
  });

  await prisma.readingList.upsert({
    where: { id: IDS.readingList },
    update: {
      userId: studentUserId,
      studentProfileId: student.id,
      name: "Full-Stack Essentials",
      isPublic: true,
      shareSlug: "demo-full-stack-essentials",
    },
    create: {
      id: IDS.readingList,
      userId: studentUserId,
      studentProfileId: student.id,
      name: "Full-Stack Essentials",
      isPublic: true,
      shareSlug: "demo-full-stack-essentials",
    },
  });
  for (const [order, resourceId] of [IDS.resourceGuide, IDS.resourceChecklist].entries()) {
    await prisma.readingListItem.upsert({
      where: { id: `demo-reading-list-item-${order + 1}` },
      update: { readingListId: IDS.readingList, resourceId, order },
      create: { id: `demo-reading-list-item-${order + 1}`, readingListId: IDS.readingList, resourceId, order },
    });
  }

  const goals = [
    { id: IDS.goalDone, title: "Finish the TypeScript patterns module", target: "Complete before the project clinic", kanbanStatus: "DONE", isAchieved: true, achievedAt: daysFromNow(0) },
    { id: IDS.goalProgress, title: "Complete the capstone API", target: "Implement authentication and validation", kanbanStatus: "IN_PROGRESS", isAchieved: false, achievedAt: null },
    { id: IDS.goalTodo, title: "Deploy the capstone application", target: "Publish a tested production build", kanbanStatus: "TODO", isAchieved: false, achievedAt: null },
  ];
  for (const goal of goals) {
    await prisma.memberGoal.upsert({
      where: { id: goal.id },
      update: { ...goal, userId: studentUserId, studentProfileId: student.id, clusterId: IDS.cluster },
      create: { ...goal, userId: studentUserId, studentProfileId: student.id, clusterId: IDS.cluster },
    });
  }

  await prisma.milestone.upsert({
    where: { id: IDS.milestone },
    update: {
      clusterId: IDS.cluster,
      name: "First Excellent Submission",
      criteria: { type: "tasks_submitted", threshold: 1 },
      badgeIcon: "award",
    },
    create: {
      id: IDS.milestone,
      clusterId: IDS.cluster,
      name: "First Excellent Submission",
      criteria: { type: "tasks_submitted", threshold: 1 },
      badgeIcon: "award",
    },
  });
  await prisma.userBadge.upsert({
    where: { userId_milestoneId: { userId: studentUserId, milestoneId: IDS.milestone } },
    update: {},
    create: { id: IDS.badge, userId: studentUserId, milestoneId: IDS.milestone },
  });

  for (const notification of [
    {
      id: IDS.notificationTask,
      type: "TASK_REVIEWED",
      title: "Your course card task was reviewed",
      body: "You earned 94/100 with excellent feedback.",
      link: "/dashboard/student/homework",
      isRead: false,
    },
    {
      id: IDS.notificationSession,
      type: "SESSION_REMINDER",
      title: "Secure API Design starts soon",
      body: "Review the API security checklist before the session.",
      link: "/dashboard/student/cluster",
      isRead: true,
    },
  ]) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: { ...notification, userId: studentUserId },
      create: { ...notification, userId: studentUserId },
    });
  }

  await prisma.notification.upsert({
    where: { id: "demo-notification-teacher-submission" },
    update: {
      userId: teacherUserId,
      type: "NEW_SUBMISSION",
      title: "New capstone submission",
      body: "Nexora Demo Student submitted the secure demo login task.",
      link: "/dashboard/teacher/homeworkManagement",
      isRead: false,
    },
    create: {
      id: "demo-notification-teacher-submission",
      userId: teacherUserId,
      type: "NEW_SUBMISSION",
      title: "New capstone submission",
      body: "Nexora Demo Student submitted the secure demo login task.",
      link: "/dashboard/teacher/homeworkManagement",
      isRead: false,
    },
  });

  for (const account of [
    { userId: teacherUserId, id: "demo-settings-teacher", timezone: "Asia/Dhaka", language: "en" },
    { userId: studentUserId, id: "demo-settings-student", timezone: "Asia/Dhaka", language: "en" },
  ]) {
    await prisma.userAccountSettings.upsert({
      where: { userId: account.userId },
      update: {
        timezone: account.timezone,
        language: account.language,
        emailNotifications: { sessionCreated: true, submissionAlert: true, badgeEarned: true, weeklyDigest: true },
        pushNotifications: { deadline: true, newSubmission: true, systemAnnounce: true },
        privacy: { profilePublic: true, showEmail: false, showClusters: true, activityVisible: true },
      },
      create: {
        ...account,
        emailNotifications: { sessionCreated: true, submissionAlert: true, badgeEarned: true, weeklyDigest: true },
        pushNotifications: { deadline: true, newSubmission: true, systemAnnounce: true },
        privacy: { profilePublic: true, showEmail: false, showClusters: true, activityVisible: true },
      },
    });
  }

  await prisma.testimonial.upsert({
    where: { id: "demo-testimonial-student" },
    update: {
      userId: studentUserId,
      name: "Nexora Demo Student",
      role: "Computer Science Student",
      quote: "Nexora keeps my courses, project work, resources, and progress organized in one place.",
      rating: 5,
      status: "APPROVED",
    },
    create: {
      id: "demo-testimonial-student",
      userId: studentUserId,
      name: "Nexora Demo Student",
      role: "Computer Science Student",
      quote: "Nexora keeps my courses, project work, resources, and progress organized in one place.",
      rating: 5,
      status: "APPROVED",
    },
  });
  await prisma.supportTicket.upsert({
    where: { id: "demo-support-ticket-student" },
    update: {
      userId: studentUserId,
      subject: "Question about certificate verification",
      body: "How can I share the public verification link for my completed course certificate?",
      status: "RESOLVED",
      adminReply: "Open the certificate page and use the verification code shown beside your certificate.",
    },
    create: {
      id: "demo-support-ticket-student",
      userId: studentUserId,
      subject: "Question about certificate verification",
      body: "How can I share the public verification link for my completed course certificate?",
      status: "RESOLVED",
      adminReply: "Open the certificate page and use the verification code shown beside your certificate.",
    },
  });

  console.log("Seeded connected teacher and student demo activity.");
}

async function main() {
  console.log("Seeding Nexora demo users...");

  let teacherUserId = "";
  let studentUserId = "";
  for (const seed of DEMO_USERS) {
    const result = await ensureDemoUser(seed);
    if (result.role === Role.TEACHER) teacherUserId = result.userId;
    if (result.role === Role.STUDENT) studentUserId = result.userId;
    console.log(`Ready: ${result.role} (${result.email})`);
  }

  await seedTeacherAndStudentData(teacherUserId, studentUserId);
  console.log("Demo user seeding complete.");
}

main()
  .catch((error) => {
    console.error("Demo user seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
