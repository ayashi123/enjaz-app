import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { EvidenceForm } from "@/components/evidence/evidence-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAttachmentLabel } from "@/lib/attachments";
import { formatDate } from "@/lib/format";
import { getEvidenceWorkspaceData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

function getStatusLabel(status: string) {
  if (status === "VERIFIED") return "معتمد";
  if (status === "ARCHIVED") return "مؤرشف";
  return "مسودة";
}

function getStatusVariant(status: string) {
  if (status === "VERIFIED") return "success" as const;
  if (status === "ARCHIVED") return "secondary" as const;
  return "warning" as const;
}

function getRelationLabel(relatedType: string) {
  if (relatedType === "TEACHER") return "معلم";
  if (relatedType === "TEACHER_EVALUATION") return "تقييم معلم";
  if (relatedType === "MANAGER_ELEMENT") return "عنصر مدير";
  return "أرشيف عام";
}

export default async function EvidencePage() {
  const session = await requireSession();
  const data = await getEvidenceWorkspaceData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-5 sm:space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,248,249,0.96)_55%,rgba(252,246,238,0.98)_100%)] p-5 shadow-soft sm:p-6">
          <h1 className="section-title text-2xl font-black sm:text-3xl">إدارة الأدلة والشواهد</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            أضف الشواهد واربطها بالمعلمين أو التقييمات أو عناصر المدير أو الأرشيف العام، مع تجربة أسهل على الجوال.
          </p>
        </div>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
          <CardHeader>
            <CardTitle className="font-black">إضافة شاهد جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <EvidenceForm
              teachers={data.teachers.map((item) => ({ id: item.id, label: item.fullName }))}
              evaluations={data.evaluations}
              managerElements={data.managerElements.map((item) => ({ id: item.id, label: item.elementTitle }))}
            />
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
          <CardHeader>
            <CardTitle className="font-black">سجل الأدلة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.evidences.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                لا توجد شواهد مسجلة حتى الآن.
              </div>
            ) : (
              data.evidences.map((item) => (
                <div key={item.id} className="rounded-[28px] border border-slate-200/80 bg-slate-50/70 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>{item.evidenceType}</span>
                        <span>•</span>
                        <span>{formatDate(item.evidenceDate)}</span>
                        <span>•</span>
                        <span>{getRelationLabel(item.relatedType)}</span>
                      </div>
                      {item.notes ? <p className="max-w-3xl text-sm leading-7 text-slate-600">{item.notes}</p> : null}
                    </div>
                    <Badge variant={getStatusVariant(item.status)}>{getStatusLabel(item.status)}</Badge>
                  </div>

                  {item.attachments.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.attachments.map((attachment) => (
                        <a
                          key={attachment}
                          href={attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                        >
                          {getAttachmentLabel(attachment)}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
