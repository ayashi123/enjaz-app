import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { EvaluationForm } from "@/components/evaluations/evaluation-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getEvaluationWorkspaceData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

type SearchParams = Promise<{ teacherId?: string }>;

export default async function NewEvaluationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await requireSession();
  const params = await searchParams;
  const data = await getEvaluationWorkspaceData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}
        <div>
          <h1 className="text-3xl font-bold">إجراء تقييم جديد</h1>
          <p className="mt-2 text-sm text-slate-600">
            النموذج الرسمي الكامل للتقييم مع حساب موزون مباشر من 5 وتغذية راجعة ذكية.
          </p>
        </div>
        <EvaluationForm teachers={data.teachers} defaultTeacherId={params.teacherId} managerName={session.user.name || ""} />
      </section>
    </DashboardShell>
  );
}
