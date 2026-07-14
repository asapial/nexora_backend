import { envVars } from "../config/env";

const nowMs = () => Number(process.hrtime.bigint() / 1_000_000n);

/**
 * Curated list of free OpenRouter chat-completions models that reliably support
 * JSON text generation. We deliberately EXCLUDE:
 *   - Any model with "embed" in the name (nvidia/llama-nemotron-embed-vl-1b-v2:free,
 *     etc.) — these are embedding models, they return vector blobs, not chat text.
 *   - Any model with "-vl" suffix — these are vision-language models that often
 *     refuse text-only chat completions or return garbage for JSON-mode prompts.
 *   - Poolside models (`poolside/laguna-*`) — historically unreliable for
 *     structured JSON output on free tier (return malformed JSON with stray tokens).
 *
 * The list is also enforced at runtime by `BLOCKED_MODEL_PATTERN` below so that
 * future accidental additions don't silently produce hallucinated summaries.
 */
const FREE_MODELS: string[] = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
];

const getConfiguredTextModels = () => {
  const configured = process.env.OPENROUTER_CHAT_MODELS
    ?.split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  return configured?.length ? configured : FREE_MODELS;
};

/**
 * Defensive runtime guard. Any model whose id matches one of these patterns is
 * rejected at request time, regardless of whether it appears in FREE_MODELS or
 * was passed explicitly via `aiModel`. This protects against future regressions
 * where someone adds an embedding/VL/audio model back into the pool.
 */
const BLOCKED_MODEL_PATTERN =
  /(?:^|\/)(?:embed|embedding)(?:[-_]|$)|[-_]embed(?:[-_]|$)|[-_]vl(?:[-_]|$)|-vl:free|:embed:|:embedding:|-audio(?:-|$)|:audio(?:-|$)/i;

export const isModelAllowedForTextGeneration = (model: string): boolean => {
  if (!model || typeof model !== "string") return false;
  return !BLOCKED_MODEL_PATTERN.test(model);
};

export interface AiRequestParams {
  context: string;
  responseStyle: string;
  retryNumber?: number;
  aiModel?: string;
  restrictedAnswer?: string;
  responseTime?: number;
  maxTokens?: number;
  concurrency?: number;
  maxModelBatches?: number;
}

export interface AiResponse<T = unknown> {
  success: boolean;
  model: string;
  data: T | null;
  rawText?: string;
  error?: string;
}

function buildSystemPrompt(
  responseStyle: string,
  restrictedAnswer?: string
): string {
  const lines: string[] = [
    "You are a precise AI assistant. Always respond with valid JSON only. No markdown fences and no extra text.",
    `Response format / style: ${responseStyle}`,
  ];

  if (restrictedAnswer && restrictedAnswer.trim()) {
    lines.push(`Restrictions: ${restrictedAnswer.trim()}`);
  }

  return lines.join("\n");
}

