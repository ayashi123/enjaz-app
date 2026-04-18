import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      schoolName: string;
      educationOffice: string;
      academicYear: string;
    };
  }

  interface User {
    schoolName: string;
    educationOffice: string;
    academicYear: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    schoolName: string;
    educationOffice: string;
    academicYear: string;
  }
}
