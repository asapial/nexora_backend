const title = "Concept Drift and Long-Tailed Distribution in Fine-Grained Visual Categorization: Benchmark and Method";
const response = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(title)}&per-page=10`, {
  headers: { "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)" },
});
const payload = await response.json() as { results?: Array<Record<string, any>> };
console.log(JSON.stringify((payload.results ?? []).map((work) => ({
  id: work.id,
  title: work.title,
  year: work.publication_year,
  citedBy: work.cited_by_count,
  references: work.referenced_works_count,
  related: work.related_works?.length,
  doi: work.doi,
})), null, 2));

const crossref = await fetch("https://api.crossref.org/works/10.1109/tpami.2026.3674763", {
  headers: { "User-Agent": "Nexora/1.0 (mailto:support@nexora.local)" },
});
const crossrefPayload = await crossref.json() as { message?: { reference?: Array<Record<string, unknown>> } };
console.log(JSON.stringify(crossrefPayload.message?.reference?.slice(0, 8), null, 2));
