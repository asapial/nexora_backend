/*
  Warnings:

  - The values [cancel] on the enum `StudySessionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StudySessionStatus_new" AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
ALTER TABLE "public"."StudySession" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "StudySession" ALTER COLUMN "status" TYPE "StudySessionStatus_new" USING ("status"::text::"StudySessionStatus_new");
ALTER TYPE "StudySessionStatus" RENAME TO "StudySessionStatus_old";
ALTER TYPE "StudySessionStatus_new" RENAME TO "StudySessionStatus";
DROP TYPE "public"."StudySessionStatus_old";
ALTER TABLE "StudySession" ALTER COLUMN "status" SET DEFAULT 'upcoming';
COMMIT;
