import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { RegisterForm } from "@/components/forms/register-form";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="إنشاء حساب مدير المدرسة"
      description="ابدأ إعداد منصة إنجاز التعليمية عبر إنشاء ملف المدير والمدرسة والبيانات الأساسية للعام الدراسي."
      footerText="لديك حساب بالفعل؟"
      footerLink="/login"
      footerLinkLabel="تسجيل الدخول"
    >
      <RegisterForm />
    </AuthShell>
  );
}
