import { z } from "zod";

const option = z.object({ text: z.string().trim().min(1), isCorrect: z.boolean().default(false) });
const proctorPolicy = z.object({
  cameraRequired: z.boolean().default(true),
  snapshotEnabled: z.boolean().default(true),
  sensitivity: z.enum(["RELAXED", "STANDARD", "STRICT"]).default("STANDARD"),
  studentWarnings: z.boolean().default(true),
  roughPaperAllowed: z.boolean().default(true),
  evidenceRetentionDays: z.number().int().refine((value) => [7, 30, 90].includes(value), "Retention must be 7, 30, or 90 days").default(30),
}).strict();

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

const examFieldsSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(2000).optional(),
  clusterId: z.string().min(1),
  type: z.enum(["MCQ", "CQ", "MIXED"]),
  examMode: z.enum(["REGULAR", "PRO"]).default("REGULAR"),
  proctorPolicy: proctorPolicy.optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  durationMinutes: z.number().int().min(1).max(1440).optional().nullable(),
  questions: z.array(question).default([]),
});

const validateExamFields = (
  data: {
    type?: "MCQ" | "CQ" | "MIXED" | undefined;
    examMode?: "REGULAR" | "PRO" | undefined;
    proctorPolicy?: z.infer<typeof proctorPolicy> | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    questions?: z.infer<typeof question>[] | undefined;
  },
  ctx: z.RefinementCtx,
) => {
  if (data.startTime && data.endTime && new Date(data.endTime) <= new Date(data.startTime)) {
    ctx.addIssue({ code: "custom", message: "End time must be after start time", path: ["endTime"] });
  }
  const kinds = new Set((data.questions ?? []).map((item) => item.type));
  if (data.type === "MCQ" && kinds.has("CQ")) ctx.addIssue({ code: "custom", message: "MCQ exams cannot contain CQ questions", path: ["questions"] });
  if (data.type === "CQ" && kinds.has("MCQ")) ctx.addIssue({ code: "custom", message: "CQ exams cannot contain MCQ questions", path: ["questions"] });
  if (data.examMode === "PRO" && !data.proctorPolicy) ctx.addIssue({ code: "custom", message: "Pro Mode requires integrity settings", path: ["proctorPolicy"] });
  if (data.examMode === "REGULAR" && data.proctorPolicy) ctx.addIssue({ code: "custom", message: "Regular Mode cannot contain Pro Mode settings", path: ["proctorPolicy"] });
};

export const createExamSchema = examFieldsSchema.superRefine((data, ctx) => {
  validateExamFields(data, ctx);
});

export const updateExamSchema = examFieldsSchema
  .omit({ questions: true })
  .partial()
  .superRefine(validateExamFields);
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

export const startExamSchema = z.object({
  preflightToken: z.string().min(32).max(256).optional(),
}).strict();

export const proctorPreflightSchema = z.object({
  consent: z.literal(true),
  cameraReady: z.literal(true),
  faceCount: z.number().int().min(1).max(1).optional(),
  calibration: z.object({
    cameraWidth: z.number().int().min(160).max(4096),
    cameraHeight: z.number().int().min(120).max(2160),
    detectorSupported: z.boolean(),
  }).strict(),
}).strict();

export const gradeAttemptSchema = z.object({
  grades: z.array(z.object({ answerId: z.string(), awardedMarks: z.number().min(0), note: z.string().optional() })),
});

export const resultPublicationSchema = z.object({
  resultsPublished: z.boolean().optional(),
  answerSheetPublished: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "Choose at least one publication setting");

export const individualResultEmailSchema = z.object({
  attemptId: z.string().trim().min(1, "Attempt is required"),
}).strict();

export const proctorEventSchema = z.object({
  clientEventId: z.string().uuid().optional(),
  type: z.enum([
    "TAB_HIDDEN", "WINDOW_BLUR", "PAGE_EXIT", "FULLSCREEN_EXIT", "COPY_ATTEMPT", "PASTE_ATTEMPT",
    "FACE_NOT_VISIBLE", "MULTIPLE_FACES", "CAMERA_INTERRUPTED", "CAMERA_PERMISSION_REVOKED", "CAMERA_DEVICE_CHANGED", "PREFLIGHT_FAILED",
    "HEAD_TURN_HORIZONTAL", "EYE_MOVEMENT_HORIZONTAL", "PHONE_DETECTED",
  ]),
  pageUrl: z.string().max(2048).optional(),
  referrer: z.string().max(2048).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  durationMs: z.number().int().min(0).max(120000).optional(),
  confidence: z.number().min(0).max(1).optional(),
  snapshotDataUrl: z.string()
    .max(700000)
    .regex(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/, "Snapshot must be a JPEG data URL")
    .optional(),
}).strict();

export const proctorReviewSchema = z.object({
  decision: z.enum(["DISMISSED", "CONFIRMED_CONCERN", "NEEDS_FOLLOW_UP"]),
  note: z.string().trim().max(2000).optional(),
}).strict();

export const clearProctorFeedSchema = z.object({
  attemptId: z.string().trim().min(1, "Student attempt is required"),
}).strict();
