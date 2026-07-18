/**
 * Seeds an active approved MCQ exam owned by an existing teacher.
 *
 * The seed is idempotent: rerunning it replaces only this test exam's
 * questions and assignments.
 *
 * Run with:
 *   npm run seed:test-exam
 *   npm run seed:test-exam -- teacher@example.com
 *   npm run seed:test-exam -- --email teacher@example.com --cluster cluster-slug
 */

import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { Role } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

const DEFAULT_TEACHER_EMAIL = "heptex.project1@gmail.com";
const EXAM_ID = "test-exam-heptex-project1-web-fundamentals";
const EXAM_DURATION_MINUTES = 60;

type TeacherCluster = {
  id: string;
  name: string;
  slug: string;
  members: { userId: string }[];
};

type CliOptions = {
  email: string;
  clusterSelector?: string;
};

const usage = `Seed an immediately available MCQ exam for a teacher.

Usage:
  npm run seed:test-exam
  npm run seed:test-exam -- teacher@example.com
  npm run seed:test-exam -- --email teacher@example.com --cluster <number|id|slug|name>

If --cluster is omitted, the command automatically fetches the teacher's active
clusters and opens an interactive numbered selection when more than one exists.`;

const readOptionValue = (args: string[], index: number, option: string) => {
  const value = args[index + 1]?.trim();
  if (!value || value.startsWith("--")) throw new Error(`${option} requires a value.`);
  return value;
};

const parseCliOptions = (args: string[]): CliOptions => {
  let email = DEFAULT_TEACHER_EMAIL;
  let clusterSelector: string | undefined;
  let positionalEmailSeen = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;

    if (argument === "--help" || argument === "-h") {
      console.log(usage);
      process.exit(0);
    }
    if (argument === "--email") {
      email = readOptionValue(args, index, argument);
      index += 1;
      continue;
    }
    if (argument === "--cluster" || argument === "-c") {
      clusterSelector = readOptionValue(args, index, argument);
      index += 1;
      continue;
    }
    if (argument.startsWith("-")) throw new Error(`Unknown option: ${argument}`);
    if (positionalEmailSeen) throw new Error(`Unexpected argument: ${argument}`);

    email = argument;
    positionalEmailSeen = true;
  }

  const normalizedEmail = email.trim().toLowerCase();
  return clusterSelector
    ? { email: normalizedEmail, clusterSelector: clusterSelector.trim() }
    : { email: normalizedEmail };
};

const clusterLabel = (cluster: TeacherCluster, index: number) =>
  `${index + 1}. ${cluster.name} (${cluster.slug}) - ${cluster.members.length} student(s)`;

const findCluster = (clusters: TeacherCluster[], selector: string) => {
  const normalizedSelector = selector.trim().toLowerCase();
  const selectionNumber = Number(normalizedSelector);
  if (Number.isInteger(selectionNumber) && selectionNumber >= 1 && selectionNumber <= clusters.length) {
    return clusters[selectionNumber - 1];
  }

  return clusters.find((cluster) =>
    cluster.id.toLowerCase() === normalizedSelector
    || cluster.slug.toLowerCase() === normalizedSelector
    || cluster.name.toLowerCase() === normalizedSelector
  );
};

const selectCluster = async (
  clusters: TeacherCluster[],
  teacherEmail: string,
  selector?: string,
) => {
  if (clusters.length === 0) {
    throw new Error(`${teacherEmail} does not own any active clusters.`);
  }

  console.log(`Active clusters fetched for ${teacherEmail}:`);
  clusters.forEach((cluster, index) => console.log(`  ${clusterLabel(cluster, index)}`));

  if (selector) {
    const selectedCluster = findCluster(clusters, selector);
    if (!selectedCluster) {
      throw new Error(`Cluster "${selector}" is not an active cluster owned by ${teacherEmail}.`);
    }
    return selectedCluster;
  }

  if (clusters.length === 1) {
    console.log(`Automatically selected the only active cluster: ${clusters[0]!.name}`);
    return clusters[0]!;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("Multiple active clusters found. Re-run with --cluster <number|id|slug|name>.");
  }

  const cli = createInterface({ input: process.stdin, output: process.stdout });
  try {
    while (true) {
      const answer = await cli.question(`Select a cluster [1-${clusters.length}]: `);
      const selectedCluster = findCluster(clusters, answer);
      if (selectedCluster) return selectedCluster;
      console.log(`Enter a number from 1 to ${clusters.length}, or a listed cluster ID, slug, or name.`);
    }
  } finally {
    cli.close();
  }
};

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
  const { email, clusterSelector } = parseCliOptions(process.argv.slice(2));
  const teacher = await prisma.user.findUnique({
    where: { email },
    include: {
      teacherProfile: {
        include: {
          teacherClusters: {
            where: { isActive: true },
            include: { members: { select: { userId: true } } },
            orderBy: [{ name: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });

  if (!teacher) throw new Error(`No user exists with email ${email}.`);
  if (teacher.role !== Role.TEACHER) throw new Error(`${email} is not a TEACHER account.`);
  if (!teacher.teacherProfile) throw new Error(`${email} does not have a teacher profile.`);

  const cluster = await selectCluster(
    teacher.teacherProfile.teacherClusters,
    email,
    clusterSelector,
  );
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + EXAM_DURATION_MINUTES * 60 * 1000);
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
        clusterId: cluster.id,
        title: "Test Exam: Web Development Fundamentals",
        description: "An active test exam containing 10 MCQs with four options each.",
        type: "MCQ",
        status: "APPROVED",
        startTime,
        endTime,
        durationMinutes: EXAM_DURATION_MINUTES,
        questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
        approvedAt: new Date(),
        rejectionReason: null,
        questions: { deleteMany: {} },
        assignments: { deleteMany: {} },
      },
      create: {
        id: EXAM_ID,
        teacherId: teacher.teacherProfile!.id,
        clusterId: cluster.id,
        title: "Test Exam: Web Development Fundamentals",
        description: "An active test exam containing 10 MCQs with four options each.",
        type: "MCQ",
        status: "APPROVED",
        startTime,
        endTime,
        durationMinutes: EXAM_DURATION_MINUTES,
        questionsDueAt: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
        approvedAt: new Date(),
      },
    });

    await tx.exam.update({
      where: { id: EXAM_ID },
      data: { questions: { create: questionRows } },
    });

    if (cluster.members.length) {
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
  console.log(`Cluster: ${cluster.name} (${cluster.slug})`);
  console.log(`Assigned students: ${cluster.members.length}`);
  console.log(`Window: ${startTime.toISOString()} to ${endTime.toISOString()}`);
  console.log("Questions: 10 MCQs, 4 options each, 10 total marks.");
}

main()
  .catch((error) => {
    console.error("Test exam seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
