/**
 * Seeds 10 public-ready courses with published missions and lesson content.
 *
 * Prerequisite: at least one teacher profile must exist.
 * Run with: npm run seed:courses
 */

import "dotenv/config";
import { prisma } from "../lib/prisma.js";

type MissionSeed = {
  title: string;
  description: string;
};

type CourseSeed = {
  title: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  price: number;
  isFeatured: boolean;
  teacherRevenuePercent: number;
  missions: MissionSeed[];
};

const COURSE_SEEDS: CourseSeed[] = [
  {
    title: "Full-Stack Web Development with Next.js",
    description:
      "Build and deploy a production-ready web application with Next.js, TypeScript, PostgreSQL, authentication, testing, and modern deployment workflows.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Full Stack"],
    price: 79,
    isFeatured: true,
    teacherRevenuePercent: 75,
    missions: [
      { title: "Modern Web Foundations", description: "Set up the project and understand rendering, routing, and the request lifecycle." },
      { title: "Accessible Interface Systems", description: "Build reusable, responsive, and accessible interface components." },
      { title: "PostgreSQL and Data Modeling", description: "Design relational data and connect it to the application with an ORM." },
      { title: "Authentication and Authorization", description: "Implement secure login, sessions, roles, and protected routes." },
      { title: "Testing, Performance, and Deployment", description: "Test critical flows, improve performance, and deploy the final application." },
    ],
  },
  {
    title: "Python for Data Analysis and Visualization",
    description:
      "Learn practical data analysis with Python, pandas, NumPy, and visualization libraries through realistic business and research datasets.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    tags: ["Python", "Pandas", "Data Analysis", "Visualization"],
    price: 0,
    isFeatured: true,
    teacherRevenuePercent: 70,
    missions: [
      { title: "Python Data Toolkit", description: "Refresh essential Python and use notebooks for reproducible analysis." },
      { title: "Cleaning Messy Data", description: "Handle missing values, inconsistent formats, duplicates, and outliers." },
      { title: "Exploratory Data Analysis", description: "Ask useful questions and discover patterns with pandas and NumPy." },
      { title: "Communicating with Visuals", description: "Create clear charts and dashboards that support decisions." },
      { title: "Capstone: Customer Insights Report", description: "Turn a raw customer dataset into an evidence-based report." },
    ],
  },
  {
    title: "UI/UX Design: From Research to Prototype",
    description:
      "Follow a complete product design workflow: user research, information architecture, wireframes, visual systems, prototyping, and usability testing.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80",
    tags: ["UI Design", "UX Research", "Figma", "Prototyping"],
    price: 49,
    isFeatured: true,
    teacherRevenuePercent: 72,
    missions: [
      { title: "Discover the User Problem", description: "Plan interviews, gather evidence, and define a focused design challenge." },
      { title: "Map the Product Experience", description: "Create personas, journeys, task flows, and information architecture." },
      { title: "Wireframe Core Screens", description: "Explore layouts and interactions with low-fidelity wireframes." },
      { title: "Build a Visual Design System", description: "Define typography, color, spacing, components, and interaction states." },
      { title: "Prototype and Usability Test", description: "Create a clickable prototype, run tests, and prioritize improvements." },
    ],
  },
  {
    title: "Practical Machine Learning with Python",
    description:
      "Train, evaluate, and improve machine learning models using scikit-learn while learning how to avoid leakage, bias, and misleading metrics.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=80",
    tags: ["Machine Learning", "Python", "Scikit-learn", "AI"],
    price: 99,
    isFeatured: true,
    teacherRevenuePercent: 78,
    missions: [
      { title: "Frame a Machine Learning Problem", description: "Translate a real objective into features, labels, constraints, and metrics." },
      { title: "Prepare Reliable Training Data", description: "Build preprocessing pipelines and prevent common forms of data leakage." },
      { title: "Train Baseline Models", description: "Apply regression and classification models with meaningful baselines." },
      { title: "Evaluate and Improve Models", description: "Use cross-validation, tuning, and error analysis to improve performance." },
      { title: "Deliver an Explainable Model", description: "Package a model, explain its predictions, and document limitations." },
    ],
  },
  {
    title: "Cybersecurity Essentials for Everyone",
    description:
      "Develop practical security habits and understand threats, identity protection, network safety, incident response, and organizational risk.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80",
    tags: ["Cybersecurity", "Privacy", "Risk", "Security"],
    price: 0,
    isFeatured: false,
    teacherRevenuePercent: 70,
    missions: [
      { title: "Understand the Threat Landscape", description: "Recognize common attacks, attacker goals, and vulnerable behaviors." },
      { title: "Protect Accounts and Identity", description: "Use password managers, multi-factor authentication, and recovery plans." },
      { title: "Browse and Communicate Safely", description: "Identify phishing, unsafe links, social engineering, and privacy risks." },
      { title: "Secure Devices and Networks", description: "Apply updates, backups, encryption, and safer network settings." },
      { title: "Respond to a Security Incident", description: "Contain damage, preserve evidence, report incidents, and recover safely." },
    ],
  },
  {
    title: "Cloud Engineering on AWS",
    description:
      "Design secure, resilient cloud systems with AWS fundamentals, networking, compute, storage, databases, observability, and cost controls.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    tags: ["AWS", "Cloud", "DevOps", "Architecture"],
    price: 109,
    isFeatured: false,
    teacherRevenuePercent: 76,
    missions: [
      { title: "Cloud Architecture Fundamentals", description: "Understand regions, availability zones, shared responsibility, and core services." },
      { title: "Identity and Network Design", description: "Configure IAM, virtual networks, routing, and layered security." },
      { title: "Compute, Storage, and Databases", description: "Choose appropriate managed services for realistic workloads." },
      { title: "Observability and Reliability", description: "Design monitoring, alerting, backups, scaling, and failure recovery." },
      { title: "Cost-Aware Production Deployment", description: "Deploy an application and improve its security, reliability, and cost profile." },
    ],
  },
  {
    title: "Digital Marketing Strategy and Analytics",
    description:
      "Create a measurable digital marketing strategy using audience research, content, search, paid campaigns, funnels, experimentation, and analytics.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    tags: ["Marketing", "Analytics", "SEO", "Strategy"],
    price: 39,
    isFeatured: false,
    teacherRevenuePercent: 68,
    missions: [
      { title: "Define Audience and Positioning", description: "Research customer segments and create a clear, differentiated value proposition." },
      { title: "Plan Content and Search Growth", description: "Build a content system informed by intent, keywords, and distribution." },
      { title: "Design a Conversion Funnel", description: "Connect landing pages, offers, email, and calls to action into a coherent journey." },
      { title: "Measure Campaign Performance", description: "Choose useful metrics, configure tracking, and interpret attribution carefully." },
      { title: "Run an Evidence-Based Campaign", description: "Launch, evaluate, and improve a complete campaign using experiments." },
    ],
  },
  {
    title: "Project Management for High-Impact Teams",
    description:
      "Plan and lead projects with clear outcomes, realistic schedules, stakeholder communication, risk management, and continuous improvement.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
    tags: ["Project Management", "Leadership", "Agile", "Planning"],
    price: 29,
    isFeatured: false,
    teacherRevenuePercent: 70,
    missions: [
      { title: "Define Outcomes and Scope", description: "Write a useful project brief with goals, boundaries, assumptions, and success measures." },
      { title: "Build a Realistic Delivery Plan", description: "Estimate work, map dependencies, assign ownership, and create milestones." },
      { title: "Lead Stakeholders and Teams", description: "Create communication rhythms and make decisions with the right people involved." },
      { title: "Manage Risk and Change", description: "Identify uncertainty early and respond to issues without losing the outcome." },
      { title: "Close and Improve the Project", description: "Deliver a strong handoff, assess results, and run a useful retrospective." },
    ],
  },
  {
    title: "Financial Literacy and Personal Investing",
    description:
      "Build a practical personal finance system covering cash flow, emergency funds, debt, investing principles, risk, and long-term planning.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1600&q=80",
    tags: ["Finance", "Investing", "Budgeting", "Planning"],
    price: 0,
    isFeatured: false,
    teacherRevenuePercent: 70,
    missions: [
      { title: "Know Your Financial Position", description: "Calculate cash flow, net worth, and the priorities that matter most." },
      { title: "Build a Resilient Money System", description: "Create a budget, emergency fund, and sustainable debt repayment plan." },
      { title: "Understand Investing Fundamentals", description: "Learn compounding, diversification, fees, inflation, and risk." },
      { title: "Create a Long-Term Portfolio Plan", description: "Connect time horizon and risk tolerance to an investment approach." },
      { title: "Write Your Personal Finance Playbook", description: "Document goals, rules, review habits, and safeguards for future decisions." },
    ],
  },
  {
    title: "Public Speaking and Persuasive Presentations",
    description:
      "Become a confident, audience-centered speaker by improving story structure, slide design, vocal delivery, body language, and Q&A skills.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80",
    tags: ["Public Speaking", "Communication", "Storytelling", "Presentations"],
    price: 35,
    isFeatured: false,
    teacherRevenuePercent: 70,
    missions: [
      { title: "Design for Your Audience", description: "Clarify the audience, desired action, central message, and speaking context." },
      { title: "Structure a Persuasive Story", description: "Build a memorable opening, logical flow, supporting evidence, and clear close." },
      { title: "Create Slides That Support You", description: "Use visual hierarchy, restraint, and purposeful data displays." },
      { title: "Deliver with Confidence", description: "Improve voice, pacing, body language, rehearsal, and anxiety management." },
      { title: "Handle Questions and Final Delivery", description: "Respond to challenging questions and deliver a polished final presentation." },
    ],
  },
];

