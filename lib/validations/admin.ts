import { z } from "zod";

export const adminUserUpdateSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "SCHOOL_MANAGER"]),
  isActive: z.boolean(),
});
