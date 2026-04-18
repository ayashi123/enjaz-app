import Link from "next/link";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatScore } from "@/lib/format";
import { getEvaluationWorkspaceData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function EvaluationsPage() {
  const session = await requireSession();
  const data = await getEvaluationWorkspaceData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="section-title text-3xl font-bold">التقييمات</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                محرك التقييم الرسمي وسجل الزيارات الصفية، مع انتقال سريع من نتيجة التقييم إلى التقرير النهائي
                القابل للطباعة.
              </p>
            </div>
            <Button asChild className="rounded-2xl">
              <Link href="/dashboard/evaluations/new">إجراء تقييم جديد</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard title="عدد التقييمات" value={String(data.evaluations.length)} />
          <MetricCard title="عدد المعلمين" value={String(data.teachers.length)} />
          <MetricCard
            title="المتوسط العام"
            value={
              data.evaluations.length > 0
                ? `${formatScore(
                    data.evaluations.reduce((sum, item) => sum + item.finalScoreOutOfFive, 0) / data.evaluations.length,
                  )} / 5`
                : "0.0 / 5"
            }
          />
        </div>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
          <CardHeader>
            <CardTitle>سجل التقييمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.evaluations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                لا توجد تقييمات محفوظة حتى الآن.
              </div>
            ) : (
              data.evaluations.map((item) => (
                <div key={item.id} className="rounded-[28px] border border-slate-200/80 bg-slate-50/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{item.teacherName}</h3>
                      <p className="text-sm text-slate-500">
                        {item.lessonTitle} - {formatDate(item.visitDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{item.performanceLabel}</Badge>
                      <span className="font-bold text-primary">{formatScore(item.finalScoreOutOfFive)} / 5</span>
                      <Button asChild variant="outline" className="rounded-2xl">
                        <Link href={`/dashboard/reports/${item.id}`}>التقرير</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
