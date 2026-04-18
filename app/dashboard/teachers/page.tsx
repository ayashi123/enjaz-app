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
      <section className="space-y-6">
        {!isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary">ملف الكادر التعليمي</p>
              <h1 className="section-title text-3xl font-bold">إدارة المعلمين والملفات الفردية</h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                من هنا يمكنك بناء قاعدة بيانات المعلمين، واستيراد الكشوف، ومراجعة عدد التقييمات لكل معلم،
                والوصول السريع إلى ملفه الفردي وتقاريره المرتبطة.
              </p>
            </div>
            <Badge className="rounded-full bg-white px-4 py-2 text-sm text-primary shadow-sm" variant="secondary">
              قاعدة بيانات تشغيلية قابلة للتوسع
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="إجمالي المعلمين" value={String(teachers.length)} />
          <MetricCard title="إجمالي التقييمات" value={String(totalEvaluations)} />
          <MetricCard
            title="متوسط الحمل التقييمي"
            value={teachers.length > 0 ? (totalEvaluations / teachers.length).toFixed(1) : "0.0"}
            suffix="تقييم لكل معلم"
          />
        </div>

        <TeachersTable teachers={teachers} />
      </section>
    </DashboardShell>
  );
}

function MetricCard({ title, value, suffix }: { title: string; value: string; suffix?: string }) {
  return (
    <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {suffix ? <Badge variant="secondary">{suffix}</Badge> : null}
        </div>
      </CardContent>
    </Card>
  );
}
