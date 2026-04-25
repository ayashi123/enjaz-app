import { z } from "zod";

export const externalEvaluationIndicatorSchema = z.object({
  domainId: z.string().min(1),
  domainTitle: z.string().min(1),
  standardId: z.string().min(1),
  standardTitle: z.string().min(1),
  indicatorCode: z.string().min(1),
  indicatorText: z.string().min(1),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  notes: z.string().optional().default(""),
});

export const externalEvaluationEvidenceSchema = z
  .object({
    title: z.string().min(2, "أدخل اسم الشاهد."),
    fileUrl: z.string().url().optional().or(z.literal("")),
    linkUrl: z.string().url().optional().or(z.literal("")),
    note: z.string().optional().default(""),
  })
  .refine((value) => Boolean(value.fileUrl || value.linkUrl), {
    message: "أضف ملفًا مرفوعًا أو رابطًا على الأقل.",
    path: ["fileUrl"],
  });

export type ExternalEvaluationIndicatorInput = z.infer<typeof externalEvaluationIndicatorSchema>;
export type ExternalEvaluationEvidenceInput = z.infer<typeof externalEvaluationEvidenceSchema>;
