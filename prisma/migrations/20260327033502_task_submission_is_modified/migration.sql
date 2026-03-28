/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `TaskSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TaskSubmission" DROP COLUMN "fileUrl",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "textBody" TEXT,
ADD COLUMN     "videoUrl" TEXT;
