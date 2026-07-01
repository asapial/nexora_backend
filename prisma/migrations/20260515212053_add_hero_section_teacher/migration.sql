-- CreateTable
CREATE TABLE IF NOT EXISTS "hero_section_teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "displayDesignation" TEXT,
    "displayDepartment" TEXT,
    "displayBio" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_section_teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "hero_section_teacher_userId_key" ON "hero_section_teacher"("userId");

-- AddForeignKey
ALTER TABLE "hero_section_teacher" DROP CONSTRAINT IF EXISTS "hero_section_teacher_userId_fkey";
ALTER TABLE "hero_section_teacher" ADD CONSTRAINT "hero_section_teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
