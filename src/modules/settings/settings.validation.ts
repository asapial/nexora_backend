import { z } from "zod";

const optionalUrl = z
  .string()
  .optional()
  .refine((v) => !v || v === "" || z.string().url().safeParse(v).success, "Invalid URL");

export const updateAccountSettingsSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  image: z.string().url().optional().nullable(),
  teacherProfile: z
    .object({
      designation: z.string().max(120).optional(),
      department: z.string().max(120).optional(),
      institution: z.string().max(200).optional(),
      bio: z.string().max(2000).optional(),
      website: optionalUrl,
      linkedinUrl: optionalUrl,
      specialization: z.string().max(200).optional(),
      googleScholarUrl: optionalUrl,
      officeHours: z.string().max(500).optional(),
      researchInterests: z.array(z.string().max(80)).max(20).optional(),
    })
    .optional(),
    studentProfile: z
      .object({
        phone: z.string().max(40).optional(),
        address: z.string().max(500).optional(),
        bio: z.string().max(2000).optional(),
        institution: z.string().max(200).optional(),
        department: z.string().max(120).optional(),
        batch: z.string().max(80).optional(),
        programme: z.string().max(120).optional(),
        linkedinUrl: optionalUrl,
        githubUrl: optionalUrl,
        website: optionalUrl,
        nationality: z.string().max(80).optional(),
      })
      .optional(),
    adminProfile: z
      .object({
        phone: z.string().max(40).optional(),
        bio: z.string().max(2000).optional(),
        nationality: z.string().max(80).optional(),
        designation: z.string().max(120).optional(),
        department: z.string().max(120).optional(),
        organization: z.string().max(200).optional(),
        linkedinUrl: optionalUrl,
        website: optionalUrl,
      })
      .optional(),
    preferences: z
      .object({
        timezone: z.string().max(120).optional(),
        language: z.string().max(80).optional(),
        emailNotifications: z.record(z.string(), z.boolean()).optional(),
        pushNotifications: z.record(z.string(), z.boolean()).optional(),
        privacy: z.record(z.string(), z.union([z.boolean(), z.string()])).optional(),
      })
      .optional(),
});

export type UpdateAccountSettingsBody = z.infer<typeof updateAccountSettingsSchema>;
