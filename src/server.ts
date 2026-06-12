import app from "./app";
import { prisma } from "./lib/prisma";
import { examService } from "./modules/exam/exam.service";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Idempotent hourly sweep for teachers who missed the 24-hour question deadline.
    const runExamReminderSweep = () => examService.remindOverdueTeachers().catch((error) => {
      console.error("[ExamShield] Reminder sweep failed:", error);
    });
    runExamReminderSweep();
    setInterval(runExamReminderSweep, 60 * 60 * 1000).unref();
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
