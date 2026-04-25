import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { PublicSupportForm } from "@/components/support/public-support-form";
import { AuthShell } from "@/components/layout/auth-shell";
import { authOptions } from "@/lib/auth";

export default async function SupportAccessPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard/support");
  }

  return (
    <AuthShell
      title="الدعم الفني للمشتركين"
      description="إذا كانت لديك مشكلة في تسجيل الدخول أو كلمة المرور أو حالة الاشتراك، أرسل طلبك من هنا باستخدام البريد المسجل في المنصة."
      footerText="هل تذكرت بيانات الدخول؟"
      footerLink="/login"
      footerLinkLabel="العودة إلى تسجيل الدخول"
    >
      <PublicSupportForm />
    </AuthShell>
  );
}
