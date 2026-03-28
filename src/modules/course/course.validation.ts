import { z } from "zod";


export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().max(2000).optional(),
  thumbnailUrl: z.string().url().optional(),
  tags: z.array(z.string().max(24)).max(8).default([]),
  isFree: z.boolean(),
  requestedPrice: z.number().positive("Price must be positive").optional(),
  priceNote: z.string().max(500).optional(),
}).refine(
  data => data.isFree || (data.requestedPrice !== undefined && data.requestedPrice > 0),
  { message: "Paid courses must include a requested price", path: ["requestedPrice"] }
);

export const createMissionSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  order: z.number().int().min(0).optional(),
});

export const createPriceRequestSchema = z.object({
  requestedPrice: z.number().positive("Price must be positive"),
  note: z.string().max(500).optional(),
});

export const enrollmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  paymentStatus: z.enum(["FREE", "PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(2000).optional(),
  thumbnailUrl: z.string().url().optional(),
  tags: z.array(z.string().max(24)).max(8).optional(),
});

export const updateMissionSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(1000).optional(),
  order: z.number().int().min(0).optional(),
});