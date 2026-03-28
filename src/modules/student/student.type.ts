import { z } from "zod";

export const updateStudentProfileSchema = z.object({
  body: z.object({
    institution: z.string().optional(),
    batch: z.string().optional(),
    programme: z.string().optional(),
    bio: z.string().optional(),
    linkedinUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
  }),
});

export type updateStudentProfileType = z.infer<typeof updateStudentProfileSchema>;
