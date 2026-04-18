import { notFound } from "next/navigation";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ManagerElementDetail } from "@/components/manager/manager-element-detail";
import { getManagerElementDetail } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ManagerElementDetailPage({ params }: Params) {
  const session = await requireSession();
  const { id } = await params;
  const data = await getManagerElementDetail(session.user.id, id);

  if (!data.isDatabaseReady) {
    return (
      <DashboardShell>
        <DatabaseAlert />
      </DashboardShell>
    );
  }

  if (!data.element || !data.definition) {
    notFound();
  }

  return (
    <DashboardShell>
      <ManagerElementDetail
        item={{
          id: data.element.id,
          elementTitle: data.element.elementTitle,
          isDone: data.element.isDone,
          notes: data.element.notes,
          updatedAt: data.element.updatedAt.toISOString(),
        }}
        definition={data.definition}
        evidences={data.evidences.map((evidence) => ({
          id: evidence.id,
          title: evidence.title,
          evidenceType: evidence.evidenceType,
          evidenceDate: evidence.evidenceDate.toISOString(),
          notes: evidence.notes,
          status: evidence.status,
          attachments: Array.isArray(evidence.attachments) ? evidence.attachments.map(String) : [],
        }))}
      />
    </DashboardShell>
  );
}
