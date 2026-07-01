/**
 * Seeds an active approved MCQ exam owned by an existing teacher.
 *
 * The seed is idempotent: rerunning it replaces only this test exam's
 * questions and assignments.
 *
 * Run with:
 *   npm run seed:test-exam
 *   npm run seed:test-exam -- teacher@example.com
 */

import "dotenv/config";
import { Role } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

const DEFAULT_TEACHER_EMAIL = "heptex.project1@gmail.com";
const EXAM_ID = "test-exam-heptex-project1-web-fundamentals";

const questions = [
  {
    prompt: "Which HTML element represents the main content of a document?",
    explanation: "The main element contains the dominant content of the page.",
    options: ["<main>", "<section>", "<body>", "<article>"],
    correctIndex: 0,
  },
  {
    prompt: "Which CSS property changes the text color of an element?",
    explanation: "The color property controls the foreground text color.",
    options: ["color", "font-color", "text-color", "foreground"],
    correctIndex: 0,
  },
  {
    prompt: "Which JavaScript method converts a JSON string into an object?",
    explanation: "JSON.parse reads a JSON string and returns its JavaScript value.",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.convert()"],
    correctIndex: 0,
  },
  {
    prompt: "Which HTTP method is commonly used to create a new resource?",
    explanation: "POST is conventionally used to create a resource in REST APIs.",
    options: ["POST", "GET", "DELETE", "HEAD"],
    correctIndex: 0,
  },
  {
    prompt: "What does TypeScript primarily add to JavaScript?",
    explanation: "TypeScript adds static type checking and related developer tooling.",
    options: ["Static typing", "A database", "A browser engine", "A CSS framework"],
    correctIndex: 0,
  },
  {
    prompt: "Which React hook stores local component state?",
    explanation: "useState creates and updates local component state.",
    options: ["useState", "useEffect", "useMemo", "useContext"],
    correctIndex: 0,
  },
  {
    prompt: "Which SQL clause filters rows before they are returned?",
    explanation: "WHERE limits rows according to a condition.",
    options: ["WHERE", "ORDER BY", "GROUP BY", "SELECT"],
    correctIndex: 0,
  },
  {
    prompt: "What is the purpose of Zod in this project?",
    explanation: "Zod validates and transforms structured input at runtime.",
    options: ["Runtime input validation", "Database hosting", "Image optimization", "Email delivery"],
    correctIndex: 0,
  },
  {
    prompt: "Which status code indicates a successful resource creation?",
    explanation: "HTTP 201 Created indicates that a resource was successfully created.",
    options: ["201", "200", "404", "500"],
    correctIndex: 0,
  },
  {
    prompt: "Which Git command records staged changes in repository history?",
    explanation: "git commit creates a commit from staged changes.",
    options: ["git commit", "git status", "git diff", "git fetch"],
    correctIndex: 0,
  },
] as const;

async function main() {
  const email = (process.argv[2] ?? DEFAULT_TEACHER_EMAIL).trim().toLowerCase();
  const teacher = await prisma.user.findUnique({
    where: { email },
    include: {
      teacherProfile: {
        include: {
          teacherClusters: {
            where: { isActive: true },
            include: { members: { select: { userId: true } } },
            orderBy: { createdAt: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!teacher) throw new Error(`No user exists with email ${email}.`);
  if (teacher.role !== Role.TEACHER) throw new Error(`${email} is not a TEACHER account.`);
  if (!teacher.teacherProfile) throw new Error(`${email} does not have a teacher profile.`);

  const cluster = teacher.teacherProfile.teacherClusters[0] ?? null;
  const startTime = new Date(Date.now() - 5 * 60 * 1000);
  const endTime = new Date(Date.now() + 55 * 60 * 1000);
  const questionRows = questions.map((question, questionIndex) => ({
    prompt: question.prompt,
    explanation: question.explanation,
    type: "MCQ" as const,
    marks: 1,
    order: questionIndex,
    options: {
      create: question.options.map((text, optionIndex) => ({
        text,
        order: optionIndex,
        isCorrect: optionIndex === question.correctIndex,
      })),
    },
  }));

  await prisma.$transaction(async (tx) => {
    await tx.exam.upsert({
      where: { id: EXAM_ID },
      update: {
        teacherId: teacher.teacherProfile!.id,
        clusterId: cluster?.id ?? null,
        title: "Test Exam: Web Development Fundamentals",
        description: "An active test exam containing 10 MCQs with four options each.",
        type: "MCQ",
        status: "APPROVED",
        startTime,
        endTime,
        durationMinutes: 60,
        questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
        approvedAt: new Date(),
        rejectionReason: null,
        questions: { deleteMany: {} },
        assignments: { deleteMany: {} },
      },
      create: {
        id: EXAM_ID,
        teacherId: teacher.teacherProfile!.id,
        clusterId: cluster?.id ?? null,
        title: "Test Exam: Web Development Fundamentals",
        description: "An active test exam containing 10 MCQs with four options each.",
        type: "MCQ",
        status: "APPROVED",
        startTime,
        endTime,
        durationMinutes: 60,
        questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
        approvedAt: new Date(),
      },
    });

    await tx.exam.update({
      where: { id: EXAM_ID },
      data: { questions: { create: questionRows } },
    });

    if (cluster?.members.length) {
      await tx.examAssignment.createMany({
        data: cluster.members.map(({ userId }) => ({
          examId: EXAM_ID,
          userId,
          accessGranted: true,
          grantedAt: new Date(),
        })),
      });
    }
  }, { timeout: 30_000 });

  console.log(`Seeded active exam "${EXAM_ID}" for teacher ${email}.`);
  console.log(`Cluster: ${cluster?.name ?? "No active cluster; created as a standalone teacher exam"}`);
  console.log(`Assigned students: ${cluster?.members.length ?? 0}`);
  console.log(`Window: ${startTime.toISOString()} to ${endTime.toISOString()}`);
  console.log("Questions: 10 MCQs, 4 options each, 10 total marks.");
}

main()
  .catch((error) => {
    console.error("Test exam seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
