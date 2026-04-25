import Link from "next/link";
import { BarChart3, BookOpenCheck, FileDown, FolderArchive, Target } from "lucide-react";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { PrintButton } from "@/components/external-evaluation/print-button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExternalEvaluationOverviewData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

const overviewCards = [
  { key: "standardsCount", title: "إجمالي المعايير", icon: BookOpenCheck },
  { key: "indicatorsCount", title: "إجمالي المؤشرات", icon: Target },
  { key: "completedIndicatorsCount", title: "المؤشرات المكتملة", icon: BarChart3 },
  { key: "evidencesCount", title: "الشواهد المرفوعة", icon: FolderArchive },
] as const;

export default async function ExternalEvaluationPage() {
  const session = await requireSession();
  const data = await getExternalEvaluationOverviewData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary">قسم عملي جديد</p>
              <h1 className="section-title text-3xl font-bold">التقويم الخارجي</h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                تعرض هذه الصفحة مجالات التقويم الخارجي الأربعة، مع حسابات تلقائية للإنجاز والمعايير والمؤشرات والشواهد،
                والدخول المباشر لكل مجال على حدة.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/dashboard/external-evaluation/report">
                  <FileDown className="ml-2 h-4 w-4" />
                  عرض التقرير
                </Link>
              </Button>
              <PrintButton />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.key} className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">{data.totals[item.key]}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {data.domains.map((domain) => (
            <Card key={domain.id} className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
              <CardHeader>
                <CardTitle>{domain.title}</CardTitle>
                <p className="text-sm leading-7 text-slate-600">{domain.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric label="عدد المعايير" value={domain.standardsCount} />
                  <Metric label="عدد المؤشرات" value={domain.indicatorsCount} />
                  <Metric label="نسبة الإنجاز" value={`${domain.completionRate}%`} />
                  <Metric label="عدد الشواهد" value={domain.evidenceCount} />
                </div>

                <Button asChild className="w-full rounded-2xl">
                  <Link href={`/dashboard/external-evaluation/${domain.id}`}>فتح المجال</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
