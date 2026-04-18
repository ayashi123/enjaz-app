import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/components/forms/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="مرحبًا بعودتك"
      description="سجّل الدخول للوصول إلى لوحة منصة إنجاز التعليمية ومتابعة بيانات المدرسة والمعلمين."
      footerText="هل تحتاج إلى حساب جديد؟"
      footerLink="/register"
      footerLinkLabel="إنشاء حساب"
    >
      <LoginForm />
    </AuthShell>
  );
}
