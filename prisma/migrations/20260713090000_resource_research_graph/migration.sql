-- Persist a complete research graph snapshot, including external-to-external
-- edges used by the two-level cited-by tree and related-work connections.
ALTER TYPE "ResourceProcessingStatus" ADD VALUE IF NOT EXISTS 'GRAPH_PROCESSING';

CREATE TABLE IF NOT EXISTS "ResourceResearchGraph" (
  "id" TEXT NOT NULL,
  "resourceId" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'semantic-scholar',
  "providerPaperId" TEXT,
  "graphVersion" INTEGER NOT NULL DEFAULT 1,
  "nodes" JSONB NOT NULL,
  "edges" JSONB NOT NULL,
  "citationCount" INTEGER,
  "generationStatus" "AiGenerationStatus" NOT NULL DEFAULT 'COMPLETED',
  "generationError" TEXT,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ResourceResearchGraph_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ResourceResearchGraph_resourceId_key"
  ON "ResourceResearchGraph"("resourceId");
CREATE INDEX IF NOT EXISTS "ResourceResearchGraph_providerPaperId_idx"
  ON "ResourceResearchGraph"("providerPaperId");
CREATE INDEX IF NOT EXISTS "ResourceResearchGraph_generatedAt_idx"
  ON "ResourceResearchGraph"("generatedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ResourceResearchGraph_resourceId_fkey'
  ) THEN
    ALTER TABLE "ResourceResearchGraph"
      ADD CONSTRAINT "ResourceResearchGraph_resourceId_fkey"
      FOREIGN KEY ("resourceId") REFERENCES "Resource"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
