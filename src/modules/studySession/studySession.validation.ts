import { z } from "zod";

/* ── Create Session ───────────────────────────────────────────────────────── */
export const createSessionSchema = z.object({
  clusterId: z.string().min(1, "clusterId must not be empty"),
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().max(2000).optional(),
  scheduledAt: z
    .string()
    .min(1, "date (scheduledAt) is required")
    .datetime({ message: "date must be a valid ISO 8601 datetime string" }),
  location: z.string().max(200).optional(),
  taskDeadline: z
    .string()
    .datetime({ message: "deadline must be a valid ISO 8601 datetime string" })
    .optional(),
  templateId: z.string().optional(),
});

/* ── Update Session ───────────────────────────────────────────────────────── */
export const updateSessionSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().max(2000).optional(),
    status:z.enum(["upcoming", "completed", "cancel"]),
    date: z
      .string()
      .datetime({ message: "date must be a valid ISO 8601 datetime string" })
      .optional(),
    location: z.string().max(200).optional(),
    deadline: z
      .string()
      .datetime({ message: "deadline must be a valid ISO 8601 datetime string" })
      .optional(),
    templateId: z.string().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field must be provided to update",
  });

/* ── Submit Attendance ────────────────────────────────────────────────────── */
const attendanceRecordSchema = z.object({
  studentId: z.string().min(1, "studentId must not be empty"),
  status: z.enum(["PRESENT", "ABSENT", "EXCUSED"], {
    message: 'status must be one of: "PRESENT", "ABSENT", or "EXCUSED"',
  }),
  note: z.string().max(500).optional(),
});

export const submitAttendanceSchema = z.object({
  attendance: z
    .array(attendanceRecordSchema)
    .min(1, "attendance array must have at least one record"),
});

/* ── Create / Update Agenda ───────────────────────────────────────────────── */
const agendaBlockSchema = z.object({
  startTime: z
    .string()
    .min(1, "startTime is required")
    .regex(/^\d{2}:\d{2}$/, 'startTime must be in HH:MM format (e.g. "14:00")'),
  durationMins: z
    .number({ message: "durationMins must be a number" })
    .int()
    .min(1, "durationMins must be at least 1"),
  topic: z
    .string()
    .min(1, "topic must not be empty")
    .max(300),
  presenter: z.string().max(150).optional(),
});

export const createAgendaSchema = z.object({
  blocks: z
    .array(agendaBlockSchema)
    .min(1, "blocks array must have at least one item"),
});

/* ── Submit Feedback ──────────────────────────────────────────────────────── */
export const submitFeedbackSchema = z.object({
  rating: z
    .number({ message: "rating must be a number" })
    .int()
    .min(1, "rating must be between 1 and 5")
    .max(5, "rating must be between 1 and 5"),
  comment: z.string().max(2000).optional(),
});

/* ── Attach Replay ────────────────────────────────────────────────────────── */
const replayNoteSchema = z.object({
  timestamp: z
    .string()
    .min(1, "timestamp is required")
    .regex(/^\d{2}:\d{2}$/, 'timestamp must be in HH:MM format (e.g. "14:35")'),
  note: z.string().min(1, "note must not be empty").max(500),
});

export const attachReplaySchema = z.object({
  recordingUrl: z
    .string()
    .min(1, "recordingUrl is required")
    .url("recordingUrl must be a valid URL"),
  notes: z.array(replayNoteSchema).optional(),
});