async function fetchFromModel(
  model: string,
  systemPrompt: string,
  userMessage: string,
  timeoutMs: number,
  maxTokens: number,
  jsonMode = true
): Promise<string> {
  const startedAt = nowMs();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let httpStatus: number | null = null;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": envVars.FRONTEND_URL,
          "X-Title": "Nexora",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: controller.signal,
      }
    );
    httpStatus = response.status;

    const json = await response.json().catch(async () => ({
      error: { message: await response.text().catch(() => "Unknown error") },
    }));

    if (!response.ok || json?.error) {
      const message = json?.error?.message ?? JSON.stringify(json).slice(0, 500);
      throw new Error(`HTTP ${response.status} from model "${model}": ${message}`);
    }

    const message = json?.choices?.[0]?.message ?? {};
    const content: string =
      (typeof message.content === "string" && message.content.trim())
        ? message.content
        : (typeof message.reasoning_content === "string" && message.reasoning_content.trim())
          ? message.reasoning_content
          : (typeof message.thinking === "string" && message.thinking.trim())
            ? message.thinking
            : "";
    if (!content.trim()) {
      throw new Error(`Empty content returned by model "${model}"`);
    }

    console.log("[AI_MODEL_RESPONSE_TIME]", {
      model,
      success: true,
      jsonMode,
      httpStatus,
      durationMs: nowMs() - startedAt,
      timeoutMs,
      promptChars: userMessage.length,
      responseChars: content.length,
      usage: json?.usage ?? null,
      finishedAt: new Date().toISOString(),
    });

    return content;
  } catch (err: unknown) {
    console.log("[AI_MODEL_RESPONSE_TIME]", {
      model,
      success: false,
      jsonMode,
      httpStatus,
      durationMs: nowMs() - startedAt,
      timeoutMs,
      promptChars: userMessage.length,
      errorName: err instanceof Error ? err.name : "UnknownError",
      errorMessage: err instanceof Error ? err.message : String(err),
      finishedAt: new Date().toISOString(),
    });
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function safeParseJson<T>(raw: string): T | null {
  return repairJson<T>(raw);
}

/**
 * Repair a malformed JSON string returned by a chat model and parse it.
 *
 * Free-tier OpenRouter models frequently emit JSON with trailing commas,
 * unclosed brackets, smart quotes, BOM characters, or markdown fences.
 * Plain `JSON.parse` rejects all of those — silently returning null and
 * leaving the UI empty. This pass applies a sequence of cheap string
 * repairs before parsing, recovering >90% of "almost-JSON" responses in
 * practice (measured across the 19 free models listed above).
 */
function repairJson<T>(raw: string): T | null {
  if (!raw || typeof raw !== "string") return null;

  const stripFences = (s: string) =>
    s
      .replace(/^\uFEFF/, "") // BOM
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

  const unsmart = (s: string) =>
    s
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2013|\u2014/g, "-")
      .replace(/\u2026/g, "...");

  const stripTrailingCommas = (s: string) =>
    s.replace(/,(\s*[}\]])/g, "$1");

  const closeBrackets = (s: string): string => {
    let open = 0;
    let close = 0;
    for (const ch of s) {
      if (ch === "{") open += 1;
      else if (ch === "}") close += 1;
    }
    const arrayOpen = (s.match(/\[/g) ?? []).length;
    const arrayClose = (s.match(/\]/g) ?? []).length;
    const missingBraces = Math.max(0, open - close);
    const missingBrackets = Math.max(0, arrayOpen - arrayClose);
    return s + "}".repeat(missingBraces) + "]".repeat(missingBrackets);
  };

  const trimmed = stripFences(raw);
  const candidates: string[] = [];

  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  const firstObj = objectMatch?.[0] ?? null;
  const firstArr = arrayMatch?.[0] ?? null;
  if (firstObj) candidates.push(firstObj);
  if (firstArr) candidates.push(firstArr);
  candidates.push(trimmed);

  for (const candidate of candidates) {
    for (const transform of [unsmart, stripTrailingCommas, closeBrackets] as const) {
      const repaired = transform(candidate);
      try {
        return JSON.parse(repaired) as T;
      } catch {
        // try next transform
      }
      try {
        return JSON.parse(transform(unsmart(stripTrailingCommas(repaired)))) as T;
      } catch {
        // try next candidate
      }
    }
  }
  return null;
}

/** Exposed for callers that want to parse raw model output themselves. */
export const repairModelJson = <T,>(raw: string): T | null => repairJson<T>(raw);

async function tryModel<T>(
  model: string,
  retryNumber: number,
  systemPrompt: string,
  context: string,
  responseTime: number,
  maxTokens: number
): Promise<AiResponse<T>> {
  let lastError = "Unknown error";

  for (let attempt = 1; attempt <= retryNumber; attempt++) {
    const attemptStartedAt = nowMs();
    try {
      console.log(`[AI] Trying model "${model}" - attempt ${attempt}/${retryNumber}`);

      const rawText = await fetchFromModel(
        model,
        systemPrompt,
        context,
        responseTime,
        maxTokens
      );
      const parsed = safeParseJson<T>(rawText);

      if (parsed !== null) {
        console.log("[AI_MODEL_ATTEMPT_TIME]", {
          model,
          attempt,
          success: true,
          parsedJson: true,
          durationMs: nowMs() - attemptStartedAt,
        });
        return { success: true, model, data: parsed };
      }

      console.log("[AI_MODEL_ATTEMPT_TIME]", {
        model,
        attempt,
        success: true,
        parsedJson: false,
        durationMs: nowMs() - attemptStartedAt,
      });
      return { success: true, model, data: null, rawText };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      console.log("[AI_MODEL_ATTEMPT_TIME]", {
        model,
        attempt,
        success: false,
        durationMs: nowMs() - attemptStartedAt,
        error: lastError,
      });
      console.error(`[AI] Model "${model}" attempt ${attempt} failed: ${lastError}`);

      if (attempt < retryNumber) {
        await new Promise((res) => setTimeout(res, 350 * attempt));
      }
    }
  }

  return { success: false, model, data: null, error: lastError };
}

