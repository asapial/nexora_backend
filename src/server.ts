import app from "./app";
import { createServer } from "node:http";
import { prisma } from "./lib/prisma";
import { examService } from "./modules/exam/exam.service";
import { attachExamProctorWebSocket } from "./modules/exam/exam.websocket";

const PORT = process.env.PORT || 5000;

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
    const runExamReminderSweep = () => examService.remindOverdueTeachers().catch((error) => {
      console.error("[ExamShield] Reminder sweep failed:", error);
    });
    const runEvidenceCleanup = () => examService.cleanupExpiredProctorEvidence().catch((error) => {
      console.error("[ExamShield] Evidence cleanup failed:", error);
    });
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
