import { z } from "zod";

const option = z.object({ text: z.string().trim().min(1), isCorrect: z.boolean() });
const question = z.object({
  prompt: z.string().trim().min(1),
  explanation: z.string().trim().optional(),
  marks: z.number().positive().default(1),
  options: z.array(option).min(4).max(6).refine((options) => options.filter((item) => item.isCorrect).length === 1, {
    message: "Each question must have exactly one correct option",
  }),
});

export const createExamSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(2000).optional(),
  audience: z.enum(["CLUSTER", "PLATFORM"]),
  clusterId: z.string().optional(),
  deadline: z.string().datetime().optional().nullable(),
  durationMinutes: z.number().int().min(1).max(1440).optional().nullable(),
  questions: z.array(question).min(1),
}).refine((data) => data.audience !== "CLUSTER" || Boolean(data.clusterId), {
  message: "A cluster is required for cluster exams",
  path: ["clusterId"],
});

export const grantAccessSchema = z.object({
  userIds: z.array(z.string()).optional(),
  grantAll: z.boolean().optional().default(false),
});

export const submitExamSchema = z.object({
  answers: z.array(z.object({ questionId: z.string(), optionId: z.string().nullable().optional() })),
});

export const proctorEventSchema = z.object({
  type: z.enum(["TAB_HIDDEN", "WINDOW_BLUR", "PAGE_EXIT", "FULLSCREEN_EXIT", "COPY_ATTEMPT", "PASTE_ATTEMPT"]),
  pageUrl: z.string().max(2048).optional(),
  referrer: z.string().max(2048).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
