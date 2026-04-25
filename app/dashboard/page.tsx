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
      subtitle: "متوسط نتائج المعلمين الحالية",
      icon: TrendingUp,
      href: "/dashboard/evaluations",
      accent: "from-amber-500/15 to-amber-500/5 text-amber-700",
    },
    {
      title: "اكتمال عناصر المدير",
      value: `${formatScore(dashboard.metrics.managerCompletionRate)}%`,
      subtitle: "نسبة التقدم في عناصر المدير",
      icon: BookOpenCheck,
      href: "/dashboard/manager-elements",
      accent: "from-violet-500/15 to-violet-500/5 text-violet-700",
    },
    {
      title: "الأدلة المرفوعة",
      value: String(dashboard.metrics.totalEvidences),
      subtitle: "الشواهد المرتبطة بالمعلمين والإدارة",
      icon: FileArchive,
      href: "/dashboard/evidence",
      accent: "from-cyan-500/15 to-cyan-500/5 text-cyan-700",
    },
    {
      title: "التقارير الجاهزة",
      value: String(dashboard.metrics.readyReportsCount),
      subtitle: "تقارير قابلة للعرض والطباعة",
      icon: FileClock,
      href: "/dashboard/reports",
      accent: "from-rose-500/15 to-rose-500/5 text-rose-700",
    },
  ];

  return (
    <DashboardShell>
      <section className="space-y-6">
        {!dashboard.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary">لوحة القيادة التنفيذية</p>
              <h1 className="section-title text-3xl font-bold">مرحبًا بك في منصة إنجاز التعليمية</h1>
            </div>

            <Link
              href="/dashboard/settings"
              className="block rounded-[24px] border border-[#d8e3e7] bg-white/80 px-5 py-4 text-sm text-[#15445a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-2 flex items-center gap-2 font-bold">
                <School className="h-4 w-4" />
                بيانات المدرسة
              </div>
              <p>{session.user.schoolName}</p>
              <p>{session.user.educationOffice}</p>
              <p>{session.user.academicYear}</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                <Settings className="h-3.5 w-3.5" />
                فتح الإعدادات
              </div>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} href={card.href} className="block">
                <Card className="h-full border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <p className="mt-1 text-sm text-slate-500">{card.subtitle}</p>
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-b ${card.accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between gap-3">
                    <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                    <span className="text-sm font-semibold text-primary">فتح القسم</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>آخر التقييمات</CardTitle>
                <p className="mt-1 text-sm text-slate-500">عرض سريع لأحدث الزيارات الصفية المسجلة.</p>
              </div>
              <Button asChild variant="secondary" className="rounded-2xl">
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
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold">{evaluation.teacherName}</h3>
                        <p className="text-sm text-slate-500">{formatDate(evaluation.visitDate)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xl font-bold text-primary">{formatScore(evaluation.finalScore)} / 5</p>
                        <Badge variant="secondary">{evaluation.performanceLabel}</Badge>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
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
                description="مراجعة التقارير النهائية وطباعة التقارير الجاهزة."
                icon={<FolderKanban className="h-5 w-5" />}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>منحنى الأداء الأخير</CardTitle>
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

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>آخر الأدلة</CardTitle>
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
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold">{evidence.title}</h3>
                        <p className="text-sm text-slate-500">{evidence.evidenceType}</p>
                      </div>
                      <Badge variant="secondary">{getEvidenceStatusLabel(evidence.status)}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{formatDate(evidence.evidenceDate)}</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
              <CardHeader>
                <CardTitle>تنبيهات تشغيلية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AlertRow
                  href="/dashboard/teachers"
                  title="المعلمون دون تقييمات"
                  description={`${dashboard.teacherDirectory.filter((item) => item.evaluationsCount === 0).length} معلم بحاجة إلى أول زيارة.`}
                />
                <AlertRow
                  href="/dashboard/manager-elements"
                  title="المتابعة القيادية"
                  description={`${dashboard.managerFollowUps.length} عناصر تحتاج إلى متابعة.`}
                />
                <AlertRow
                  href="/dashboard/reports"
                  title="جاهزية التقارير"
                  description={`${dashboard.metrics.readyReportsCount} تقارير قابلة للعرض والطباعة من السجلات الحالية.`}
                />
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>عناصر المدير التي تحتاج متابعة</CardTitle>
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
                      <div className="mb-1 flex items-center gap-2 text-amber-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-bold">بحاجة إلى متابعة</span>
                      </div>
                      <h3 className="font-bold">{item.elementTitle}</h3>
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
      <h3 className="font-bold">{title}</h3>
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
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-7 text-slate-500">{description}</p>
    </Link>
  );
}

function getEvidenceStatusLabel(status: string) {
  if (status === "VERIFIED") return "معتمد";
  if (status === "ARCHIVED") return "مؤرشف";
  return "مسودة";
}
