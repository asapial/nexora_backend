import app from "./app";
import { createServer } from "node:http";
import { prisma } from "./lib/prisma";
import { examService } from "./modules/exam/exam.service";
import { attachExamProctorWebSocket } from "./modules/exam/exam.websocket";

const PORT = process.env.PORT || 5000;

const isMissingTableError = (error: unknown) => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2021"
  );
};

const createBackgroundJob = (label: string, run: () => Promise<unknown>) => {
  let disabledBecauseSchemaIsMissing = false;

  return () => {
    if (disabledBecauseSchemaIsMissing) return;

    run().catch((error) => {
      if (isMissingTableError(error)) {
        disabledBecauseSchemaIsMissing = true;
        console.warn(
          `[ExamShield] ${label} disabled because required database tables are missing. Run "npx prisma migrate deploy" to apply pending migrations.`
        );
        return;
      }

      console.error(`[ExamShield] ${label} failed:`, error);
    });
  };
};

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    const server = createServer(app);
    attachExamProctorWebSocket(server);
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Idempotent hourly sweep for teachers who missed the 24-hour question deadline.
    const runExamReminderSweep = createBackgroundJob("Reminder sweep", examService.remindOverdueTeachers);
    const runEvidenceCleanup = createBackgroundJob("Evidence cleanup", examService.cleanupExpiredProctorEvidence);
    runExamReminderSweep();
    runEvidenceCleanup();
    setInterval(runExamReminderSweep, 60 * 60 * 1000).unref();
    setInterval(runEvidenceCleanup, 60 * 60 * 1000).unref();
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
