import { z } from "zod";

export const createContentSchema = z.object({
  type: z.enum(["VIDEO", "TEXT", "PDF"]),
  title: z.string().min(2).max(120),
  order: z.number().int().min(0).optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(),
  textBody: z.string().max(100000).optional(),
  pdfUrl: z.string().url().optional(),
  fileSize: z.number().int().positive().optional(),
}).refine(
  data => !(data.type === "VIDEO") || !!data.videoUrl,
  { message: "VIDEO type requires a videoUrl", path: ["videoUrl"] }
).refine(
  data => !(data.type === "PDF") || !!data.pdfUrl,
  { message: "PDF type requires a pdfUrl", path: ["pdfUrl"] }
);

export const reorderContentsSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});