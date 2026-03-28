/*
  Warnings:

  - You are about to drop the column `teacherProfileId` on the `Cluster` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cluster" DROP CONSTRAINT "Cluster_teacherProfileId_fkey";

-- AlterTable
ALTER TABLE "Cluster" DROP COLUMN "teacherProfileId";
