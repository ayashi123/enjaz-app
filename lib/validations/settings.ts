import { z } from "zod";

export const settingsSchema = z.object({
  schoolLogo: z.string().optional().default(""),
  managerSignatureImage: z.string().optional().default(""),
  officialStampImage: z.string().optional().default(""),
  printHeader: z.string().optional().default(""),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "أدخل كلمة المرور الحالية أو المؤقتة."),
    newPassword: z.string().min(8, "يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل."),
    confirmPassword: z.string().min(8, "أعد كتابة كلمة المرور الجديدة."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "تأكيد كلمة المرور غير مطابق.",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
