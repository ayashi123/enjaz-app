import { z } from "zod";
import { managerEvidenceTypes } from "@/data/manager-elements";

export const evidenceSchema = z.object({
  title: z.string().min(2, "أدخل عنوان الشاهد."),
  relatedType: z.enum(["MANAGER_ELEMENT", "TEACHER", "TEACHER_EVALUATION", "GENERAL"]),
  relatedRef: z.string().optional().default(""),
  evidenceType: z.enum(managerEvidenceTypes, { message: "حدد نوع الشاهد من القائمة المعتمدة." }),
  status: z.enum(["DRAFT", "VERIFIED", "ARCHIVED"]),
  evidenceDate: z.string().min(1, "أدخل تاريخ الشاهد."),
  notes: z.string().optional().default(""),
  attachments: z.array(z.string()).default([]),
});

export type EvidenceInput = z.infer<typeof evidenceSchema>;
