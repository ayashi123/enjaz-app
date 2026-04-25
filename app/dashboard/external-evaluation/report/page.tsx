import { ExternalEvaluationReportViewer } from "@/components/external-evaluation/external-evaluation-report-viewer";
import { getExternalEvaluationOverviewData, getSettingsData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function ExternalEvaluationReportPage() {
  const session = await requireSession();
  const [data, settings] = await Promise.all([
    getExternalEvaluationOverviewData(session.user.id),
    getSettingsData(session.user.id),
  ]);

  const generatedAt = new Date().toLocaleDateString("ar-SA");

  return (
    <ExternalEvaluationReportViewer
      report={{
        schoolName: settings.user?.schoolName || "المدرسة",
        educationOffice: settings.user?.educationOffice || "الإدارة العامة للتعليم",
        academicYear: settings.user?.academicYear || "",
        printHeader: settings.settings?.printHeader || "تقرير التقويم الخارجي",
        principalName: settings.user?.fullName || "مدير المدرسة",
        managerName: settings.user?.fullName || "معد التقرير",
        managerSignatureImage: settings.settings?.managerSignatureImage || null,
        officialStampImage: settings.settings?.officialStampImage || null,
        totals: data.totals,
        domains: data.domains,
        generatedAt,
      }}
    />
  );
}
