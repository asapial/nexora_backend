-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "clusterIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
