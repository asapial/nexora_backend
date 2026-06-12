import { z } from "zod";

const optionalUrl = z.string().trim().url().max(2048).optional().nullable();
const note = z.string().trim().min(3).max(2000);
const emails = z.union([
  z.array(z.string().trim().toLowerCase().email()).min(1).max(100),
  z.string().transform((value) => value.split(/[\s,;]+/).filter(Boolean)),
]).pipe(z.array(z.string().trim().toLowerCase().email()).min(1).max(100));

export const createUsersByEmailSchema = z.object({ emails });
export const adminUpdateUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const rejectNoteSchema = z.object({ note });
export const revenuePercentSchema = z.object({ percent: z.number().min(0).max(100) });
export const approvePriceSchema = z.object({ price: z.number().positive().max(1_000_000) });

export const globalAnnouncementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().min(1).max(10_000),
  urgency: z.enum(["INFO", "IMPORTANT", "CRITICAL"]).optional(),
  targetRole: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
  targetUserId: z.string().min(1).optional(),
  scheduledAt: z.string().datetime().optional(),
});
export const warningSchema = z.object({ reason: note });
export const manualEnrollmentSchema = z.object({ userId: z.string().min(1), courseId: z.string().min(1) });
export const emailTemplateCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  subject: z.string().trim().min(2).max(200),
  description: z.string().trim().max(1000).optional(),
  body: z.string().min(1).max(100_000),
});
export const emailTemplateUpdateSchema = emailTemplateCreateSchema.omit({ slug: true }).partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const taskAssignmentSchema = z.object({
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(3000).optional(),
  homework: z.string().trim().max(5000).optional(),
  deadline: z.string().datetime().optional(),
});
export const taskUpdateSchema = taskAssignmentSchema.partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const taskReviewSchema = z.object({ finalScore: z.number().min(0).max(10), reviewNote: z.string().trim().max(3000).optional() });
export const taskTemplateCreateSchema = z.object({ title: z.string().trim().min(1).max(200), description: z.string().trim().max(3000).optional() });
export const taskTemplateUpdateSchema = taskTemplateCreateSchema.partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const teacherAnnouncementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().min(1).max(10_000),
  urgency: z.enum(["INFO", "IMPORTANT", "CRITICAL"]).optional(),
  clusterIds: z.array(z.string().min(1)).max(100).optional(),
  isGlobal: z.boolean().optional(),
  scheduledAt: z.string().datetime().optional(),
});
export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  clusterId: z.string().min(1).optional(),
  isGlobal: z.boolean().optional(),
});
export const categoryUpdateSchema = categoryCreateSchema.partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

const annotationFields = z.object({
  resourceId: z.string().min(1),
  highlight: z.string().max(10_000).optional(),
  note: z.string().max(10_000).optional(),
  page: z.number().int().min(1).max(100_000).optional(),
  isShared: z.boolean().optional(),
});
export const annotationCreateSchema = annotationFields
  .refine((value) => Boolean(value.highlight?.trim() || value.note?.trim()), "Highlight or note is required");
export const annotationUpdateSchema = annotationFields.omit({ resourceId: true }).partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const goalCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  target: z.string().trim().max(1000).optional(),
  clusterId: z.string().min(1).optional(),
  kanbanStatus: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
});
export const goalUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  target: z.string().trim().max(1000).optional(),
  isAchieved: z.boolean().optional(),
  kanbanStatus: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const taskSubmissionSchema = z.object({
  videoUrl: optionalUrl,
  textBody: z.string().max(50_000).optional().nullable(),
  pdfUrl: optionalUrl,
  fileSize: z.number().int().min(0).max(100 * 1024 * 1024).optional().nullable(),
}).refine((value) => Boolean(value.videoUrl || value.pdfUrl || value.textBody?.trim()), "At least one submission field is required");

export const testimonialCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  quote: z.string().trim().min(10).max(2000),
  rating: z.number().int().min(1).max(5),
});
export const teacherApplicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z.string().trim().max(40).optional(),
  designation: z.string().trim().max(120).optional(),
  institution: z.string().trim().max(200).optional(),
  department: z.string().trim().max(120).optional(),
  specialization: z.string().trim().max(200).optional(),
  experience: z.number().int().min(0).max(80).optional(),
  bio: z.string().trim().max(3000).optional(),
  linkedinUrl: optionalUrl,
  website: optionalUrl,
});
export const teacherApplicationRejectSchema = z.object({ note });

const chatHistoryItem = z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string().max(10_000) });
export const aiChatSchema = z.object({ message: z.string().trim().min(1).max(10_000), history: z.array(chatHistoryItem).max(50).optional().default([]) });
export const aiDescriptionSchema = z.object({ clusterName: z.string().trim().min(3).max(200) });

export const deleteAccountSchema = z.object({ confirmText: z.literal("DELETE") });
export const passwordSchema = z.object({ password: z.string().min(8).max(200) });
export const totpSchema = z.object({ code: z.string().regex(/^\d{6}$/) });
export const apiKeySchema = z.object({ label: z.string().trim().min(1).max(100) });

const strongPassword = z.string().min(8).max(200)
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/\d/, "Password must include a number");
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  password: strongPassword,
  image: z.string().url().max(2048).optional(),
  callbackURL: z.string().url().max(2048).optional(),
});
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
  rememberMe: z.boolean().optional(),
  callbackURL: z.string().url().max(2048).optional(),
});
export const demoLoginSchema = z.object({ role: z.enum(["ADMIN", "TEACHER", "STUDENT"]) });
export const changePasswordSchema = z.object({ oldPassword: z.string().min(1).max(200), newPassword: strongPassword });
export const emailSchema = z.object({ email: z.string().trim().toLowerCase().email() });
export const otpSchema = emailSchema.extend({ otp: z.string().regex(/^\d{6}$/) });
export const resetPasswordSchema = otpSchema.extend({ newPassword: strongPassword });

export const paymentCourseSchema = z.object({ courseId: z.string().min(1) });
export const paymentIntentSchema = z.object({ paymentIntentId: z.string().trim().min(1).max(255) });
export const resourceUpdateSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().max(3000).optional(),
  authors: z.array(z.string().trim().min(1).max(120)).max(30).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  year: z.union([z.coerce.number().int().min(1900).max(new Date().getFullYear()), z.literal("").transform(() => null)]).optional(),
  categoryId: z.string().min(1).optional(),
  clusterIds: z.array(z.string().min(1)).max(100).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "CLUSTER"]).optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const heroTeacherSchema = z.object({
  userId: z.string().min(1),
  displayName: z.string().trim().max(120).optional().nullable(),
  displayDesignation: z.string().trim().max(120).optional().nullable(),
  displayDepartment: z.string().trim().max(120).optional().nullable(),
  displayBio: z.string().trim().max(2000).optional().nullable(),
  order: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean(),
});
