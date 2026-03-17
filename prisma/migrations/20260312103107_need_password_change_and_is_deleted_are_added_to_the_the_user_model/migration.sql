-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isDeleted" BOOLEAN,
ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT false;
