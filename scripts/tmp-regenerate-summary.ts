import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { __resourceAiInternals as internals } from "../src/modules/resource/resourceAi.service";

const resources = await prisma.resource.findMany({
  where: { id: { in: [
    "8d34dd45-e915-4961-a7f2-381ced56e845",
    "f7dd833a-c22e-40c5-bf8f-60eb133baa92",
  ] } },
  select: {
    id: true,
    title: true,
    description: true,
    fileUrl: true,
    fileType: true,
    tags: true,
    authors: true,
    aiProcessingStatus: true,
    extractedText: { select: { cleanedText: true, textHash: true } },
  },
  orderBy: { id: "asc" },
});

for (const [index, resource] of resources.entries()) {
  if (!resource.extractedText) throw new Error(`Missing extracted text for ${resource.id}`);
  await prisma.resource.update({ where: { id: resource.id }, data: { aiProcessingStatus: "SUMMARY_PROCESSING", processingError: null } });
  const summary = await internals.getOrCreateSummary(
    resource,
    resource.extractedText.cleanedText,
    resource.extractedText.textHash,
    index === 0,
  );
  await prisma.resource.update({
    where: { id: resource.id },
    data: { aiProcessingStatus: "SUMMARY_READY", lastProcessedAt: new Date(), processingError: null },
  });
  console.log(JSON.stringify({
    resourceId: resource.id,
    model: summary.modelName,
    promptVersion: summary.promptVersion,
    englishStart: summary.professionalSummary.slice(0, 260),
    banglaStart: summary.professionalSummaryBn?.slice(0, 160),
    goals: summary.goals,
    methods: summary.methods,
    results: summary.results,
    contributions: summary.keyContributions,
  }, null, 2));
}

await prisma.$disconnect();
