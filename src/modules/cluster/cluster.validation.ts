import { z } from "zod";

const emailList = z.array(z.string().trim().toLowerCase().email()).min(1).max(100);

export const createClusterSchema = z.object({
  name: z.string().trim().min(3).max(100),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(1000).optional(),
  batchTag: z.string().trim().max(100).optional(),
  emails: emailList.optional().default([]),
});

export const addClusterMembersSchema = z.object({ data: emailList });

/* ─────────────────────────────────────────────
   Existing: update cluster
   ───────────────────────────────────────────── */
export const updateClusterSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100)
    .optional(),

  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and URL-friendly")
    .optional(),

  description: z.string().max(1000).optional(),

  batchTag: z.string().max(100).optional(),

  isActive: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");

/* ─────────────────────────────────────────────
   PATCH /clusters/:id/members/:userId
   Change a member's subtype
   ───────────────────────────────────────────── */
export const updateMemberSubtypeSchema = z.object({
  subtype: z
    .enum(["EMERGING", "RUNNING", "ALUMNI"])
    .refine((val) => true, {
      message:
        "subtype must be one of: EMERGING (view-only onboarding), RUNNING (full participation), or ALUMNI (read-only archive).",
    }),
});

/* ─────────────────────────────────────────────
   POST /clusters/:id/co-teachers
   Invite a co-teacher
   ───────────────────────────────────────────── */
export const addCoTeacherSchema = z.object({
  userId: z
    .string()
    .min(1, "userId must not be empty"),

  canEdit: z
    .boolean()
    .refine((val) => typeof val === "boolean", {
      message: "canEdit must be a boolean (true = full permissions, false = read-only)",
    }),
});
