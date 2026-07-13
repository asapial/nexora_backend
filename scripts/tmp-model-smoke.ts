import "dotenv/config";
import { getAiResponse } from "../src/utils/aiResponse";

for (const model of [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
]) {
  const result = await getAiResponse<{ ok: boolean }>({
    aiModel: model,
    context: "Return ok true.",
    responseStyle: "Return JSON: {\"ok\": true}",
    responseTime: 20_000,
    maxTokens: 40,
    retryNumber: 1,
  });
  console.log(JSON.stringify({ model, success: result.success, data: result.data, error: result.error }));
  if (result.success) break;
}
