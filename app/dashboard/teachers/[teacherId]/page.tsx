import Link from "next/link";
import { notFound } from "next/navigation";
import { FilePenLine } from "lucide-react";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { TeacherFormDialog } from "@/components/teachers/teacher-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatScore } from "@/lib/format";
import { getTeacherProfileData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

type Params = {
  params: Promise<{ teacherId: string }>;
};

export default async function TeacherProfilePage({ params }: Params) {
  const session = await requireSession();
  const { teacherId } = await params;
  const { isDatabaseReady, teacher, evaluations, evidences } = await getTeacherProfileData(
    session.user.id,
    teacherId,
  );

  if (isDatabaseReady && !teacher) {
    notFound();
  }

  if (!teacher) {
    return (
      <DashboardShell>
        <DatabaseAlert />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">{teacher.fullName}</h1>
                <Badge variant="default">{teacher.specialization || "التخصص غير محدد"}</Badge>
              </div>
              <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p>رقم الهوية: {teacher.nationalId || "غير متوفر"}</p>
                <p>المادة: {teacher.subject || "غير محددة"}</p>
                <p>الصف: {teacher.className || "غير محدد"}</p>
                <p>تاريخ إنشاء الملف: {formatDate(teacher.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href="/dashboard/teachers">العودة إلى المعلمين</Link>
              </Button>
              <TeacherFormDialog
                mode="edit"
                teacher={{
                  id: teacher.id,
                  fullName: teacher.fullName,
                  nationalId: teacher.nationalId || "",
                  specialization: teacher.specialization || "",
                  subject: teacher.subject || "",
                  className: teacher.className || "",
                }}
              />
              <Button asChild>
                <Link href={`/dashboard/evaluations/new?teacherId=${teacher.id}`}>بدء تقييم جديد</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/80 bg-white/90 shadow-soft">
            <CardHeader>
              <CardTitle>عدد التقييمات السابقة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{evaluations.length}</p>
            </CardContent>
          </Card>
          <Card className="border-white/80 bg-white/90 shadow-soft">
            <CardHeader>
              <CardTitle>عدد الأدلة المرتبطة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{evidences.length}</p>
            </CardContent>
          </Card>
          <Card className="border-white/80 bg-white/90 shadow-soft">
            <CardHeader>
              <CardTitle>متوسط الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {evaluations.length > 0
                  ? formatScore(
                      evaluations.reduce((sum, item) => sum + item.finalScoreOutOfFive, 0) / evaluations.length,
                    )
                  : "0.0"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="border-white/80 bg-white/90 shadow-soft">
            <CardHeader>
              <CardTitle>أداء المعلم والتقييمات السابقة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evaluations.length === 0 ? (
                <EmptyMessage text="لا توجد تقييمات مسجلة لهذا المعلم حتى الآن." />
              ) : (
                evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="rounded-3xl border border-slate-100 p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold">{evaluation.lessonTitle}</h3>
                        <p className="text-sm text-slate-500">
                          متابعة رقم {evaluation.followupNo} - {formatDate(evaluation.visitDate)}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-xl font-bold text-primary">{formatScore(evaluation.finalScoreOutOfFive)} / 5</p>
                        <Badge variant="secondary">{evaluation.performanceLabel}</Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild variant="outline" className="rounded-2xl">
                        <Link href={`/dashboard/reports/${evaluation.id}`}>فتح التقرير</Link>
                      </Button>
                      <Button asChild variant="secondary" className="rounded-2xl px-4">
                        <Link
                          href={`/dashboard/evaluations/${evaluation.id}/edit`}
                          className="inline-flex items-center gap-2"
                        >
                          <FilePenLine className="h-4 w-4 shrink-0" />
                          <span>تعديل الأداء</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/80 bg-white/90 shadow-soft">
            <CardHeader>
              <CardTitle>الأدلة المرتبطة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evidences.length === 0 ? (
                <EmptyMessage text="لا توجد أدلة مرتبطة بملف هذا المعلم بعد." />
              ) : (
                evidences.map((evidence) => (
                  <div key={evidence.id} className="rounded-3xl border border-slate-100 p-4">
                    <h3 className="font-bold">{evidence.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{evidence.evidenceType}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="secondary">{evidence.status}</Badge>
                      <span className="text-xs text-slate-400">{formatDate(evidence.evidenceDate)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-7 text-slate-500">
      {text}
    </div>
  );
}
