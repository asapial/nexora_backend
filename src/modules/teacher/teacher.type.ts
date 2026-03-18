import { z } from "zod";

export const updateTeacherProfileSchema = z.object({
  body: z.object({
    designation: z.string().optional(),
    department: z.string().optional(),
    institution: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
  }),
});

export type updateTeacherProfileType = z.infer<typeof updateTeacherProfileSchema>;
