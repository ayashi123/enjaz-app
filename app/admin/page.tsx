import Link from "next/link";
import { Activity, FileArchive, GraduationCap, Headset, ShieldCheck, Users } from "lucide-react";
import { getAdminOverviewData } from "@/lib/portal-data";
import { requireAdminSession } from "@/lib/session";

export default async function AdminPage() {
  await requireAdminSession();
  const data = await getAdminOverviewData();

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-primary">لوحة المشرف العام</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">إدارة المنصة والحسابات</h1>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
          هذه اللوحة تمنحك نظرة شاملة على الحسابات النشطة وعدد المدارس وحركة التقييمات والشواهد مع وصول مباشر إلى
          إدارة صلاحيات المستخدمين.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Users} label="إجمالي الحسابات" value={data.metrics.totalUsers} />
        <MetricCard icon={ShieldCheck} label="الحسابات النشطة" value={data.metrics.activeUsers} />
        <MetricCard icon={GraduationCap} label="المدارس" value={data.metrics.totalSchools} />
        <MetricCard icon={Activity} label="التقييمات" value={data.metrics.totalEvaluations} />
        <MetricCard icon={FileArchive} label="الشواهد" value={data.metrics.totalEvidences} />
        <MetricCard icon={Headset} label="تذاكر الدعم" value={data.metrics.openTickets} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">أحدث الحسابات</h2>
              <p className="mt-1 text-sm text-slate-500">آخر المستخدمين الذين تم إنشاؤهم داخل المنصة.</p>
            </div>
            <Link href="/admin/users" className="text-sm font-bold text-primary">
              فتح إدارة الحسابات
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {data.recentUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{user.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-700">{user.schoolName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {user.role === "SUPER_ADMIN" ? "مشرف عام" : "مدير مدرسة"} - {user.isActive ? "نشط" : "موقوف"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {getSubscriptionLabel(user.subscriptionStatus)}
                      {user.subscriptionEnd ? ` - حتى ${new Date(user.subscriptionEnd).toLocaleDateString("ar-SA")}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-slate-900">أقسام الإدارة</h2>
          <div className="mt-5 grid gap-3">
            <QuickLink href="/admin/users" title="إدارة الحسابات" description="تعديل دور المستخدم وتفعيل الحسابات أو إيقافها." />
            <QuickLink href="/admin/support" title="الدعم الفني" description="إدارة تذاكر المشتركين والرد عليها وتحديث حالتها." />
            <QuickLink href="/dashboard" title="الدخول إلى المنصة التعليمية" description="الانتقال إلى لوحة المدرسة والعمليات التنفيذية." />
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <div className="rounded-2xl bg-[#edf5f1] p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 transition hover:bg-slate-100">
      <p className="font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-7 text-slate-500">{description}</p>
    </Link>
  );
}

function getSubscriptionLabel(status: "ACTIVE" | "TRIAL" | "EXPIRED" | "SUSPENDED") {
  switch (status) {
    case "TRIAL":
      return "تجريبي";
    case "EXPIRED":
      return "منتهي";
    case "SUSPENDED":
      return "معلق";
    default:
      return "نشط";
  }
}
