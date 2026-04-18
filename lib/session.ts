import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export class UnauthorizedApiError extends Error {
  constructor(message = "يجب تسجيل الدخول أولًا.") {
    super(message);
    this.name = "UnauthorizedApiError";
  }
}

export async function requireSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

export async function requireApiSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new UnauthorizedApiError();
  }

  return session;
}
