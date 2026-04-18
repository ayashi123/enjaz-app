import Link from "next/link";
import { FilePenLine } from "lucide-react";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatScore } from "@/lib/format";
import { getReportsData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function ReportsPage() {
  const session = await requireSession();
  const data = await getReportsData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <h1 className="section-title text-3xl font-bold">التقارير النهائية</h1>
          <p className="mt-2 text-sm text-slate-600">عرض رسمي قابل للطباعة لتقارير تقييم أداء المعلمين.</p>
        </div>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
          <CardHeader>
            <CardTitle>قائمة التقارير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.reports.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                لا توجد تقارير جاهزة بعد.
              </div>
            ) : (
              data.reports.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{item.teacherName}</h3>
                      <p className="text-sm text-slate-500">
                        متابعة {item.followupNo} - {item.lessonTitle}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(item.visitDate)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{item.performanceLabel}</Badge>
                      <span className="font-bold text-primary">{formatScore(item.finalScoreOutOfFive)} / 5</span>
                      <Button asChild variant="secondary" className="rounded-2xl px-4">
                        <Link
                          href={`/dashboard/evaluations/${item.id}/edit`}
                          className="inline-flex items-center gap-2"
                        >
                          <FilePenLine className="h-4 w-4 shrink-0" />
                          <span>تعديل</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-2xl">
                        <Link href={`/dashboard/reports/${item.id}`}>فتح التقرير</Link>
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
