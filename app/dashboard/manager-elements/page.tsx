import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ManagerElementCard } from "@/components/manager/manager-element-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getManagerElementDefinition } from "@/data/manager-elements";
import { getManagerElementsData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function ManagerElementsPage() {
  const session = await requireSession();
  const data = await getManagerElementsData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <h1 className="section-title text-3xl font-bold">عناصر تقييم مدير المدرسة</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            صممنا هذا القسم كبطاقات قيادية تفاعلية. افتح أي عنصر لاستعراض التفسير، وسلالم الأداء، وأمثلة
            الشواهد المعتمدة، ثم وثّق ملاحظاتك واربط الشواهد المناسبة مباشرة من داخل صفحة العنصر.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat title="إجمالي العناصر" value={String(data.elements.length)} />
          <Stat title="العناصر المكتملة" value={String(data.completedCount)} />
          <Stat
            title="نسبة الإنجاز"
            value={data.elements.length > 0 ? `${((data.completedCount / data.elements.length) * 100).toFixed(0)}%` : "0%"}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {data.elements.map((item) => (
            <ManagerElementCard
              key={item.id}
              item={{
                id: item.id,
                elementTitle: item.elementTitle,
                isDone: item.isDone,
                notes: item.notes,
                updatedAt: item.updatedAt.toISOString(),
              }}
              evidenceCount={data.evidenceMap[item.id] || 0}
              weight={getManagerElementDefinition(item.elementTitle)?.weight}
            />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
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
