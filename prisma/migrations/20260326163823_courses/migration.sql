/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseEnrollment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MissionContentType" AS ENUM ('VIDEO', 'TEXT', 'PDF');

-- CreateEnum
CREATE TYPE "PriceApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('FREE', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_userId_fkey";

-- AlterTable
ALTER TABLE "ResourceCategory" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#14b8a6',
ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseEnrollment";

-- CreateTable
CREATE TABLE "AnnouncementRead" (
    "id" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnnouncementRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "tags" TEXT[],
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "priceApprovalStatus" "PriceApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "priceApprovalNote" TEXT,
    "requestedPrice" DOUBLE PRECISION,
    "teacherRevenuePercent" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectedNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_mission" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "MissionStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectedNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_content" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "type" "MissionContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "videoUrl" TEXT,
    "duration" INTEGER,
    "textBody" TEXT,
    "pdfUrl" TEXT,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_enrollment" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'FREE',
    "paymentId" TEXT,
    "amountPaid" DOUBLE PRECISION,
    "teacherEarning" DOUBLE PRECISION,
    "platformEarning" DOUBLE PRECISION,

    CONSTRAINT "course_enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_mission_progress" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "student_mission_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_price_request" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "requestedPrice" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "status" "PriceApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_price_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_transaction" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "teacherPercent" DOUBLE PRECISION NOT NULL,
    "teacherEarning" DOUBLE PRECISION NOT NULL,
    "platformEarning" DOUBLE PRECISION NOT NULL,
    "transactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnnouncementRead_announcementId_userId_key" ON "AnnouncementRead"("announcementId", "userId");

-- CreateIndex
CREATE INDEX "course_status_isFeatured_idx" ON "course"("status", "isFeatured");

-- CreateIndex
CREATE INDEX "course_mission_courseId_order_idx" ON "course_mission"("courseId", "order");

-- CreateIndex
CREATE INDEX "mission_content_missionId_order_idx" ON "mission_content"("missionId", "order");

-- CreateIndex
CREATE INDEX "course_enrollment_courseId_paymentStatus_idx" ON "course_enrollment"("courseId", "paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollment_courseId_userId_key" ON "course_enrollment"("courseId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "student_mission_progress_enrollmentId_missionId_key" ON "student_mission_progress"("enrollmentId", "missionId");

-- CreateIndex
CREATE INDEX "course_price_request_courseId_status_idx" ON "course_price_request"("courseId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "revenue_transaction_enrollmentId_key" ON "revenue_transaction"("enrollmentId");

-- CreateIndex
CREATE INDEX "revenue_transaction_teacherId_idx" ON "revenue_transaction"("teacherId");

-- AddForeignKey
ALTER TABLE "AnnouncementRead" ADD CONSTRAINT "AnnouncementRead_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementRead" ADD CONSTRAINT "AnnouncementRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "admin_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_mission" ADD CONSTRAINT "course_mission_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_mission" ADD CONSTRAINT "course_mission_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "admin_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_content" ADD CONSTRAINT "mission_content_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "course_mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollment" ADD CONSTRAINT "course_enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_mission_progress" ADD CONSTRAINT "student_mission_progress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "course_enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_mission_progress" ADD CONSTRAINT "student_mission_progress_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "course_mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_price_request" ADD CONSTRAINT "course_price_request_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_price_request" ADD CONSTRAINT "course_price_request_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_price_request" ADD CONSTRAINT "course_price_request_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "admin_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_transaction" ADD CONSTRAINT "revenue_transaction_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
