/*
  Warnings:

  - Added the required column `department` to the `student_profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdminPermission" AS ENUM ('MANAGE_STUDENTS', 'MANAGE_TEACHERS', 'MANAGE_ADMINS', 'MANAGE_CLUSTERS', 'MANAGE_SESSIONS', 'MANAGE_RESOURCES', 'MANAGE_TASKS', 'MANAGE_CERTIFICATES', 'VIEW_ANALYTICS', 'VIEW_AUDIT_LOGS', 'MANAGE_SETTINGS', 'MANAGE_ANNOUNCEMENTS');

-- DropForeignKey
ALTER TABLE "Cluster" DROP CONSTRAINT "Cluster_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "ClusterMember" DROP CONSTRAINT "ClusterMember_userId_fkey";

-- AlterTable
ALTER TABLE "student_profile" ADD COLUMN     "address" TEXT,
ADD COLUMN     "cgpa" DOUBLE PRECISION,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "enrollmentYear" TEXT,
ADD COLUMN     "expectedGraduation" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "teacher_profile" ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "googleScholarUrl" TEXT,
ADD COLUMN     "officeHours" TEXT,
ADD COLUMN     "researchInterests" TEXT[],
ADD COLUMN     "specialization" TEXT;

-- CreateTable
CREATE TABLE "admin_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "bio" TEXT,
    "nationality" TEXT,
    "avatarUrl" TEXT,
    "designation" TEXT,
    "department" TEXT,
    "organization" TEXT,
    "linkedinUrl" TEXT,
    "website" TEXT,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "permissions" "AdminPermission"[],
    "managedModules" TEXT[],
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "ipWhitelist" TEXT[],
    "lastActiveAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_activity_log" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetModel" TEXT,
    "targetId" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_userId_key" ON "admin_profile"("userId");

-- AddForeignKey
ALTER TABLE "admin_profile" ADD CONSTRAINT "admin_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_activity_log" ADD CONSTRAINT "admin_activity_log_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cluster" ADD CONSTRAINT "Cluster_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClusterMember" ADD CONSTRAINT "ClusterMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
