import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { AuthShell } from "@/components/layout/auth-shell";
import { authOptions } from "@/lib/auth";

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="استعادة كلمة المرور"
      description="استخدم هذه الصفحة لبدء مسار استعادة كلمة المرور. تم تجهيز الواجهة للمستخدمين الآن، وسيتم ربطها بخدمة الإرسال الآلي في الخطوة التالية."
      footerText="تذكرت كلمة المرور؟"
      footerLink="/login"
      footerLinkLabel="العودة لتسجيل الدخول"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