const seedId = (kind: number, courseIndex: number, itemIndex = 0) =>
  `${kind}0000000-0000-4000-8000-${String(courseIndex * 100 + itemIndex).padStart(12, "0")}`;

const videoUrls = [
  "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
];

function lessonContents(courseIndex: number, missionIndex: number, mission: MissionSeed) {
  const sequence = courseIndex * 10 + missionIndex;
  return [
    {
      id: seedId(3, courseIndex, missionIndex * 10 + 1),
      type: "VIDEO" as const,
      title: `Lesson: ${mission.title}`,
      order: 0,
      videoUrl: videoUrls[sequence % videoUrls.length]!,
      duration: 720 + sequence * 37,
    },
    {
      id: seedId(3, courseIndex, missionIndex * 10 + 2),
      type: "TEXT" as const,
      title: `${mission.title} study guide`,
      order: 1,
      textBody: `## Learning objective\n\n${mission.description}\n\n## Practice\n\nApply the ideas from this mission to a realistic scenario. Record your assumptions, decisions, and evidence, then review where your approach could be improved.\n\n## Completion check\n\n- Explain the core concept in your own words.\n- Complete the practical exercise.\n- Note one question to explore further.`,
    },
    {
      id: seedId(3, courseIndex, missionIndex * 10 + 3),
      type: "PDF" as const,
      title: `${mission.title} workbook`,
      order: 2,
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: 13264,
    },
  ];
}

