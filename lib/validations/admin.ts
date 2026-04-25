import { z } from "zod";

export const adminUserUpdateSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "SCHOOL_MANAGER"]),
  isActive: z.boolean(),
  subscriptionStatus: z.enum(["ACTIVE", "TRIAL", "EXPIRED", "SUSPENDED"]),
  subscriptionEnd: z.string().nullable().optional(),
});
