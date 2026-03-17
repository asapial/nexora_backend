-- DropForeignKey
ALTER TABLE "StudySession" DROP CONSTRAINT "StudySession_createdById_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_teacherProfileId_fkey";

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "teacher_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
