import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { __resourceAiInternals as internals, rebuildResourceResearchGraph } from "../src/modules/resource/resourceAi.service";

const rows = await prisma.resource.findMany({
  select: {
    id: true,
    title: true,
    authors: true,
    tags: true,
    extractedText: { select: { cleanedText: true } },
  },
});

for (const resource of rows) {
  const text = resource.extractedText?.cleanedText ?? "";
  const identity = internals.inferPaperIdentity(text, resource);
  const summary = internals.fallbackSummary(
    { title: resource.title, description: null, tags: resource.tags },
    text,
  );
  console.log(JSON.stringify({
    id: resource.id,
    stored: resource.title,
    identity,
    summary: summary.professionalSummary.slice(0, 240),
    goals: summary.goals,
    methods: summary.methods,
    results: summary.results,
  }, null, 2));

  if (resource.id === rows[0]?.id) {
    try {
      const imported = await internals.persistCrossrefReferences(resource.id, "10.1109/tpami.2026.3674763");
      console.log(JSON.stringify({ directCrossrefImport: imported }));
    } catch (error) {
      console.error("Crossref import error", error);
    }
  }

  const graph = await rebuildResourceResearchGraph(resource.id);
  const referenceCount = await prisma.resourceCitationEdge.count({ where: { sourceResourceId: resource.id } });
  console.log(JSON.stringify({
    resourceId: resource.id,
    provider: graph.provider,
    providerPaperId: graph.providerPaperId,
    nodes: Array.isArray(graph.nodes) ? graph.nodes.length : 0,
    edges: Array.isArray(graph.edges) ? graph.edges.length : 0,
    storedReferences: referenceCount,
    warning: graph.generationError,
  }, null, 2));
}

await prisma.$disconnect();
