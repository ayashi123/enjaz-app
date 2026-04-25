import NextAuth, { DefaultSession } from "next-auth";
import { SubscriptionStatus, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      subscriptionStatus: SubscriptionStatus;
      schoolName: string;
      educationOffice: string;
      academicYear: string;
    };
  }

  interface User {
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    schoolName: string;
    educationOffice: string;
    academicYear: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    schoolName: string;
    educationOffice: string;
    academicYear: string;
  }
}
