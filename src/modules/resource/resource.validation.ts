import  z  from "zod";

export const createResourceSchema = z.object({

    uploaderId: z.string(),

    clusterId: z.string().optional(),
    categoryId: z.string().optional(),

    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(200),

    description: z
      .string()
      .max(2000)
      .optional(),

    // fileUrl: z
    //   .string()
    //   .url("Invalid file URL"),

    fileType: z
      .string()
      .min(2, "File type required"),

    visibility: z
      .enum(["PUBLIC", "PRIVATE", "CLUSTER"])
      .optional(),

    tags: z
      .array(z.string())
      .default([]),

    authors: z
      .array(z.string())
      .default([]),

    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear())
      .optional(),

    isFeatured: z
      .boolean()
      .optional()
  
});