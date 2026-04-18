import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("أدخل بريدًا إلكترونيًا صحيحًا."),
  password: z.string().min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "أدخل الاسم الكامل."),
  email: z.string().email("أدخل بريدًا إلكترونيًا صحيحًا."),
  password: z.string().min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."),
  schoolName: z.string().min(3, "أدخل اسم المدرسة."),
  educationOffice: z.string().min(3, "أدخل مكتب التعليم أو الإدارة."),
  academicYear: z.string().min(3, "أدخل العام الدراسي."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
