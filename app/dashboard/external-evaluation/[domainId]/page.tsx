import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileDown } from "lucide-react";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { ExternalEvaluationDomainDetail } from "@/components/external-evaluation/domain-detail";
import { PrintButton } from "@/components/external-evaluation/print-button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExternalEvaluationDomainData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

type Params = { params: Promise<{ domainId: string }> };

export default async function ExternalEvaluationDomainPage({ params }: Params) {
  const session = await requireSession();
  const { domainId } = await params;
  const data = await getExternalEvaluationDomainData(session.user.id, domainId);

  if (data.isDatabaseReady && !data.domain) {
    notFound();
  }

  if (!data.domain || !data.domainSummary) {
    return (
      <DashboardShell>
        <DatabaseAlert />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <Button asChild variant="ghost" className="h-auto px-0 text-slate-500 hover:bg-transparent">
                <Link href="/dashboard/external-evaluation">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  العودة إلى التقويم الخارجي
                </Link>
              </Button>
              <h1 className="section-title text-3xl font-bold">{data.domain.title}</h1>
              <p className="max-w-4xl text-sm leading-7 text-slate-600">{data.domain.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/dashboard/external-evaluation/report">
                  <FileDown className="ml-2 h-4 w-4" />
                  تقرير PDF
                </Link>
              </Button>
              <PrintButton label="طباعة المجال" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard title="المؤشرات" value={data.domainSummary.indicatorsCount} />
          <SummaryCard title="المؤشرات المكتملة" value={data.domainSummary.completedIndicators} />
          <SummaryCard title="نسبة الإنجاز" value={`${data.domainSummary.completionRate}%`} />
        </div>

        <ExternalEvaluationDomainDetail
          domainId={data.domain.id}
          domainTitle={data.domain.title}
          standards={data.standards}
        />
      </section>
    </DashboardShell>
  );
}

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
