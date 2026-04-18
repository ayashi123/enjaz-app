import { z } from "zod";

export const managerElementSchema = z.object({
  elementTitle: z.string().min(2),
  isDone: z.boolean(),
  notes: z.string().optional().default(""),
});

export type ManagerElementInput = z.infer<typeof managerElementSchema>;
