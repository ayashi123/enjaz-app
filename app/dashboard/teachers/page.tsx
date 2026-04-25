import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TeachersTable } from "@/components/teachers/teachers-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeachersData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function TeachersPage() {
  const session = await requireSession();
  const { isDatabaseReady, teachers } = await getTeachersData(session.user.id);

  const totalEvaluations = teachers.reduce((sum, teacher) => sum + teacher._count.evaluations, 0);

  return (
    <DashboardShell>
      <section className="space-y-5 sm:space-y-6">
        {!isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,248,249,0.96)_55%,rgba(252,246,238,0.98)_100%)] p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-xs font-black tracking-[0.18em] text-primary/75">TEACHERS</p>
              <h1 className="section-title text-2xl font-black sm:text-3xl">إدارة المعلمين والملفات الفردية</h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                من هنا يمكنك بناء قاعدة بيانات المعلمين واستيراد الكشوف ومراجعة عدد التقييمات لكل معلم والوصول
                السريع إلى ملفه الفردي.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MetricCard title="إجمالي المعلمين" value={String(teachers.length)} />
              <MetricCard title="إجمالي التقييمات" value={String(totalEvaluations)} />
              <MetricCard
                title="متوسط الحمل"
                value={teachers.length > 0 ? (totalEvaluations / teachers.length).toFixed(1) : "0.0"}
                suffix="لكل معلم"
              />
            </div>
          </div>
        </div>

        <TeachersTable teachers={teachers} />
      </section>
    </DashboardShell>
  );
}

function MetricCard({ title, value, suffix }: { title: string; value: string; suffix?: string }) {
  return (
    <Card className="border-white/80 bg-white/90 shadow-sm">
      <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
        <CardTitle className="text-xs font-bold text-slate-500 sm:text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <p className="text-xl font-black text-slate-900 sm:text-3xl">{value}</p>
          {suffix ? <Badge variant="secondary">{suffix}</Badge> : null}
        </div>
      </CardContent>
    </Card>
  );
}
