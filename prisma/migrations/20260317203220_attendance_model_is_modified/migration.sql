/*
  Warnings:

  - You are about to drop the column `memberId` on the `Attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studySessionId,studentProfileId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Made the column `studentProfileId` on table `Attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentProfileId_fkey";

-- DropIndex
DROP INDEX "Attendance_studySessionId_memberId_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "memberId",
ALTER COLUMN "studentProfileId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studySessionId_studentProfileId_key" ON "Attendance"("studySessionId", "studentProfileId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
