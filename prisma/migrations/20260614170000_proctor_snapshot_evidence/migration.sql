ALTER TABLE "ExamProctorEvent"
ADD COLUMN IF NOT EXISTS "evidenceUrl" TEXT;

ALTER TABLE "ExamProctorPolicy"
ALTER COLUMN "snapshotEnabled" SET DEFAULT true;

UPDATE "ExamProctorPolicy"
SET "snapshotEnabled" = true
WHERE "snapshotEnabled" = false;
