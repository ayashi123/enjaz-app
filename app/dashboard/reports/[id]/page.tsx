import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ReportViewer } from "@/components/reports/report-viewer";
import { getReportById } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };
type ReportRubricRow = {
  id: string;
  title: string;
  weight: number;
  score: number;
  levelTitle?: string;
  levelDescription: string;
  strengthNote: string;
  developmentNote: string;
};

export default async function ReportPage({ params }: Params) {
  const session = await requireSession();
  const { id } = await params;
  const report = await getReportById(session.user.id, id);

  if (!report) notFound();
  const rubricRows = Array.isArray(report.rubricJson) ? (report.rubricJson as ReportRubricRow[]) : [];

  return (
    <DashboardShell>
      <ReportViewer
        report={{
          principalName: report.user.fullName,
          schoolName: report.user.schoolName,
          educationOffice: report.user.educationOffice,
          academicYear: report.user.academicYear,
          printHeader: report.user.schoolSettings?.printHeader || null,
          schoolLogo: report.user.schoolSettings?.schoolLogo || null,
          managerName: report.managerName,
          teacherName: report.teacher.fullName,
          nationalId: report.teacher.nationalId,
          specialization: report.teacher.specialization,
          subject: report.teacher.subject,
          className: report.teacher.className,
          followupNo: report.followupNo,
          visitDate: report.visitDate.toISOString(),
          lessonTitle: report.lessonTitle,
          finalScore: Number(report.finalScoreOutOfFive),
          performanceLabel: report.performanceLabel,
          strengths: report.strengths.split("\n").filter(Boolean),
          developmentPoints: report.developmentPoints.split("\n").filter(Boolean),
          aiFeedback: report.aiFeedback,
          teacherSignature: report.teacherSignature,
          managerSignature: report.managerSignature,
          managerSignatureImage: report.user.schoolSettings?.managerSignatureImage || null,
          officialStampImage: report.user.schoolSettings?.officialStampImage || null,
          rubricRows,
        }}
      />
    </DashboardShell>
  );
}
