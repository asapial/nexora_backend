CREATE TYPE "ExamStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED');
CREATE TYPE "ExamType" AS ENUM ('MCQ', 'CQ', 'MIXED');
CREATE TYPE "ExamQuestionType" AS ENUM ('MCQ', 'CQ');
CREATE TYPE "ExamAttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED');
CREATE TYPE "ExamProctorEventType" AS ENUM ('TAB_HIDDEN', 'WINDOW_BLUR', 'PAGE_EXIT', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT');

CREATE TABLE "Exam" (
  "id" TEXT NOT NULL, "teacherId" TEXT NOT NULL, "clusterId" TEXT, "title" TEXT NOT NULL,
  "description" TEXT, "type" "ExamType" NOT NULL, "status" "ExamStatus" NOT NULL DEFAULT 'DRAFT',
  "startTime" TIMESTAMP(3) NOT NULL, "endTime" TIMESTAMP(3) NOT NULL, "durationMinutes" INTEGER,
  "rejectionReason" TEXT, "approvedAt" TIMESTAMP(3), "approvedById" TEXT, "questionsDueAt" TIMESTAMP(3) NOT NULL,
  "reminderSentAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ExamQuestion" (
  "id" TEXT NOT NULL, "examId" TEXT NOT NULL, "prompt" TEXT NOT NULL, "type" "ExamQuestionType" NOT NULL,
  "explanation" TEXT, "marks" DOUBLE PRECISION NOT NULL DEFAULT 1, "order" INTEGER NOT NULL,
  CONSTRAINT "ExamQuestion_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ExamOption" (
  "id" TEXT NOT NULL, "questionId" TEXT NOT NULL, "text" TEXT NOT NULL, "isCorrect" BOOLEAN NOT NULL DEFAULT false, "order" INTEGER NOT NULL,
  CONSTRAINT "ExamOption_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ExamAssignment" (
  "id" TEXT NOT NULL, "examId" TEXT NOT NULL, "userId" TEXT NOT NULL, "accessGranted" BOOLEAN NOT NULL DEFAULT false,
  "grantedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExamAssignment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ExamAttempt" (
  "id" TEXT NOT NULL, "examId" TEXT NOT NULL, "userId" TEXT NOT NULL, "status" "ExamAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "questionOrder" TEXT[], "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "submittedAt" TIMESTAMP(3),
  "score" DOUBLE PRECISION, "totalMarks" DOUBLE PRECISION, "percentage" DOUBLE PRECISION,
  "suspicious" BOOLEAN NOT NULL DEFAULT false, "suspiciousCount" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ExamAttempt_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ExamAnswer" (
  "id" TEXT NOT NULL, "attemptId" TEXT NOT NULL, "questionId" TEXT NOT NULL, "selectedOptionId" TEXT,
  "textAnswer" TEXT, "isCorrect" BOOLEAN NOT NULL DEFAULT false, "awardedMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
  CONSTRAINT "ExamAnswer_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ExamProctorEvent" (
  "id" TEXT NOT NULL, "attemptId" TEXT NOT NULL, "type" "ExamProctorEventType" NOT NULL, "pageUrl" TEXT,
  "referrer" TEXT, "metadata" JSONB, "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExamProctorEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Exam_teacherId_status_idx" ON "Exam"("teacherId", "status");
CREATE INDEX "Exam_clusterId_idx" ON "Exam"("clusterId");
CREATE INDEX "ExamQuestion_examId_order_idx" ON "ExamQuestion"("examId", "order");
CREATE INDEX "ExamOption_questionId_order_idx" ON "ExamOption"("questionId", "order");
CREATE UNIQUE INDEX "ExamAssignment_examId_userId_key" ON "ExamAssignment"("examId", "userId");
CREATE INDEX "ExamAssignment_userId_accessGranted_idx" ON "ExamAssignment"("userId", "accessGranted");
CREATE UNIQUE INDEX "ExamAttempt_examId_userId_key" ON "ExamAttempt"("examId", "userId");
CREATE INDEX "ExamAttempt_examId_status_idx" ON "ExamAttempt"("examId", "status");
CREATE UNIQUE INDEX "ExamAnswer_attemptId_questionId_key" ON "ExamAnswer"("attemptId", "questionId");
CREATE INDEX "ExamProctorEvent_attemptId_occurredAt_idx" ON "ExamProctorEvent"("attemptId", "occurredAt");

ALTER TABLE "Exam" ADD CONSTRAINT "Exam_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExamQuestion" ADD CONSTRAINT "ExamQuestion_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamOption" ADD CONSTRAINT "ExamOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamAssignment" ADD CONSTRAINT "ExamAssignment_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamAssignment" ADD CONSTRAINT "ExamAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "ExamOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExamProctorEvent" ADD CONSTRAINT "ExamProctorEvent_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
