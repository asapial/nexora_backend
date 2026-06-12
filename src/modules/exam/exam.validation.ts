import { z } from "zod";

const option = z.object({ text: z.string().trim().min(1), isCorrect: z.boolean().default(false) });
const question = z.object({
  type: z.enum(["MCQ", "CQ"]),
  prompt: z.string().trim().min(1),
  explanation: z.string().trim().optional(),
  marks: z.number().positive().default(1),
  options: z.array(option).max(6).default([]),
}).superRefine((value, ctx) => {
  if (value.type === "MCQ" && (value.options.length < 2 || value.options.filter((item) => item.isCorrect).length !== 1)) {
    ctx.addIssue({ code: "custom", message: "MCQ questions need at least two options and exactly one correct answer", path: ["options"] });
  }
  if (value.type === "CQ" && value.options.length) {
    ctx.addIssue({ code: "custom", message: "CQ questions cannot contain options", path: ["options"] });
  }
});

export const createExamSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(2000).optional(),
  clusterId: z.string().min(1),
  type: z.enum(["MCQ", "CQ", "MIXED"]),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  durationMinutes: z.number().int().min(1).max(1440).optional().nullable(),
  questions: z.array(question).default([]),
}).superRefine((data, ctx) => {
  if (new Date(data.endTime) <= new Date(data.startTime)) {
    ctx.addIssue({ code: "custom", message: "End time must be after start time", path: ["endTime"] });
  }
  const kinds = new Set(data.questions.map((item) => item.type));
  if (data.type === "MCQ" && kinds.has("CQ")) ctx.addIssue({ code: "custom", message: "MCQ exams cannot contain CQ questions", path: ["questions"] });
  if (data.type === "CQ" && kinds.has("MCQ")) ctx.addIssue({ code: "custom", message: "CQ exams cannot contain MCQ questions", path: ["questions"] });
});

export const updateExamSchema = createExamSchema.partial().omit({ questions: true });
export const questionsSchema = z.object({ questions: z.array(question).min(1) });
export const rejectExamSchema = z.object({ reason: z.string().trim().min(3).max(1000) });

export const submitExamSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    optionId: z.string().nullable().optional(),
    textAnswer: z.string().max(20000).nullable().optional(),
  })),
  autoSubmit: z.boolean().optional().default(false),
});

export const gradeAttemptSchema = z.object({
  grades: z.array(z.object({ answerId: z.string(), awardedMarks: z.number().min(0), note: z.string().optional() })),
});

export const proctorEventSchema = z.object({
  type: z.enum(["TAB_HIDDEN", "WINDOW_BLUR", "PAGE_EXIT", "FULLSCREEN_EXIT", "COPY_ATTEMPT", "PASTE_ATTEMPT"]),
  pageUrl: z.string().max(2048).optional(),
  referrer: z.string().max(2048).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
