/*
  Warnings:

  - You are about to drop the column `memberId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TaskSubmission` table. All the data in the column will be lost.
  - Made the column `studentProfileId` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `studentProfileId` to the `TaskSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cluster" DROP CONSTRAINT "Cluster_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_studentProfileId_fkey";

-- DropForeignKey
ALTER TABLE "TaskSubmission" DROP CONSTRAINT "TaskSubmission_userId_fkey";

-- DropIndex
DROP INDEX "Task_memberId_status_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "memberId",
ALTER COLUMN "studentProfileId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TaskSubmission" DROP COLUMN "userId",
ADD COLUMN     "studentProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Task_studentProfileId_status_idx" ON "Task"("studentProfileId", "status");

-- AddForeignKey
ALTER TABLE "Cluster" ADD CONSTRAINT "Cluster_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