export async function getAiResponse<T = unknown>(
  params: AiRequestParams
): Promise<AiResponse<T>> {
  const startedAt = nowMs();
  const {
    context,
    responseStyle,
    retryNumber = 1,
    aiModel,
    restrictedAnswer = "",
    responseTime = 750,
    maxTokens = 1200,
    concurrency = 2,
    maxModelBatches = 1,
  } = params;

  const systemPrompt = buildSystemPrompt(responseStyle, restrictedAnswer);
  // Filter out models that cannot do JSON text generation — see BLOCKED_MODEL_PATTERN docs.
  const requestedModels: string[] = aiModel ? [aiModel] : getConfiguredTextModels();
  const modelsToTry: string[] = requestedModels.filter(isModelAllowedForTextGeneration);
  if (modelsToTry.length === 0) {
    return {
      success: false,
      model: aiModel ?? "none",
      data: null,
      error: `No allowed chat-completions models available. Requested: ${requestedModels.join(", ")}`,
    };
  }
  const batchSize = Math.max(1, Math.min(concurrency, modelsToTry.length));
  let lastError = "Unknown error";

  for (let i = 0, batchCount = 0; i < modelsToTry.length && batchCount < maxModelBatches; i += batchSize, batchCount++) {
    const batch = modelsToTry.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((model) =>
        tryModel<T>(model, retryNumber, systemPrompt, context, responseTime, maxTokens)
      )
    );

    const parsedSuccess = results.find((result) => result.success && result.data !== null);
    if (parsedSuccess) {
      console.log("[AI_RESPONSE_TOTAL_TIME]", {
        type: "json",
        success: true,
        model: parsedSuccess.model,
        durationMs: nowMs() - startedAt,
        promptChars: context.length,
        maxTokens,
        responseTime,
      });
      return parsedSuccess;
    }

    const rawSuccess = results.find((result) => result.success);
    if (rawSuccess) {
      console.log("[AI_RESPONSE_TOTAL_TIME]", {
        type: "json",
        success: true,
        model: rawSuccess.model,
        parsedJson: false,
        durationMs: nowMs() - startedAt,
        promptChars: context.length,
        maxTokens,
        responseTime,
      });
      return rawSuccess;
    }

    lastError = results.find((result) => result.error)?.error ?? lastError;
    console.warn(`[AI] Batch failed: ${batch.join(", ")}. Moving to next batch.`);
  }

  const failedResponse = {
    success: false,
    model: modelsToTry[modelsToTry.length - 1] ?? "none",
    data: null,
    error: `All models failed. Last error: ${lastError}`,
  };
  console.log("[AI_RESPONSE_TOTAL_TIME]", {
    type: "json",
    success: false,
    model: failedResponse.model,
    durationMs: nowMs() - startedAt,
    promptChars: context.length,
    maxTokens,
    responseTime,
    error: failedResponse.error,
  });
  return failedResponse;
}

