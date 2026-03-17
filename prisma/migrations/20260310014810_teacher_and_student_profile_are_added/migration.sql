-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "studentProfileId" TEXT;

-- AlterTable
ALTER TABLE "Cluster" ADD COLUMN     "teacherProfileId" TEXT;

-- AlterTable
ALTER TABLE "ClusterMember" ADD COLUMN     "studentProfileId" TEXT;

-- AlterTable
ALTER TABLE "CoTeacher" ADD COLUMN     "teacherProfileId" TEXT;

-- AlterTable
ALTER TABLE "MemberGoal" ADD COLUMN     "studentProfileId" TEXT;

-- AlterTable
ALTER TABLE "ReadingList" ADD COLUMN     "studentProfileId" TEXT;

-- AlterTable
ALTER TABLE "StudyGroupMember" ADD COLUMN     "studentProfileId" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "studentProfileId" TEXT;

-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN     "teacherProfileId" TEXT;

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "teacherProfileId" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "planTier" "PlanTier" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "student_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "studentType" "MemberSubtype" NOT NULL DEFAULT 'EMERGING',
    "institution" TEXT,
    "batch" TEXT,
    "programme" TEXT,
    "bio" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designation" TEXT,
    "department" TEXT,
    "institution" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "linkedinUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_profile_userId_key" ON "student_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profile_userId_key" ON "teacher_profile"("userId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cluster" ADD CONSTRAINT "Cluster_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClusterMember" ADD CONSTRAINT "ClusterMember_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoTeacher" ADD CONSTRAINT "CoTeacher_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberGoal" ADD CONSTRAINT "MemberGoal_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyGroupMember" ADD CONSTRAINT "StudyGroupMember_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTemplate" ADD CONSTRAINT "TaskTemplate_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profile" ADD CONSTRAINT "teacher_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
