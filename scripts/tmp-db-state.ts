import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const rows = await prisma.resource.findMany({
  select: {
    id: true,
    title: true,
    aiProcessingStatus: true,
    aiSummary: { select: { promptVersion: true, generationStatus: true, professionalSummary: true } },
    researchGraph: { select: { provider: true, providerPaperId: true, nodes: true, edges: true, generationError: true } },
    _count: { select: { citationsFrom: true } },
  },
});
for (const row of rows) {
  console.log(JSON.stringify({
    id: row.id,
    title: row.title,
    status: row.aiProcessingStatus,
    summaryVersion: row.aiSummary?.promptVersion,
    summaryStatus: row.aiSummary?.generationStatus,
    summaryStart: row.aiSummary?.professionalSummary.slice(0, 120),
    references: row._count.citationsFrom,
    graphProvider: row.researchGraph?.provider,
    graphPaperId: row.researchGraph?.providerPaperId,
    graphNodes: Array.isArray(row.researchGraph?.nodes) ? row.researchGraph.nodes.length : 0,
    graphEdges: Array.isArray(row.researchGraph?.edges) ? row.researchGraph.edges.length : 0,
    graphError: row.researchGraph?.generationError,
  }, null, 2));
}
await prisma.$disconnect();
