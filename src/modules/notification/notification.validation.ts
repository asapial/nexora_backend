import { z } from "zod";

export const notificationListQuerySchema = z.object({
  type: z.string().trim().min(1).max(80).optional(),
  unread: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export const notificationIdParamsSchema = z.object({
  id: z.string().uuid(),
}).strict();
