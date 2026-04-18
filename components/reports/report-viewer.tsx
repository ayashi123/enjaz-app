"use client";

import { useRef } from "react";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { getAchievementLevelLabel } from "@/lib/evaluation-engine";

const MINISTRY_LOGO_URL = "/ministry-logo.png";

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

type ReportViewerProps = {
  report: {
    principalName: string;
    schoolName: string;
    educationOffice: string;
    academicYear: string;
    printHeader?: string | null;
    schoolLogo?: string | null;
    managerName: string;
    teacherName: string;
    nationalId: string | null;
    specialization: string | null;
    subject: string | null;
    className: string | null;
    followupNo: string;
    visitDate: string;
    lessonTitle: string;
    finalScore: number;
    performanceLabel: string;
    strengths: string[];
    developmentPoints: string[];
    aiFeedback: string;
    teacherSignature?: string | null;
    managerSignature?: string | null;
    managerSignatureImage?: string | null;
    officialStampImage?: string | null;
    rubricRows: ReportRubricRow[];
  };
};

export function ReportViewer({ report }: ReportViewerProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `teacher-report-${report.teacherName}`,
  });

  const printDate = new Date(report.visitDate).toLocaleDateString("ar-SA");
  const strengths = report.strengths.filter(Boolean);
  const developmentPoints = report.developmentPoints.filter(Boolean);
  const feedbackLines = report.aiFeedback
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button onClick={handlePrint}>طباعة التقرير</Button>
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
            title={report.printHeader || "نموذج متابعة وقياس الأداء الوظيفي للمعلم"}
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoCard title="بيانات المعلم">
              <InfoGrid
                items={[
                  ["اسم المعلم رباعيًا", report.teacherName],
                  ["السجل المدني / الهوية", report.nationalId || "غير متوفر"],
                  ["التخصص", report.specialization || "غير محدد"],
                  ["مادة التدريس", report.subject || "غير محددة"],
                  ["الفصل / الصف", report.className || "غير محدد"],
                ]}
              />
            </InfoCard>

            <InfoCard title="بيانات المتابعة">
              <InfoGrid
                items={[
                  ["رقم المتابعة", report.followupNo],
                  ["تاريخ المتابعة", printDate],
                  ["عنوان الدرس", report.lessonTitle],
                  ["معد التقرير", report.managerName || "........................................"],
                  ["العام الدراسي", report.academicYear],
                ]}
              />
            </InfoCard>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[14px] border border-[#d7e3dc] bg-[#f7faf8] p-5 text-center">
              <p className="text-sm font-semibold text-[#15445a]">النتيجة النهائية</p>
              <p className="mt-3 text-4xl font-black text-[#15445a]">{report.finalScore.toFixed(2)} / 5</p>
              <div className="mt-3 inline-flex rounded-full bg-[#15445a] px-4 py-1.5 text-sm font-bold text-white">
                {report.performanceLabel}
              </div>
            </div>

            <div className="rounded-[14px] border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-base font-black text-slate-900">ملخص التقرير</h2>
              <p className="text-sm leading-7 text-slate-700">
                يوضح هذا التقرير مستوى الأداء الوظيفي للمعلم وفق عناصر التقويم الرسمية، مع عرض النتيجة النهائية من
                خمسة، وأبرز الجوانب التي تستحق التعزيز، إضافة إلى أولويات التطوير والتغذية الراجعة المناسبة.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FeedbackBox title="نقاط التميز المختصرة" items={strengths.slice(0, 3)} tone="blue" compact />
            <FeedbackBox
              title="أولويات التطوير المختصرة"
              items={developmentPoints.slice(0, 3)}
              tone="neutral"
              compact
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SignatureBox title="إقرار المعلم" value={report.teacherSignature || report.teacherName} />
            <SignatureBox
              title="توقيع معد التقرير"
              value={report.managerSignature || report.managerName}
              image={report.managerSignatureImage || undefined}
            />
          </div>
        </section>

        <section className="report-sheet overflow-hidden rounded-[16px] border border-slate-200 bg-white px-6 py-5 shadow-soft">
          <ReportHeader schoolName={report.schoolName} educationOffice={report.educationOffice} title="جدول عناصر التقويم والتغذية الراجعة" compact />

          <div className="mt-4 overflow-hidden rounded-[14px] border border-slate-200">
            <table className="report-table w-full border-collapse text-right text-[12.5px]">
              <thead className="bg-[#eef3f7] text-slate-900">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-3 font-bold">العنصر</th>
                  <th className="border-b border-slate-200 px-3 py-3 font-bold">الوزن</th>
                  <th className="border-b border-slate-200 px-3 py-3 font-bold">المستوى</th>
                  <th className="border-b border-slate-200 px-3 py-3 font-bold">الوصف المعتمد</th>
                </tr>
              </thead>
              <tbody>
                {report.rubricRows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                    <td className="align-top border-b border-slate-100 px-3 py-3 font-semibold text-slate-900">
                      {row.title}
                    </td>
                    <td className="align-top border-b border-slate-100 px-3 py-3 text-center text-slate-700">
                      {row.weight}%
                    </td>
                    <td className="align-top border-b border-slate-100 px-3 py-3 text-center font-bold text-[#15445a]">
                      <div>{row.score}</div>
                      <div className="mt-1 text-[11px] font-medium text-slate-500">
                        {row.levelTitle || getAchievementLevelLabel(row.score)}
                      </div>
                    </td>
                    <td className="align-top border-b border-slate-100 px-3 py-3 leading-7 text-slate-700">
                      {row.levelDescription}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FeedbackBox title="نقاط التميز" items={strengths} tone="blue" />
            <FeedbackBox title="نقاط التطوير" items={developmentPoints} tone="neutral" />
          </div>

          <div className="mt-4 rounded-[14px] border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-base font-black text-slate-900">التغذية الراجعة الشاملة</h3>
            <div className="space-y-2 text-sm leading-8 text-slate-700">
              {feedbackLines.length > 0 ? (
                feedbackLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
              ) : (
                <p>لا توجد تغذية راجعة مسجلة لهذا التقرير.</p>
              )}
            </div>
          </div>
        </section>

        <section className="report-sheet overflow-hidden rounded-[16px] border border-slate-200 bg-white px-6 py-5 shadow-soft">
          <ReportHeader schoolName={report.schoolName} educationOffice={report.educationOffice} title="اعتماد مدير المدرسة" compact />

          <div className="mt-8 rounded-[14px] border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-center text-lg font-black text-slate-900">بيان الاعتماد</h3>
            <p className="text-sm leading-9 text-slate-700">
              يعتمد مدير المدرسة هذا التقرير بما تضمنه من نتائج وملاحظات وتوصيات تطويرية، بوصفه وثيقة متابعة رسمية
              ضمن سجلات المدرسة، ويمكن الاستناد إليه في أعمال المتابعة والتحسين وتوثيق الأداء المهني للمعلم خلال العام
              الدراسي {report.academicYear}.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <ApprovalField label="مدير المدرسة" value={report.principalName} />
            <ApprovalField label="تاريخ الاعتماد" value={printDate} />
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
    <div className={compact ? "-mx-6 -mt-5" : "-mx-6 -mt-5"}>
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

function FeedbackBox({
  title,
  items,
  tone,
  compact = false,
}: {
  title: string;
  items: string[];
  tone: "blue" | "neutral";
  compact?: boolean;
}) {
  const classes =
    tone === "blue"
      ? "border-[#d3e2ea] bg-[#f3f8fb]"
      : "border-[#dfe3e8] bg-[#f8fafc]";

  return (
    <div className={`rounded-[14px] border p-5 ${classes}`}>
      <h3 className="mb-3 text-[15px] font-black text-slate-900">{title}</h3>
      <div className={`space-y-2 text-sm text-slate-700 ${compact ? "leading-7" : "leading-8"}`}>
        {items.length > 0 ? items.map((item) => <p key={item}>• {item}</p>) : <p>لا توجد بيانات مسجلة.</p>}
      </div>
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
