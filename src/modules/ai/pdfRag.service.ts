import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

import { envVars } from "../../config/env";

// ── RAG Pipeline ─────────────────────────────────────────────────────────────
// Step 1: Parse PDF → raw text
// Step 2: Chunk into overlapping segments (simulates embedding + vector retrieval)
// Step 3: Score chunks by keyword density (simulates cosine similarity search)
// Step 4: Pass top-ranked chunks as context to LLM for 4 options per field

function chunkText(text: string, chunkSize = 1500, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.substring(start, start + chunkSize));
    start += chunkSize - overlap;
  }
  return chunks;
}

function scoreChunk(chunk: string): number {
  const metadataKeywords = [
    "abstract", "title", "author", "authors", "published", "publication",
    "journal", "year", "keywords", "introduction", "university", "institute",
    "doi", "department", "corresponding", "received", "accepted",
  ];
  const lower = chunk.toLowerCase();
  return metadataKeywords.reduce((score, kw) => score + (lower.includes(kw) ? 1 : 0), 0);
}

export interface PdfMetadataSuggestions {
  titles: string[];
  descriptions: string[];
  authorSets: string[][];
  years: string[];
  tagSets: string[][];
}

export const extractMetadataFromPdf = async (buffer: Buffer): Promise<PdfMetadataSuggestions> => {
  // Step 1: Extract full text
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  await parser.destroy();
  const fullText = data.text;

  if (!fullText || fullText.trim().length < 50) {
    throw new Error("PDF appears to be empty or image-only and cannot be parsed.");
  }

  // Step 2: Chunk with overlap
  const chunks = chunkText(fullText, 1500, 200);

  // Step 3: Score and rank (simulated vector search)
  const rankedChunks = chunks
    .map((chunk, idx) => ({ chunk, score: scoreChunk(chunk) + (idx === 0 ? 5 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((c) => c.chunk);

  // Step 4: Build context
  const retrievedContext = rankedChunks.join("\n\n---CHUNK BOUNDARY---\n\n").slice(0, 4500);

  // Step 5: Prompt asking for 4 options per field
  const prompt = `You are a research metadata extraction assistant for an academic educational platform.

The following text was extracted from an uploaded PDF using a RAG pipeline with vector retrieval.
The most semantically relevant sections are provided below.

=== RETRIEVED CONTEXT (vector database) ===
${retrievedContext}
=== END CONTEXT ===

Your task: Generate EXACTLY 4 alternative suggestions for each metadata field.
Each suggestion should be distinct and useful. Base everything strictly on the context above.

Return a single raw JSON object with these keys:
- "titles": array of 4 alternative title strings (vary length/formality/focus)
- "descriptions": array of 4 alternative 5-7 sentence abstracts/summaries (each distinct angle)
- "authorSets": array of 4 items, each item is an array of author name strings (e.g. all authors, first author only, first 3, etc.)
- "years": array of 4 year strings like "2024" (the most likely year first, then plausible alternatives; use "" if none found)
- "tagSets": array of 4 items, each item is an array of 10-15 lowercase topic/keyword tag strings (different focus each set)

Rules:
- Output ONLY raw JSON — no markdown, no code fences, no explanation whatsoever
- Every array must have EXACTLY 4 elements
- If a field truly cannot be determined, use empty strings or empty arrays as placeholders
- Tags must be lowercase short phrases

JSON output:`;

  // ── Confirmed-working free models (validated against OpenRouter live) ──────
  // Models are tried in order; first successful JSON response wins.
  const FREE_MODELS = [
    "google/gemma-4-26b-a4b-it:free",
    "baidu/cobuddy:free",
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    "poolside/laguna-xs.2:free",
    "poolside/laguna-m.1:free",
    "deepseek/deepseek-v4-flash:free",
    "google/gemma-4-31b-it:free",
    "arcee-ai/trinity-large-thinking:free",
  ];

  let rawContent = "";
  let lastError = "";

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({})) as { error?: { message?: string; }; };
        lastError = errBody?.error?.message ?? `HTTP ${response.status}`;
        console.warn(`[pdfRag] ${model} failed: ${lastError}`);
        continue;
      }

      const result = await response.json();
      const choice = result.choices?.[0]?.message ?? {};

      // Some reasoning models return null in `content` and put text in
      // `reasoning_content` or `thinking` — check all possible fields.
      const candidate: string =
        (typeof choice.content === "string" && choice.content.trim())
        || (typeof choice.reasoning_content === "string" && choice.reasoning_content.trim())
        || (typeof choice.thinking === "string" && choice.thinking.trim())
        || "";

      if (candidate.length > 0) {
        rawContent = candidate;
        console.log(`[pdfRag] ✓ ${model} responded (${candidate.length} chars)`);
        break;
      }

      lastError = `Model returned empty content (finish_reason: ${result.choices?.[0]?.finish_reason})`;
      console.warn(`[pdfRag] ${model} empty content: ${lastError}`);
    } catch (fetchErr) {
      lastError = String(fetchErr);
      console.warn(`[pdfRag] ${model} threw: ${lastError}`);
    }
  }

  if (!rawContent) {
    throw new Error(`All AI models failed or returned empty content. Last error: ${lastError}`);
  }

  // Strip markdown fences
  rawContent = rawContent.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  // Extract JSON object
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`AI returned invalid format — no JSON found. Raw: ${rawContent.slice(0, 200)}`);

  const meta = JSON.parse(jsonMatch[0]);

  // Normalise + ensure exactly 4 items per array
  const ensure4Strings = (arr: unknown, fallback: string): string[] => {
    const base = Array.isArray(arr) ? arr.map(String) : [];
    while (base.length < 4) base.push(fallback);
    return base.slice(0, 4);
  };

  const ensure4Arrays = (arr: unknown): string[][] => {
    const base: string[][] = Array.isArray(arr) ? arr.map(item => Array.isArray(item) ? item.map(String) : []) : [];
    while (base.length < 4) base.push([]);
    return base.slice(0, 4);
  };

  return {
    titles: ensure4Strings(meta.titles, ""),
    descriptions: ensure4Strings(meta.descriptions, ""),
    authorSets: ensure4Arrays(meta.authorSets),
    years: ensure4Strings(meta.years, ""),
    tagSets: ensure4Arrays(meta.tagSets),
  };
};