async function main() {
  const preferredTeacherEmail = (
    process.env.DEMO_TEACHER_EMAIL ?? "heptex.project5@gmail.com"
  ).trim().toLowerCase();

  const teacher =
    (await prisma.teacherProfile.findFirst({
      where: { user: { email: preferredTeacherEmail } },
      include: { user: { select: { name: true, email: true } } },
    })) ??
    (await prisma.teacherProfile.findFirst({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }));

  if (!teacher) {
    throw new Error(
      "No teacher profile found. Run `npm run seeding` first or create a teacher before seeding courses.",
    );
  }

  const admin = await prisma.adminProfile.findFirst({ orderBy: { createdAt: "asc" } });
  const approvedAt = new Date("2026-05-15T10:00:00.000Z");

  console.log(`Seeding courses for ${teacher.user.name} (${teacher.user.email})`);

  for (const [courseOffset, courseSeed] of COURSE_SEEDS.entries()) {
    const courseIndex = courseOffset + 1;
    const courseId = seedId(1, courseIndex);
    const isFree = courseSeed.price === 0;
    const courseData = {
      teacherId: teacher.id,
      title: courseSeed.title,
      description: courseSeed.description,
      thumbnailUrl: courseSeed.thumbnailUrl,
      tags: courseSeed.tags,
      price: courseSeed.price,
      isFree,
      requestedPrice: isFree ? null : courseSeed.price,
      priceApprovalStatus: "APPROVED" as const,
      priceApprovalNote: isFree ? "Free course approved for public access." : "Seed price approved.",
      teacherRevenuePercent: courseSeed.teacherRevenuePercent,
      status: "PUBLISHED" as const,
      isFeatured: courseSeed.isFeatured,
      submittedAt: approvedAt,
      approvedAt,
      approvedById: admin?.id ?? null,
      rejectedAt: null,
      rejectedNote: null,
    };

    await prisma.$transaction(
      async (tx) => {
        await tx.course.upsert({
          where: { id: courseId },
          update: courseData,
          create: { id: courseId, ...courseData },
        });

        if (!isFree) {
          const requestId = seedId(4, courseIndex);
          const priceRequestData = {
            courseId,
            teacherId: teacher.id,
            requestedPrice: courseSeed.price,
            note: "Requested price based on course depth, practical projects, and lifetime access.",
            status: "APPROVED" as const,
            adminNote: "Approved as part of the realistic course seed catalog.",
            reviewedAt: approvedAt,
            reviewedById: admin?.id ?? null,
          };
          await tx.coursePriceRequest.upsert({
            where: { id: requestId },
            update: priceRequestData,
            create: { id: requestId, ...priceRequestData },
          });
        }

        for (const [missionOffset, missionSeed] of courseSeed.missions.entries()) {
          const missionIndex = missionOffset + 1;
          const missionId = seedId(2, courseIndex, missionIndex);
          const missionData = {
            courseId,
            title: missionSeed.title,
            description: missionSeed.description,
            order: missionOffset,
            status: "PUBLISHED" as const,
            submittedAt: approvedAt,
            approvedAt,
            approvedById: admin?.id ?? null,
            rejectedAt: null,
            rejectedNote: null,
          };

          await tx.courseMission.upsert({
            where: { id: missionId },
            update: missionData,
            create: { id: missionId, ...missionData },
          });

          for (const content of lessonContents(courseIndex, missionIndex, missionSeed)) {
            const { id, ...contentData } = content;
            await tx.missionContent.upsert({
              where: { id },
              update: { missionId, ...contentData },
              create: { id, missionId, ...contentData },
            });
          }
        }
      },
      { timeout: 60_000 },
    );

    console.log(`  ${courseIndex}. ${courseSeed.title}`);
  }

  console.log(
    `Course seeding complete: ${COURSE_SEEDS.length} courses, ${COURSE_SEEDS.length * 5} missions, and ${COURSE_SEEDS.length * 15} lesson contents.`,
  );
}

main()
  .catch((error) => {
    console.error("Course seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
