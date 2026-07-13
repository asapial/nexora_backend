import assert from "node:assert/strict";
import test, { before } from "node:test";
import PDFDocument from "pdfkit";

type ResourceAiServiceModule = typeof import("./resourceAi.service");

let service: ResourceAiServiceModule;

const setRequiredEnv = () => {
  const envDefaults: Record<string, string> = {
    NODE_ENV: "test",
    PORT: "5000",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    BETTER_AUTH_SECRET: "test-secret-with-enough-entropy-for-auth",
    BETTER_AUTH_URL: "http://localhost:5000",
    ACCESS_TOKEN_SECRET: "test-access-token-secret",
    REFRESH_TOKEN_SECRET: "test-refresh-token-secret",
    ACCESS_TOKEN_EXPIRES_IN: "1d",
    REFRESH_TOKEN_EXPIRES_IN: "7d",
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: "86400",
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: "86400",
    EMAIL_SENDER_SMTP_USER: "smtp-user@example.com",
    EMAIL_SENDER_SMTP_PASS: "smtp-password",
    EMAIL_SENDER_SMTP_HOST: "127.0.0.1",
    EMAIL_SENDER_SMTP_PORT: "587",
    EMAIL_SENDER_SMTP_FROM: "Nexora <no-reply@nexora.test>",
    GOOGLE_CLIENT_ID: "google-client-id",
    GOOGLE_CLIENT_SECRET: "google-client-secret",
    GOOGLE_CALLBACK_URL: "http://localhost:5000/api/auth/google/callback",
    FRONTEND_URL: "http://localhost:3000",
    CLOUDINARY_CLOUD_NAME: "cloudinary-cloud",
    CLOUDINARY_API_KEY: "cloudinary-key",
    CLOUDINARY_API_SECRET: "cloudinary-secret",
    OpenRouter_API_KEY: "openrouter-key",
  };

  for (const [key, value] of Object.entries(envDefaults)) {
    process.env[key] ??= value;
  }
};

const createPdfBuffer = async (lines: string[]) =>
  new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer | Uint8Array) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    for (const line of lines) {
      doc.text(line);
      doc.moveDown();
    }

    doc.end();
  });

before(async () => {
  setRequiredEnv();
  service = await import(`./resourceAi.service.ts?resourceAiServiceTest=${Date.now()}`);
});

test("extractPdfText uses PDF.js text extraction for selectable PDFs", async () => {
  const pdf = await createPdfBuffer([
    "Nexora AI reading extracts selectable academic text from this PDF document.",
    "The summary should include enough meaningful characters for downstream processing.",
    "References include Smith 2024 and a DOI 10.1234/example.nexora for citation parsing.",
  ]);

  const extracted = await service.__resourceAiInternals.extractPdfText(pdf);

  assert.equal(extracted.pageCount, 1);
  assert.match(extracted.cleanedText, /Nexora AI reading extracts selectable academic text/);
  assert.match(extracted.cleanedText, /10\.1234\/example\.nexora/);
});

test("extractPdfText fails clearly when the PDF has no useful selectable text", async () => {
  const pdf = await createPdfBuffer([]);

  await assert.rejects(
    () => service.__resourceAiInternals.extractPdfText(pdf),
    /OCR-enabled PDF or a text-based PDF/,
  );
});

test("resource AI job registry prevents duplicate active work for a resource", async () => {
  const registry = service.createResourceAiJobRegistry();
  let releaseJob: (() => void) | undefined;

  const firstStarted = registry.start("resource-1", async () => {
    await new Promise<void>((resolve) => {
      releaseJob = resolve;
    });
  });
  const duplicateStarted = registry.start("resource-1", async () => undefined);

  assert.equal(firstStarted, true);
  assert.equal(duplicateStarted, false);
  assert.equal(registry.size(), 1);

  await Promise.resolve();
  assert.equal(typeof releaseJob, "function");
  releaseJob?.();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assert.equal(registry.size(), 0);
  assert.equal(registry.start("resource-1", async () => undefined), true);
});

test("fallbackSummary returns deterministic content when model output is unusable", () => {
  const summary = service.__resourceAiInternals.fallbackSummary(
    { title: "Academic Resource", description: null, tags: ["ai-reading", "pdf"] },
    "This paper studies reliable AI reading workflows for classroom PDFs. ".repeat(20),
  );

  assert.match(summary.professionalSummary, /reliable AI reading workflows/);
  assert.equal(summary.methods, "Not clearly stated in the paper.");
  assert.deepEqual(summary.keywords, ["ai-reading", "pdf"]);
});

