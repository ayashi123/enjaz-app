import { z } from "zod";

export const teacherSchema = z.object({
  fullName: z.string().min(3, "أدخل اسم المعلم الكامل."),
  nationalId: z.string().trim().default(""),
  specialization: z.string().trim().default(""),
  subject: z.string().trim().default(""),
  className: z.string().trim().default(""),
});

export type TeacherInput = z.infer<typeof teacherSchema>;
export type TeacherFormValues = z.input<typeof teacherSchema>;
