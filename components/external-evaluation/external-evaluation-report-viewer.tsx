"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const MINISTRY_LOGO_URL = "/ministry-logo.png";

type ExternalEvaluationReportViewerProps = {
  report: {
    schoolName: string;
    educationOffice: string;
    academicYear: string;
    printHeader?: string | null;
    principalName: string;
    managerName: string;
    managerSignatureImage?: string | null;
    officialStampImage?: string | null;
    totals: {
      standardsCount: number;
      indicatorsCount: number;
      completedIndicatorsCount: number;
      evidencesCount: number;
    };
    domains: Array<{
      id: string;
      title: string;
      description: string;
      standardsCount: number;
      indicatorsCount: number;
      completedIndicatorsCount: number;
      evidenceCount: number;
      completionRate: number;
      standards: Array<{
        id: string;
        title: string;
        indicatorsCount: number;
        completedCount: number;
        completionRate: number;
      }>;
    }>;
    generatedAt: string;
  };
};

export function ExternalEvaluationReportViewer({ report }: ExternalEvaluationReportViewerProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `external-evaluation-report-${report.schoolName}`,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button onClick={handlePrint}>
          <FileDown className="ml-2 h-4 w-4" />
          تصدير التقرير
        </Button>
      </div>

      <div ref={printRef} className="report-print-zone mx-auto max-w-[794px] space-y-6 print:max-w-none print:space-y-0">
        <style jsx global>{`
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          @media print {
            html,
            body {
              background: #fff !important;
            }

            .report-print-zone {
              margin: 0 !important;
            }

            .report-sheet {
              width: 100%;
              max-width: 194mm;
              min-height: 279mm;
              margin: 0 auto;
              border: 0 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              page-break-after: always;
              break-after: page;
            }

            .report-sheet:last-child {
              page-break-after: auto;
              break-after: auto;
            }

            .report-header-box,
            .report-school-rect {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}</style>

        <section className="report-sheet overflow-hidden rounded-[16px] border border-slate-200 bg-white px-6 py-5 shadow-soft">
          <ReportHeader
            schoolName={report.schoolName}
            educationOffice={report.educationOffice}
            title={report.printHeader || "تقرير التقويم الخارجي"}
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoCard title="بيانات التقرير">
              <InfoGrid
                items={[
                  ["اسم المدرسة", report.schoolName],
                  ["الإدارة التعليمية", report.educationOffice],
                  ["العام الدراسي", report.academicYear],
                  ["تاريخ التقرير", report.generatedAt],
                  ["معد التقرير", report.managerName],
                ]}
              />
            </InfoCard>

            <InfoCard title="الملخص العام">
              <InfoGrid
                items={[
                  ["عدد المجالات", String(report.domains.length)],
                  ["عدد المعايير", String(report.totals.standardsCount)],
                  ["عدد المؤشرات", String(report.totals.indicatorsCount)],
                  ["عدد المكتمل", String(report.totals.completedIndicatorsCount)],
                  ["عدد الشواهد", String(report.totals.evidencesCount)],
                ]}
              />
            </InfoCard>
          </div>

          <div className="mt-4 rounded-[14px] border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-base font-black text-slate-900">وصف التقرير</h2>
            <p className="text-sm leading-8 text-slate-700">
              يعرض هذا التقرير تقدم المدرسة في مجالات ومعايير ومؤشرات التقويم الخارجي، مع بيان نسب الإنجاز وعدد
              المؤشرات المكتملة والشواهد المرفوعة، ليكون وثيقة رسمية للمتابعة والتحسين المؤسسي.
            </p>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <SummaryCard label="المجالات" value={report.domains.length} />
            <SummaryCard label="المعايير" value={report.totals.standardsCount} />
            <SummaryCard label="المؤشرات المكتملة" value={report.totals.completedIndicatorsCount} />
            <SummaryCard
              label="نسبة الإنجاز العامة"
              value={
                report.totals.indicatorsCount > 0
                  ? `${Math.round((report.totals.completedIndicatorsCount / report.totals.indicatorsCount) * 100)}%`
                  : "0%"
              }
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SignatureBox title="إعداد التقرير" value={report.managerName} image={report.managerSignatureImage || undefined} />
            <SignatureBox title="إقرار مدير المدرسة" value={report.principalName} />
          </div>
        </section>

        {report.domains.map((domain) => (
          <section key={domain.id} className="report-sheet overflow-hidden rounded-[16px] border border-slate-200 bg-white px-6 py-5 shadow-soft">
            <ReportHeader schoolName={report.schoolName} educationOffice={report.educationOffice} title={`تقرير ${domain.title}`} compact />

            <div className="mt-4 rounded-[14px] border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-black text-slate-900">{domain.title}</h3>
              <p className="mt-3 text-sm leading-8 text-slate-700">{domain.description}</p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <SummaryCard label="المعايير" value={domain.standardsCount} />
              <SummaryCard label="المؤشرات" value={domain.indicatorsCount} />
              <SummaryCard label="المكتمل" value={domain.completedIndicatorsCount} />
              <SummaryCard label="نسبة الإنجاز" value={`${domain.completionRate}%`} />
            </div>

            <div className="mt-4 overflow-hidden rounded-[14px] border border-slate-200">
              <table className="w-full border-collapse text-right text-[12.5px]">
                <thead className="bg-[#eef3f7] text-slate-900">
                  <tr>
                    <th className="border-b border-slate-200 px-3 py-3 font-bold">المعيار</th>
                    <th className="border-b border-slate-200 px-3 py-3 font-bold">عدد المؤشرات</th>
                    <th className="border-b border-slate-200 px-3 py-3 font-bold">عدد المكتمل</th>
                    <th className="border-b border-slate-200 px-3 py-3 font-bold">نسبة الإنجاز</th>
                  </tr>
                </thead>
                <tbody>
                  {domain.standards.map((standard, index) => (
                    <tr key={standard.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                      <td className="border-b border-slate-100 px-3 py-3 font-semibold text-slate-900">{standard.title}</td>
                      <td className="border-b border-slate-100 px-3 py-3">{standard.indicatorsCount}</td>
                      <td className="border-b border-slate-100 px-3 py-3">{standard.completedCount}</td>
                      <td className="border-b border-slate-100 px-3 py-3">{standard.completionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <section className="report-sheet overflow-hidden rounded-[16px] border border-slate-200 bg-white px-6 py-5 shadow-soft">
          <ReportHeader schoolName={report.schoolName} educationOffice={report.educationOffice} title="اعتماد مدير المدرسة" compact />

          <div className="mt-8 rounded-[14px] border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-center text-lg font-black text-slate-900">بيان الاعتماد</h3>
            <p className="text-sm leading-9 text-slate-700">
              يعتمد مدير المدرسة هذا التقرير بوصفه وثيقة رسمية لنتائج متابعة التقويم الخارجي خلال العام الدراسي{" "}
              {report.academicYear}، ويستند إليه في أعمال التحسين والمتابعة المؤسسية وتوثيق مستوى التقدم في مجالات
              الأداء المدرسي.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ApprovalField label="مدير المدرسة" value={report.principalName} />
            <ApprovalField label="تاريخ الاعتماد" value={report.generatedAt} />
          </div>

          <div className="mt-8">
            <SignatureBox title="الختم الرسمي" value="" image={report.officialStampImage || undefined} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ReportHeader({
  schoolName,
  educationOffice,
  title,
  compact = false,
}: {
  schoolName: string;
  educationOffice: string;
  title: string;
  compact?: boolean;
}) {
  const officeLines = splitEducationOffice(educationOffice);

  return (
    <div className="-mx-6 -mt-5">
      <div className={`report-header-box flex items-center justify-center gap-4 bg-[#15445a] px-5 ${compact ? "py-2.5" : "py-3"}`}>
        <div className="flex-none">
          <img
            src={MINISTRY_LOGO_URL}
            alt="شعار وزارة التعليم"
            className={`${compact ? "h-[62px]" : "h-[74px]"} w-auto object-contain grayscale brightness-[2.9] contrast-125`}
            style={{ mixBlendMode: "screen" }}
          />
        </div>

        <div className={`w-[2px] bg-[#5d8ca3] ${compact ? "h-[54px]" : "h-[68px]"}`} />

        <div className={`text-right font-bold leading-6 text-white ${compact ? "text-[13px]" : "text-[14px]"}`}>
          <p>{officeLines[0]}</p>
          {officeLines[1] ? <p>{officeLines[1]}</p> : null}
        </div>
      </div>

      <div className="report-school-rect mx-auto w-fit rounded-b-[10px] border-t border-[#5d8ca3] bg-[#15445a] px-8 py-1.5 text-center text-[10.5pt] font-bold text-white">
        {schoolName}
      </div>

      <div className={`${compact ? "mt-2.5" : "mt-3.5"} text-center`}>
        <h2 className="inline-block border-b-2 border-black pb-1 text-[17px] font-black text-slate-900">{title}</h2>
      </div>
    </div>
  );
}

function splitEducationOffice(value: string) {
  const trimmed = value.trim();

  if (trimmed.includes("بمنطقة")) {
    const [first, ...rest] = trimmed.split("بمنطقة");
    return [first.trim(), `بمنطقة${rest.join("بمنطقة").trim()}`];
  }

  return [trimmed || "الإدارة العامة للتعليم", ""];
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-[15px] font-black text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-3">
      {items.map(([label, value]) => (
        <div
          key={`${label}-${value}`}
          className="grid grid-cols-[146px_1fr] gap-3 border-b border-dashed border-slate-200 pb-2 last:border-b-0 last:pb-0"
        >
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[14px] border border-[#d7e3dc] bg-[#f7faf8] p-5 text-center">
      <p className="text-sm font-semibold text-[#15445a]">{label}</p>
      <p className="mt-3 text-3xl font-black text-[#15445a]">{value}</p>
    </div>
  );
}

function SignatureBox({ title, value, image }: { title: string; value: string; image?: string }) {
  return (
    <div className="rounded-[14px] border border-dashed border-slate-300 p-5 text-center">
      <p className="mb-4 font-bold text-slate-900">{title}</p>
      {image ? (
        <div className="relative mx-auto mb-3 h-24 w-40">
          <Image src={image} alt={title} fill className="object-contain" unoptimized />
        </div>
      ) : null}
      <div className="min-h-10 text-sm text-slate-600">{value || "........................................"}</div>
    </div>
  );
}

function ApprovalField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-slate-50 px-5 py-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}
