// ─── Type coercion — Prisma needs the right JS types ──────
// cgpa must be Float (number), experience must be Int (number)
// skills / researchInterests must be string[]
export function coerceValue(key: string, value: unknown): unknown {
  if (key === "cgpa") {
    const n = parseFloat(value as string);
    return isNaN(n) ? null : n;
  }
  if (key === "experience") {
    const n = parseInt(value as string, 10);
    return isNaN(n) ? null : n;
  }
  if (key === "skills" || key === "researchInterests") {
    if (!Array.isArray(value)) return [];
    return (value as unknown[]).filter((v) => typeof v === "string");
  }
  return value;
}
 