-- CreateEnum
CREATE TYPE "StudySessionStatus" AS ENUM ('upcoming', 'completed');

-- AlterTable
ALTER TABLE "StudySession" ADD COLUMN     "status" "StudySessionStatus" NOT NULL DEFAULT 'upcoming';
