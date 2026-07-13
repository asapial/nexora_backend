const response = await fetch("https://openrouter.ai/api/v1/models");
const payload = await response.json() as { data?: Array<Record<string, any>> };
const models = (payload.data ?? [])
  .filter((model) => String(model.id).endsWith(":free"))
  .filter((model) => (model.architecture?.output_modalities ?? ["text"]).includes("text"))
  .map((model) => ({ id: model.id, context: model.context_length, name: model.name }))
  .slice(0, 30);
console.log(JSON.stringify(models, null, 2));
