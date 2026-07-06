-- Add native Bangla (বাংলা) mirror columns to ResourceSummary.
-- Each Bn column mirrors its English counterpart and is populated by the AI
-- summary pipeline alongside the English version. Null is allowed so older
-- rows pre-dating this migration (and rows where Bangla generation failed)
-- continue to exist without breaking the reader.
ALTER TABLE "ResourceSummary"
  ADD COLUMN IF NOT EXISTS "professionalSummaryBn" TEXT,
  ADD COLUMN IF NOT EXISTS "goalsBn"               TEXT,
  ADD COLUMN IF NOT EXISTS "methodsBn"             TEXT,
  ADD COLUMN IF NOT EXISTS "resultsBn"             TEXT,
  ADD COLUMN IF NOT EXISTS "conclusionsBn"         TEXT,
  ADD COLUMN IF NOT EXISTS "keyContributionsBn"    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "limitationsBn"         TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "keywordsBn"            TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill: copy English text into Bangla columns so older rows render
-- something rather than nothing. This is a best-effort UX safety net —
-- the AI pipeline will overwrite these with proper Bangla translations
-- the next time a user regenerates the summary.
UPDATE "ResourceSummary"
SET
  "professionalSummaryBn" = COALESCE("professionalSummaryBn", "professionalSummary"),
  "goalsBn"               = COALESCE("goalsBn",               "goals"),
  "methodsBn"             = COALESCE("methodsBn",             "methods"),
  "resultsBn"             = COALESCE("resultsBn",             "results"),
  "conclusionsBn"         = COALESCE("conclusionsBn",         "conclusions"),
  "keyContributionsBn"    = CASE
    WHEN cardinality("keyContributionsBn") = 0 THEN "keyContributions"
    ELSE "keyContributionsBn"
  END,
  "limitationsBn"         = CASE
    WHEN cardinality("limitationsBn") = 0 THEN "limitations"
    ELSE "limitationsBn"
  END,
  "keywordsBn"            = CASE
    WHEN cardinality("keywordsBn") = 0 THEN "keywords"
    ELSE "keywordsBn"
  END
WHERE "professionalSummaryBn" IS NULL
   OR "goalsBn"               IS NULL
   OR "methodsBn"             IS NULL
   OR "resultsBn"             IS NULL
   OR "conclusionsBn"         IS NULL
   OR cardinality("keyContributionsBn") = 0
   OR cardinality("limitationsBn")     = 0
   OR cardinality("keywordsBn")        = 0;