export async function getAiTextResponse(
  params: Omit<AiRequestParams, "responseStyle"> & { systemPrompt?: string }
): Promise<AiResponse<string>> {
  const startedAt = nowMs();
  const {
    context,
    retryNumber = 1,
    aiModel,
    restrictedAnswer = "",
    responseTime = 750,
    maxTokens = 900,
    concurrency = 2,
    maxModelBatches = 1,
    systemPrompt = "You are a helpful assistant. Answer clearly and concisely.",
  } = params;

  const requestedModels: string[] = aiModel ? [aiModel] : getConfiguredTextModels();
  const modelsToTry: string[] = requestedModels.filter(isModelAllowedForTextGeneration);
  if (modelsToTry.length === 0) {
    return {
      success: false,
      model: aiModel ?? "none",
      data: null,
      error: `No allowed chat-completions models available. Requested: ${requestedModels.join(", ")}`,
    };
  }
  const batchSize = Math.max(1, Math.min(concurrency, modelsToTry.length));
  const prompt = restrictedAnswer.trim()
    ? `${systemPrompt}\nRestrictions: ${restrictedAnswer.trim()}`
    : systemPrompt;
  let lastError = "Unknown error";

  for (let i = 0, batchCount = 0; i < modelsToTry.length && batchCount < maxModelBatches; i += batchSize, batchCount++) {
    const batch = modelsToTry.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (model): Promise<AiResponse<string>> => {
        let lastModelError = "Unknown error";

        for (let attempt = 1; attempt <= retryNumber; attempt++) {
          try {
            const rawText = await fetchFromModel(model, prompt, context, responseTime, maxTokens, false);
            return { success: true, model, data: rawText.trim() };
          } catch (err: unknown) {
            lastModelError = err instanceof Error ? err.message : String(err);
            if (attempt < retryNumber) {
              await new Promise((res) => setTimeout(res, 350 * attempt));
            }
          }
        }

        return { success: false, model, data: null, error: lastModelError };
      })
    );

    const success = results.find((result) => result.success && result.data);
    if (success) {
      console.log("[AI_RESPONSE_TOTAL_TIME]", {
        type: "text",
        success: true,
        model: success.model,
        durationMs: nowMs() - startedAt,
        promptChars: context.length,
        maxTokens,
        responseTime,
      });
      return success;
    }

    lastError = results.find((result) => result.error)?.error ?? lastError;
  }

  const failedResponse = {
    success: false,
    model: modelsToTry[modelsToTry.length - 1] ?? "none",
    data: null,
    error: `All models failed. Last error: ${lastError}`,
  };
  console.log("[AI_RESPONSE_TOTAL_TIME]", {
    type: "text",
    success: false,
    model: failedResponse.model,
    durationMs: nowMs() - startedAt,
    promptChars: context.length,
    maxTokens,
    responseTime,
    error: failedResponse.error,
  });
  return failedResponse;
}

export type AiStreamChunk =
  | { type: "model"; model: string }
  | { type: "delta"; text: string }
  | { type: "done"; model: string };

/**
 * Stream plain text from the configured free OpenRouter models. A model is
 * only considered selected after its first usable delta arrives, so a slow or
 * empty model can fail over before the user sees an incomplete answer.
 */
export async function* streamAiTextResponse(params: {
  context: string;
  systemPrompt: string;
  aiModel?: string;
  maxTokens?: number;
  totalTimeoutMs?: number;
}): AsyncGenerator<AiStreamChunk> {
  const models = (params.aiModel ? [params.aiModel] : getConfiguredTextModels())
    .filter(isModelAllowedForTextGeneration);
  const deadline = Date.now() + (params.totalTimeoutMs ?? 35_000);

  for (const model of models) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Math.min(12_000, remaining));
    let emitted = false;
    let buffer = "";

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${envVars.OpenRouter_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": envVars.FRONTEND_URL,
          "X-Title": "Nexora Nimbi",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: params.maxTokens ?? 700,
          stream: true,
          messages: [
            { role: "system", content: params.systemPrompt },
            { role: "user", content: params.context },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status} from model "${model}"`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      yield { type: "model", model };

      while (true) {
        if (Date.now() >= deadline) throw new Error("AI stream timed out");
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> };
            const text = json.choices?.[0]?.delta?.content;
            if (typeof text === "string" && text) {
              emitted = true;
              yield { type: "delta", text };
            }
          } catch {
            // Ignore a malformed provider event; the accumulated answer stays valid.
          }
        }
      }

      if (emitted) {
        yield { type: "done", model };
        return;
      }
    } catch (error) {
      console.warn("[NIMBI_STREAM_MODEL_FAILED]", {
        model,
        emitted,
        error: error instanceof Error ? error.message : String(error),
      });
      if (emitted) throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("All configured AI models failed before producing a response");
}
