-- Resource AI summaries, citation extraction, and citation graph support.

CREATE TYPE "ResourceProcessingStatus" AS ENUM (
  'PENDING',
  'TEXT_PROCESSING',
  'TEXT_EXTRACTED',
  'SUMMARY_PROCESSING',
  'SUMMARY_READY',
  'CITATION_PROCESSING',
  'CITATIONS_READY',
  'GRAPH_READY',
  'FAILED'
);

CREATE TYPE "AiGenerationStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

CREATE TYPE "CitationRelationType" AS ENUM (
  'REFERENCES',
  'CITED_BY',
  'RELATED',
  'SIMILAR'
);

CREATE TYPE "JobStatus" AS ENUM (
  'QUEUED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'RETRYING'
);

ALTER TABLE "Resource"
  ADD COLUMN "fileHash" TEXT,
  ADD COLUMN "aiProcessingStatus" "ResourceProcessingStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "lastProcessedAt" TIMESTAMP(3),
  ADD COLUMN "processingError" TEXT;

CREATE INDEX "Resource_fileHash_idx" ON "Resource"("fileHash");
CREATE INDEX "Resource_aiProcessingStatus_idx" ON "Resource"("aiProcessingStatus");

CREATE TABLE "ResourceText" (
  "id" TEXT NOT NULL,
  "resourceId" TEXT NOT NULL,
  "fullText" TEXT NOT NULL,
  "cleanedText" TEXT NOT NULL,
  "textHash" TEXT NOT NULL,
  "pageCount" INTEGER,
  "language" TEXT,
  "extractionMethod" TEXT,
  "extractionVersion" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResourceText_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ResourceText_resourceId_key" ON "ResourceText"("resourceId");
CREATE INDEX "ResourceText_textHash_idx" ON "ResourceText"("textHash");

CREATE TABLE "ResourceSummary" (
  "id" TEXT NOT NULL,
  "resourceId" TEXT NOT NULL,
  "modelName" TEXT NOT NULL,
  "promptVersion" INTEGER NOT NULL DEFAULT 1,
  "inputTextHash" TEXT NOT NULL,
  "professionalSummary" TEXT NOT NULL,
  "goals" TEXT,
  "methods" TEXT,
  "results" TEXT,
  "conclusions" TEXT,
  "keyContributions" TEXT[],
  "limitations" TEXT[],
  "keywords" TEXT[],
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "generationStatus" "AiGenerationStatus" NOT NULL DEFAULT 'COMPLETED',
  "generationError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResourceSummary_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ResourceSummary_resourceId_key" ON "ResourceSummary"("resourceId");
CREATE INDEX "ResourceSummary_resourceId_idx" ON "ResourceSummary"("resourceId");
CREATE INDEX "ResourceSummary_inputTextHash_idx" ON "ResourceSummary"("inputTextHash");
CREATE INDEX "ResourceSummary_promptVersion_idx" ON "ResourceSummary"("promptVersion");

CREATE TABLE "ExternalCitationTarget" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "authors" TEXT,
  "publicationYear" INTEGER,
  "venue" TEXT,
  "doi" TEXT,
  "url" TEXT,
  "semanticScholarId" TEXT,
  "crossrefId" TEXT,
  "openAlexId" TEXT,
  "metadataSource" TEXT,
  "metadataConfidence" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExternalCitationTarget_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExternalCitationTarget_doi_key" ON "ExternalCitationTarget"("doi");
CREATE UNIQUE INDEX "ExternalCitationTarget_semanticScholarId_key" ON "ExternalCitationTarget"("semanticScholarId");
CREATE INDEX "ExternalCitationTarget_title_idx" ON "ExternalCitationTarget"("title");
CREATE INDEX "ExternalCitationTarget_doi_idx" ON "ExternalCitationTarget"("doi");
CREATE INDEX "ExternalCitationTarget_semanticScholarId_idx" ON "ExternalCitationTarget"("semanticScholarId");
CREATE INDEX "ExternalCitationTarget_publicationYear_idx" ON "ExternalCitationTarget"("publicationYear");

CREATE TABLE "ResourceCitationEdge" (
  "id" TEXT NOT NULL,
  "sourceResourceId" TEXT NOT NULL,
  "targetResourceId" TEXT,
  "externalTargetId" TEXT,
  "relationType" "CitationRelationType" NOT NULL DEFAULT 'REFERENCES',
  "confidenceScore" DOUBLE PRECISION,
  "rawReference" TEXT,
  "contextSnippet" TEXT,
  "referenceIndex" INTEGER,
  "resolverSource" TEXT,
  "parserVersion" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ResourceCitationEdge_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ResourceCitationEdge_sourceResourceId_idx" ON "ResourceCitationEdge"("sourceResourceId");
CREATE INDEX "ResourceCitationEdge_targetResourceId_idx" ON "ResourceCitationEdge"("targetResourceId");
CREATE INDEX "ResourceCitationEdge_externalTargetId_idx" ON "ResourceCitationEdge"("externalTargetId");
CREATE INDEX "ResourceCitationEdge_relationType_idx" ON "ResourceCitationEdge"("relationType");
CREATE INDEX "ResourceCitationEdge_confidenceScore_idx" ON "ResourceCitationEdge"("confidenceScore");

CREATE TABLE "ResourceProcessingJobAudit" (
  "id" TEXT NOT NULL,
  "resourceId" TEXT NOT NULL,
  "jobType" TEXT NOT NULL,
  "status" "JobStatus" NOT NULL,
  "error" TEXT,
  "startedAt" TIMESTAMP(3),
  "finishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ResourceProcessingJobAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ResourceProcessingJobAudit_resourceId_idx" ON "ResourceProcessingJobAudit"("resourceId");
CREATE INDEX "ResourceProcessingJobAudit_jobType_idx" ON "ResourceProcessingJobAudit"("jobType");
CREATE INDEX "ResourceProcessingJobAudit_status_idx" ON "ResourceProcessingJobAudit"("status");

CREATE TABLE "AiCache" (
  "id" TEXT NOT NULL,
  "cacheKey" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "modelName" TEXT NOT NULL,
  "promptVersion" INTEGER NOT NULL,
  "inputHash" TEXT NOT NULL,
  "outputJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiCache_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiCache_cacheKey_key" ON "AiCache"("cacheKey");
CREATE INDEX "AiCache_taskType_idx" ON "AiCache"("taskType");
CREATE INDEX "AiCache_inputHash_idx" ON "AiCache"("inputHash");

CREATE TABLE "MetadataCache" (
  "id" TEXT NOT NULL,
  "cacheKey" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "resultJson" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  CONSTRAINT "MetadataCache_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MetadataCache_cacheKey_key" ON "MetadataCache"("cacheKey");
CREATE INDEX "MetadataCache_source_idx" ON "MetadataCache"("source");
CREATE INDEX "MetadataCache_expiresAt_idx" ON "MetadataCache"("expiresAt");

ALTER TABLE "ResourceText" ADD CONSTRAINT "ResourceText_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceSummary" ADD CONSTRAINT "ResourceSummary_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceCitationEdge" ADD CONSTRAINT "ResourceCitationEdge_sourceResourceId_fkey" FOREIGN KEY ("sourceResourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResourceCitationEdge" ADD CONSTRAINT "ResourceCitationEdge_targetResourceId_fkey" FOREIGN KEY ("targetResourceId") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ResourceCitationEdge" ADD CONSTRAINT "ResourceCitationEdge_externalTargetId_fkey" FOREIGN KEY ("externalTargetId") REFERENCES "ExternalCitationTarget"("id") ON DELETE SET NULL ON UPDATE CASCADE;
