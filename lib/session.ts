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

export async function requireAdminSession() {
  const session = await requireSession();

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return session;
}

export async function requireAdminApiSession() {
  const session = await requireApiSession();

  if (session.user.role !== "SUPER_ADMIN") {
    throw new UnauthorizedApiError("هذه العملية متاحة للمشرف العام فقط.");
  }

  return session;
}
