import { notFound } from "next/navigation";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { EvaluationForm } from "@/components/evaluations/evaluation-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getEvaluationEditorData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function EditEvaluationPage({ params }: Params) {
  const session = await requireSession();
  const { id } = await params;
  const data = await getEvaluationEditorData(session.user.id, id);

  if (!data.isDatabaseReady) {
    return (
      <DashboardShell>
        <DatabaseAlert />
      </DashboardShell>
    );
  }

  if (!data.evaluation) {
    notFound();
  }

  const rubricRows = Array.isArray(data.evaluation.rubricJson)
    ? (data.evaluation.rubricJson as Array<{
        id?: string;
        elementId?: string;
        score?: number;
        strengthNote?: string;
        developmentNote?: string;
      }>)
    : [];

  return (
    <DashboardShell>
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">تعديل تقييم المعلم</h1>
          <p className="mt-2 text-sm text-slate-600">
            عدّل الدرجات والملاحظات وتفاصيل الزيارة، ثم احفظ التعديلات لتحديث التقرير النهائي مباشرة.
          </p>
        </div>

        <EvaluationForm
          teachers={data.teachers}
          managerName={session.user.name || ""}
          mode="edit"
          evaluationId={data.evaluation.id}
          initialData={{
            teacherId: data.evaluation.teacherId,
            followupNo: data.evaluation.followupNo,
            visitDate: data.evaluation.visitDate.toISOString().slice(0, 10),
            lessonTitle: data.evaluation.lessonTitle,
            managerName: data.evaluation.managerName,
            teacherSignature: data.evaluation.teacherSignature,
            managerSignature: data.evaluation.managerSignature,
            elements: rubricRows.map((row) => ({
              elementId: row.id || row.elementId || "",
              score: Number(row.score || 3),
              strengthNote: row.strengthNote || "",
              developmentNote: row.developmentNote || "",
            })),
          }}
        />
      </section>
    </DashboardShell>
  );
}
