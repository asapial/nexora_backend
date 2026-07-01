import { z } from "zod";

const contentFieldsSchema = z.object({
  type: z.enum(["VIDEO", "TEXT", "PDF"]),
  title: z.string().min(2).max(120),
  order: z.number().int().min(0).optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(),
  textBody: z.string().max(100000).optional(),
  pdfUrl: z.string().url().optional(),
  fileSize: z.number().int().positive().optional(),
});

const validateContentUrl = (
  data: {
    type?: "VIDEO" | "TEXT" | "PDF" | undefined;
    videoUrl?: string | undefined;
    pdfUrl?: string | undefined;
  },
  ctx: z.RefinementCtx,
) => {
  if (data.type === "VIDEO" && !data.videoUrl) {
    ctx.addIssue({ code: "custom", message: "VIDEO type requires a videoUrl", path: ["videoUrl"] });
  }
  if (data.type === "PDF" && !data.pdfUrl) {
    ctx.addIssue({ code: "custom", message: "PDF type requires a pdfUrl", path: ["pdfUrl"] });
  }
};

export const createContentSchema = contentFieldsSchema.superRefine(validateContentUrl);

export const reorderContentsSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

export const updateContentSchema = contentFieldsSchema.partial()
  .superRefine(validateContentUrl)
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });
