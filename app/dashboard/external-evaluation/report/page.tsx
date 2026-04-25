import { PrintButton } from "@/components/external-evaluation/print-button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExternalEvaluationOverviewData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function ExternalEvaluationReportPage() {
  const session = await requireSession();
  const data = await getExternalEvaluationOverviewData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-6">
        <div className="flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="space-y-4 print:space-y-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft print:shadow-none">
            <h1 className="text-center text-3xl font-black text-slate-900">تقرير التقويم الخارجي</h1>
            <p className="mt-3 text-center text-sm text-slate-600">
              ملخص المجالات والمعايير والمؤشرات ونسب الإنجاز والشواهد المرفوعة.
            </p>
          </div>

          {data.domains.map((domain) => (
            <Card key={domain.id} className="border-slate-200 bg-white shadow-soft print:shadow-none">
              <CardHeader>
                <CardTitle>{domain.title}</CardTitle>
                <p className="text-sm leading-7 text-slate-600">{domain.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Metric label="المعايير" value={domain.standardsCount} />
                  <Metric label="المؤشرات" value={domain.indicatorsCount} />
                  <Metric label="المكتمل" value={domain.completedIndicatorsCount} />
                  <Metric label="الإنجاز" value={`${domain.completionRate}%`} />
                </div>

                <div className="overflow-hidden rounded-[20px] border border-slate-200">
                  <table className="w-full border-collapse text-right text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="border-b border-slate-200 px-4 py-3">المعيار</th>
                        <th className="border-b border-slate-200 px-4 py-3">عدد المؤشرات</th>
                        <th className="border-b border-slate-200 px-4 py-3">المكتمل</th>
                        <th className="border-b border-slate-200 px-4 py-3">الإنجاز</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domain.standards.map((standard) => (
                        <tr key={standard.id}>
                          <td className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-900">{standard.title}</td>
                          <td className="border-b border-slate-100 px-4 py-3">{standard.indicatorsCount}</td>
                          <td className="border-b border-slate-100 px-4 py-3">{standard.completedCount}</td>
                          <td className="border-b border-slate-100 px-4 py-3">{standard.completionRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
    <div className="rounded-[18px] border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
