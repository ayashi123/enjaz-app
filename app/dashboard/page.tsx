import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BookOpenCheck,
  ClipboardList,
  FileArchive,
  FileClock,
  FileText,
  FolderKanban,
  School,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatScore } from "@/lib/format";
import { getDashboardData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  const dashboard = await getDashboardData(session.user.id);

  const cards = [
    {
      title: "إجمالي المعلمين",
      value: String(dashboard.metrics.totalTeachers),
      subtitle: "قاعدة بيانات الكادر التعليمي",
      icon: Users,
      href: "/dashboard/teachers",
      accent: "from-sky-500/15 to-sky-500/5 text-sky-700",
    },
    {
      title: "إجمالي التقييمات",
      value: String(dashboard.metrics.totalEvaluations),
      subtitle: "سجل الزيارات والمتابعات",
      icon: ClipboardList,
      href: "/dashboard/evaluations",
      accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
    },
    {
      title: "متوسط الأداء",
      value: `${formatScore(dashboard.metrics.averageTeacherPerformance)} / 5`,
      subtitle: "نتيجة الأداء الحالية",
      icon: TrendingUp,
      href: "/dashboard/evaluations",
      accent: "from-amber-500/15 to-amber-500/5 text-amber-700",
    },
    {
      title: "اكتمال عناصر المدير",
      value: `${formatScore(dashboard.metrics.managerCompletionRate)}%`,
      subtitle: "نسبة التقدم الحالية",
      icon: BookOpenCheck,
      href: "/dashboard/manager-elements",
      accent: "from-violet-500/15 to-violet-500/5 text-violet-700",
    },
    {
      title: "الأدلة المرفوعة",
      value: String(dashboard.metrics.totalEvidences),
      subtitle: "الشواهد والوثائق",
      icon: FileArchive,
      href: "/dashboard/evidence",
      accent: "from-cyan-500/15 to-cyan-500/5 text-cyan-700",
    },
    {
      title: "التقارير الجاهزة",
      value: String(dashboard.metrics.readyReportsCount),
      subtitle: "قابلة للعرض والطباعة",
      icon: FileClock,
      href: "/dashboard/reports",
      accent: "from-rose-500/15 to-rose-500/5 text-rose-700",
    },
  ];

  const teacherWithoutEvaluationCount = dashboard.teacherDirectory.filter((item) => item.evaluationsCount === 0).length;

  return (
    <DashboardShell>
      <section className="space-y-5 sm:space-y-6">
        {!dashboard.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,248,249,0.96)_55%,rgba(252,246,238,0.98)_100%)] p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-black tracking-[0.18em] text-primary/75">DASHBOARD</p>
                <h1 className="section-title text-2xl font-black sm:text-3xl">لوحة القيادة التنفيذية</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                  متابعة سريعة للتقييمات والشواهد وعناصر المدير والتقارير ضمن تجربة تشغيل مريحة على الجوال.
                </p>
              </div>

              <Link
                href="/dashboard/settings"
                className="block rounded-[24px] border border-[#d8e3e7] bg-white/85 px-4 py-4 text-sm text-[#15445a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:max-w-xs"
              >
                <div className="mb-2 flex items-center gap-2 font-black">
                  <School className="h-4 w-4" />
                  بيانات المدرسة
                </div>
                <p>{session.user.schoolName}</p>
                <p>{session.user.educationOffice}</p>
                <p>{session.user.academicYear}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-primary">
                  <Settings className="h-3.5 w-3.5" />
                  فتح الإعدادات
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <QuickStat title="المعلمون" value={String(dashboard.metrics.totalTeachers)} />
              <QuickStat title="التقييمات" value={String(dashboard.metrics.totalEvaluations)} />
              <QuickStat title="الأدلة" value={String(dashboard.metrics.totalEvidences)} />
            </div>
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} className="block min-w-[250px] sm:min-w-0">
                  <Card className="h-full border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base font-black">{card.title}</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">{card.subtitle}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-b ${card.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-end justify-between gap-3">
                      <p className="text-3xl font-black text-slate-900">{card.value}</p>
                      <span className="text-sm font-bold text-primary">فتح</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="font-black">آخر التقييمات</CardTitle>
                <p className="mt-1 text-sm text-slate-500">عرض سريع لأحدث الزيارات الصفية المسجلة.</p>
              </div>
              <Button asChild variant="secondary" className="rounded-2xl sm:w-auto">
                <Link href="/dashboard/evaluations">
                  كل التقييمات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboard.latestEvaluations.length === 0 ? (
                <EmptyState text="لا توجد تقييمات حديثة بعد. ابدأ بإضافة معلم ثم أنشئ أول تقييم له." />
              ) : (
                dashboard.latestEvaluations.map((evaluation) => (
                  <Link
                    key={evaluation.id}
                    href={`/dashboard/reports/${evaluation.id}`}
                    className="block rounded-3xl border border-slate-100 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">{evaluation.teacherName}</h3>
                        <p className="text-sm text-slate-500">{formatDate(evaluation.visitDate)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{evaluation.performanceLabel}</Badge>
                        <p className="text-lg font-black text-primary">{formatScore(evaluation.finalScore)} / 5</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
            <CardHeader>
              <CardTitle className="font-black">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <QuickLink
                href="/dashboard/teachers"
                title="إدارة المعلمين"
                description="إضافة وتحديث ملفات المعلمين والوصول إلى ملفاتهم الفردية."
                icon={<Users className="h-5 w-5" />}
              />
              <QuickLink
                href="/dashboard/evaluations/new"
                title="إجراء تقييم جديد"
                description="ابدأ تقييمًا جديدًا مباشرة وفق النموذج الرسمي المعتمد."
                icon={<ClipboardList className="h-5 w-5" />}
              />
              <QuickLink
                href="/dashboard/reports"
                title="استعراض التقارير"
                description="مراجعة التقارير النهائية وفتحها وطباعة الجاهز منها."
                icon={<FolderKanban className="h-5 w-5" />}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-black">منحنى الأداء الأخير</CardTitle>
              <p className="mt-1 text-sm text-slate-500">يعرض آخر ست نتائج تقييم مسجلة على مقياس من 5.</p>
            </div>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/dashboard/evaluations">تحليل النتائج</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {dashboard.chartData.length > 0 ? (
              <Link href="/dashboard/evaluations" className="block rounded-[24px] transition hover:bg-slate-50/70">
                <PerformanceChart data={dashboard.chartData} />
              </Link>
            ) : (
              <EmptyState text="سيظهر الرسم البياني بعد إضافة تقييمات فعلية." />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="font-black">آخر الأدلة</CardTitle>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/dashboard/evidence">كل الأدلة</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboard.latestEvidences.length === 0 ? (
                <EmptyState text="لا توجد أدلة مضافة بعد." />
              ) : (
                dashboard.latestEvidences.map((evidence) => (
                  <Link
                    key={evidence.id}
                    href="/dashboard/evidence"
                    className="block rounded-3xl border border-slate-100 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">{evidence.title}</h3>
                        <p className="text-sm text-slate-500">{evidence.evidenceType}</p>
                        <p className="mt-1 text-xs text-slate-400">{formatDate(evidence.evidenceDate)}</p>
                      </div>
                      <Badge variant="secondary">{getEvidenceStatusLabel(evidence.status)}</Badge>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
              <CardHeader>
                <CardTitle className="font-black">تنبيهات تشغيلية</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <AlertRow
                  href="/dashboard/teachers"
                  title="المعلمون دون تقييمات"
                  description={`${teacherWithoutEvaluationCount} معلم بحاجة إلى أول زيارة.`}
                />
                <AlertRow
                  href="/dashboard/manager-elements"
                  title="المتابعة القيادية"
                  description={`${dashboard.managerFollowUps.length} عناصر تحتاج إلى متابعة.`}
                />
                <AlertRow
                  href="/dashboard/reports"
                  title="جاهزية التقارير"
                  description={`${dashboard.metrics.readyReportsCount} تقارير قابلة للعرض والطباعة.`}
                />
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="font-black">عناصر المدير التي تحتاج متابعة</CardTitle>
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/dashboard/manager-elements">كل العناصر</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard.managerFollowUps.length === 0 ? (
                  <EmptyState text="لا توجد عناصر متأخرة حاليًا." />
                ) : (
                  dashboard.managerFollowUps.map((item) => (
                    <Link
                      key={item.id}
                      href={`/dashboard/manager-elements/${item.id}`}
                      className="block rounded-3xl border border-slate-100 p-4 transition hover:bg-slate-50"
                    >
                      <div className="mb-2 flex items-center gap-2 text-amber-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-black">بحاجة إلى متابعة</span>
                      </div>
                      <h3 className="font-black text-slate-900">{item.elementTitle}</h3>
                      <p className="text-sm text-slate-500">آخر تحديث: {formatDate(item.updatedAt)}</p>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

function QuickStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/85 bg-white/88 px-4 py-3 text-center shadow-sm">
      <p className="text-lg font-black text-slate-900">{value}</p>
      <p className="text-xs font-bold text-slate-500">{title}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-7 text-slate-500">
      {text}
    </div>
  );
}

function AlertRow({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="block rounded-3xl border border-slate-100 p-4 transition hover:bg-slate-50">
      <h3 className="font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-7 text-slate-500">{description}</p>
    </Link>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-7 text-slate-500">{description}</p>
    </Link>
  );
}

function getEvidenceStatusLabel(status: string) {
  if (status === "VERIFIED") return "معتمد";
  if (status === "ARCHIVED") return "مؤرشف";
  return "مسودة";
}