test("prepared research packs use their embedded paper identity and structured evidence", () => {
  const text = [
    "Paper 02 • Premium Research Summary Prepared as separate paper-wise summary • Concept Drift Research Pack",
    "Concept Drift and Long-Tailed Distribution in Fine-Grained Visual Categorization: Benchmark and Method",
    "Shuo Ye, Shiming Chen, Ruxin Wang, Tianxu Wu, Salman Khan, Fahad Shahbaz Khan, Ling Shao",
    "Accepted author version, IEEE Transactions on Pattern Analysis and Machine Intelligence, 2026",
    "1. Quick Research Profile",
    "Paper Focus Fine-grained visual categorization under real-world visual concept drift and long-tailed class distributions.",
    "Core Problem Existing FGVC datasets assume fixed appearances and balanced categories, unlike real biological observations.",
    "Main Method CDLT and CDLT-cd benchmarks with frequency decomposition, diffusion-based structural augmentation, distribution shuffling, and feature recombination.",
    "Dataset / Evaluation Seasonal and morphological drift protocols evaluate performance under multiple long-tailed distributions.",
    "Main Takeaway Feature recombination improves robustness when concept drift and class imbalance occur together.",
    "2. Executive Summary The benchmark exposes limitations of conventional static FGVC evaluation.",
  ].join("\n");

  const identity = service.__resourceAiInternals.inferPaperIdentity(text, {
    title: "An Online Collaborative Imputation Method for Industrial Missing Data Based on MATGAN",
    authors: [],
  });
  const summary = service.__resourceAiInternals.fallbackSummary(
    { title: "An Online Collaborative Imputation Method for Industrial Missing Data Based on MATGAN", description: null, tags: ["computer-vision"] },
    text,
  );

  assert.equal(identity.detectedTitle, "Concept Drift and Long-Tailed Distribution in Fine-Grained Visual Categorization: Benchmark and Method");
  assert.equal(identity.sourceType, "RESEARCH_SUMMARY");
  assert.equal(identity.titleMismatch, true);
  assert.deepEqual(identity.detectedAuthors.slice(0, 2), ["Shuo Ye", "Shiming Chen"]);
  assert.doesNotMatch(summary.professionalSummary, /Premium Research Summary/);
  assert.match(summary.goals ?? "", /realistic FGVC benchmark/i);
  assert.match(summary.methods ?? "", /feature-recombination/i);
  assert.match(summary.results ?? "", /11,195 images/);
  assert.match(summary.professionalSummaryBn ?? "", /এই গবেষণায়/);
});

test("reference extraction finds a late reference section in PDF text", () => {
  const text = [
    "Introduction",
    "This body section contains many observations about the paper.",
    "Methods",
    "The useful text continues here before the bibliography.",
    "References",
    "[1] Smith, J. (2024). Reliable PDF extraction for learning systems. Journal of AI Reading. doi:10.1234/pdf.ai",
    "[2] Rahman, A. (2023). Classroom annotation workflows. https://example.edu/annotation",
  ].join("\n");

  const section = service.__resourceAiInternals.detectReferenceSection(text);
  const references = service.__resourceAiInternals.splitReferences(section);

  assert.equal(references.length, 2);
  assert.match(references[0] ?? "", /Reliable PDF extraction/);
  assert.match(references[1] ?? "", /Classroom annotation workflows/);
});

test("research graph title matching rejects unrelated provider results", () => {
  const exact = service.__resourceAiInternals.titleSimilarity(
    "NMF SVM-Based CAD Tool for Alzheimer's Disease",
    "NMF SVM Based CAD Tool for Alzheimer s Disease",
  );
  const unrelated = service.__resourceAiInternals.titleSimilarity(
    "NMF SVM-Based CAD Tool for Alzheimer's Disease",
    "Marine biodiversity trends in coastal ecosystems",
  );

  assert.ok(exact > 0.9);
  assert.ok(unrelated < 0.2);
});

test("research graph nodes preserve links, depth, and citation metadata", () => {
  const node = service.__resourceAiInternals.graphNodeFromSemanticPaper(
    {
      paperId: "paper-2",
      title: "A citing study",
      year: 2025,
      citationCount: 17,
      externalIds: { DOI: "10.1000/example" },
      authors: [{ name: "A. Researcher" }],
    },
    "second-layer-paper",
    "CITED_BY",
    2,
  );

  assert.equal(node?.id, "s2:paper-2");
  assert.equal(node?.data.depth, 2);
  assert.equal(node?.data.citationCount, 17);
  assert.equal(node?.data.url, "https://doi.org/10.1000/example");
});
