import { envVars } from "../config/env";

const nowMs = () => Number(process.hrtime.bigint() / 1_000_000n);

const FREE_MODELS: string[] = [
  "google/gemma-3-4b-it:free",
  "openai/gpt-oss-20b:free",
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/owl-alpha",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "poolside/laguna-m.1:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openai/gpt-oss-120b:free",
  "poolside/laguna-xs.2:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "nvidia/llama-nemotron-embed-vl-1b-v2:free",
];

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

    const content: string = json?.choices?.[0]?.message?.content ?? "";
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
  try {
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    return JSON.parse(objectMatch?.[0] ?? arrayMatch?.[0] ?? cleaned) as T;
  } catch {
    return null;
  }
}

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
  const modelsToTry: string[] = aiModel ? [aiModel] : FREE_MODELS;
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

  const modelsToTry: string[] = aiModel ? [aiModel] : FREE_MODELS;
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
