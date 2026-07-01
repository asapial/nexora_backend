ALTER TABLE "ExamAttempt"
ADD COLUMN IF NOT EXISTS "proctorFeedClearedAt" TIMESTAMP(3);

UPDATE "ExamAttempt" AS attempt
SET
  "suspiciousCount" = confirmed.count,
  "suspicious" = confirmed.count > 0
FROM (
  SELECT
    attempt_rows.id,
    COUNT(event.id)::INTEGER AS count
  FROM "ExamAttempt" AS attempt_rows
  LEFT JOIN "ExamProctorEvent" AS event
    ON event."attemptId" = attempt_rows.id
    AND event."reviewDecision" = 'CONFIRMED_CONCERN'
  GROUP BY attempt_rows.id
) AS confirmed
WHERE attempt.id = confirmed.id;
