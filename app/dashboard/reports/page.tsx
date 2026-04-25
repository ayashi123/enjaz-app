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
      <section className="space-y-5 sm:space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,248,249,0.96)_55%,rgba(252,246,238,0.98)_100%)] p-5 shadow-soft sm:p-6">
          <h1 className="section-title text-2xl font-black sm:text-3xl">التقارير النهائية</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            عرض رسمي قابل للطباعة لتقارير تقييم أداء المعلمين، مع تجربة أسهل في التصفح على الهاتف.
          </p>
        </div>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
          <CardHeader>
            <CardTitle className="font-black">قائمة التقارير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.reports.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                لا توجد تقارير جاهزة بعد.
              </div>
            ) : (
              data.reports.map((item) => (
                <div key={item.id} className="rounded-[30px] border border-slate-100 bg-white/90 p-4 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">{item.teacherName}</h3>
                        <p className="text-sm text-slate-500">
                          متابعة {item.followupNo} - {item.lessonTitle}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{formatDate(item.visitDate)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.performanceLabel}</Badge>
                        <span className="font-black text-primary">{formatScore(item.finalScoreOutOfFive)} / 5</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                      <Button asChild variant="secondary" className="rounded-2xl px-4">
                        <Link
                          href={`/dashboard/evaluations/${item.id}/edit`}
                          className="inline-flex items-center justify-center gap-2"
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
