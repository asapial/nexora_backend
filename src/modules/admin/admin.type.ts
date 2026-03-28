import { z } from "zod";

export const createTeacherSchema = z.object({
  body: z.object({
    emails: z
      .array(z.string().email("Invalid email format"))
      .min(1, "At least one email is required"),
  }),
});

export type createTeacherType = z.infer<typeof createTeacherSchema>;
