import { z } from "zod";

export const earningsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  courseId: z.string().uuid().optional(),
});