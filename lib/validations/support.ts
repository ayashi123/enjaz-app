import { z } from "zod";

export const supportTicketSchema = z.object({
  subject: z.string().min(3, "عنوان التذكرة قصير جدًا."),
  category: z.string().min(2, "حدد نوع المشكلة."),
  description: z.string().min(10, "يرجى كتابة وصف واضح للمشكلة."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const supportReplySchema = z.object({
  message: z.string().min(2, "اكتب ردًا صالحًا."),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
});
