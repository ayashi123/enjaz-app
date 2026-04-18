import { z } from "zod";

export const evaluationElementSchema = z.object({
  elementId: z.string().min(1),
  score: z.number().min(1).max(5),
  strengthNote: z.string().optional().default(""),
  developmentNote: z.string().optional().default(""),
});

export const evaluationSchema = z.object({
  teacherId: z.string().min(1, "اختر المعلم."),
  followupNo: z.string().min(1, "أدخل رقم المتابعة."),
  visitDate: z.string().min(1, "أدخل تاريخ الزيارة."),
  lessonTitle: z.string().min(2, "أدخل عنوان الدرس."),
  managerName: z.string().min(2, "أدخل اسم معد التقرير."),
  strengths: z.array(z.string()).default([]),
  developmentPoints: z.array(z.string()).default([]),
  aiFeedback: z.string().default(""),
  recommendations: z.array(z.string()).default([]),
  teacherSignature: z.string().optional().default(""),
  managerSignature: z.string().optional().default(""),
  elements: z.array(evaluationElementSchema).length(11, "يجب تقييم جميع العناصر الرسمية."),
});

export type EvaluationInput = z.infer<typeof evaluationSchema>;
