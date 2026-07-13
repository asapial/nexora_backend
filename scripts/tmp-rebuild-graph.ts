import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { rebuildResourceResearchGraph } from "../src/modules/resource/resourceAi.service";

const resourceId = process.argv[2];
if (!resourceId) throw new Error("resource id is required");
const graph = await rebuildResourceResearchGraph(resourceId);
console.log(JSON.stringify({
  resourceId,
  provider: graph.provider,
  nodes: Array.isArray(graph.nodes) ? graph.nodes.length : 0,
  edges: Array.isArray(graph.edges) ? graph.edges.length : 0,
  warning: graph.generationError,
}, null, 2));
await prisma.$disconnect();
