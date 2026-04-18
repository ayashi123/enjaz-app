import { z } from "zod";

export const settingsSchema = z.object({
  schoolLogo: z.string().optional().default(""),
  managerSignatureImage: z.string().optional().default(""),
  officialStampImage: z.string().optional().default(""),
  printHeader: z.string().optional().default(""),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
