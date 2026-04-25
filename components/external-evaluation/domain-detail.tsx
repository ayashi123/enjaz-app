"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Link2, Paperclip, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type IndicatorCardData = {
  code: string;
  text: string;
  tools: string[];
  guidance: string[];
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  notes: string;
  evidences: Array<{
    id: string;
    title: string;
    fileUrl: string | null;
    linkUrl: string | null;
    note: string | null;
    createdAt: Date | string;
  }>;
};

type StandardSection = {
  id: string;
  title: string;
  summaryGuidance: string[];
  indicators: IndicatorCardData[];
  indicatorsCount: number;
  completedIndicators: number;
  evidencesCount: number;
  completionRate: number;
};

export function ExternalEvaluationDomainDetail({
  domainId,
  domainTitle,
  standards,
}: {
  domainId: string;
  domainTitle: string;
  standards: StandardSection[];
}) {
  return (
    <div className="space-y-4">
      {standards.map((standard) => (
        <details
          key={standard.id}
          className="group overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] shadow-soft"
          open
        >
          <summary className="flex cursor-pointer list-none flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{standard.title}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {standard.indicatorsCount} مؤشرات • {standard.evidencesCount} شواهد • {standard.completionRate}% إنجاز
              </p>
            </div>
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {standard.completedIndicators} مكتمل
            </div>
          </summary>

          <div className="border-t border-slate-100 px-6 py-5">
            {standard.summaryGuidance.length > 0 ? (
              <div className="mb-5 rounded-[22px] border border-amber-100 bg-amber-50/70 p-4">
                <h3 className="mb-2 text-sm font-bold text-slate-900">إضاءات عامة للمعيار</h3>
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {standard.summaryGuidance.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {standard.indicators.length > 0 ? (
              <div className="space-y-4">
                {standard.indicators.map((indicator) => (
                  <IndicatorCard
                    key={indicator.code}
                    domainId={domainId}
                    domainTitle={domainTitle}
                    standardId={standard.id}
                    standardTitle={standard.title}
                    indicator={indicator}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-500">
                لا توجد مؤشرات مدخلة لهذا المعيار حتى الآن.
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

function IndicatorCard({
  domainId,
  domainTitle,
  standardId,
  standardTitle,
  indicator,
}: {
  domainId: string;
  domainTitle: string;
  standardId: string;
  standardTitle: string;
  indicator: IndicatorCardData;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(indicator.status);
  const [notes, setNotes] = useState(indicator.notes);
  const [isSaving, setIsSaving] = useState(false);
  const [witnessTitle, setWitnessTitle] = useState("");
  const [witnessNote, setWitnessNote] = useState("");
  const [witnessLink, setWitnessLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingWitness, setIsUploadingWitness] = useState(false);

  const normalizedGuidance = useMemo(() => indicator.guidance.filter(Boolean), [indicator.guidance]);

  async function saveIndicator() {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/external-evaluation/indicator/${encodeURIComponent(indicator.code)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainId,
          domainTitle,
          standardId,
          standardTitle,
          indicatorCode: indicator.code,
          indicatorText: indicator.text,
          status,
          notes,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        window.alert(payload?.message || "تعذر تحديث المؤشر.");
        return;
      }

      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function saveWitness() {
    if (!witnessTitle.trim()) {
      window.alert("أدخل اسم الشاهد أولًا.");
      return;
    }

    try {
      setIsUploadingWitness(true);
      let fileUrl = "";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("files", selectedFile);

        const uploadResponse = await fetch("/api/uploads/evidence", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadPayload = (await uploadResponse.json().catch(() => null)) as { message?: string } | null;
          throw new Error(uploadPayload?.message || "تعذر رفع ملف الشاهد.");
        }

        const uploadPayload = (await uploadResponse.json()) as { files: string[] };
        fileUrl = uploadPayload.files[0] || "";
      }

      const response = await fetch(
        `/api/external-evaluation/indicator/${encodeURIComponent(indicator.code)}/evidence`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: witnessTitle,
            note: witnessNote,
            linkUrl: witnessLink,
            fileUrl,
          }),
        },
      );

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        window.alert(payload?.message || "تعذر حفظ الشاهد.");
        return;
      }

      setWitnessTitle("");
      setWitnessNote("");
      setWitnessLink("");
      setSelectedFile(null);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حفظ الشاهد.");
    } finally {
      setIsUploadingWitness(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {indicator.code}
          </div>
          <h3 className="text-base font-bold leading-8 text-slate-900">{indicator.text}</h3>
        </div>
        <div className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          {getStatusLabel(status)}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <InfoPanel title="أدوات التقويم">
            <div className="flex flex-wrap gap-2">
              {indicator.tools.map((tool) => (
                <span key={tool} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {tool}
                </span>
              ))}
            </div>
          </InfoPanel>

          <InfoPanel title="الإضاءات نحو تحقيق المؤشر">
            {normalizedGuidance.length > 0 ? (
              <ul className="space-y-2 text-sm leading-7 text-slate-700">
                {normalizedGuidance.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">لا توجد إضاءات تفصيلية مضافة لهذا المؤشر حتى الآن.</p>
            )}
          </InfoPanel>
        </div>

        <div className="space-y-4">
          <InfoPanel title="متابعة الإنجاز">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">حالة الإنجاز</label>
                <select
                  className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as typeof status)}
                >
                  <option value="NOT_STARTED">لم يبدأ</option>
                  <option value="IN_PROGRESS">قيد العمل</option>
                  <option value="COMPLETED">مكتمل</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">الملاحظات</label>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-[120px]"
                  placeholder="أضف ملاحظاتك حول واقع المؤشر أو خطوات التحسين."
                />
              </div>

              <Button onClick={saveIndicator} disabled={isSaving} className="w-full rounded-2xl">
                <Save className="ml-2 h-4 w-4" />
                {isSaving ? "جارٍ حفظ التحديث..." : "حفظ حالة المؤشر"}
              </Button>
            </div>
          </InfoPanel>

          <InfoPanel title="الشواهد">
            <div className="space-y-4">
              <div className="grid gap-3">
                <Input
                  placeholder="اسم الشاهد"
                  value={witnessTitle}
                  onChange={(event) => setWitnessTitle(event.target.value)}
                />
                <Input
                  placeholder="رابط الشاهد (اختياري عند رفع ملف)"
                  value={witnessLink}
                  onChange={(event) => setWitnessLink(event.target.value)}
                />
                <Input type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
                <Textarea
                  placeholder="ملاحظة قصيرة حول الشاهد"
                  value={witnessNote}
                  onChange={(event) => setWitnessNote(event.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={saveWitness} disabled={isUploadingWitness} variant="secondary" className="rounded-2xl">
                  <Paperclip className="ml-2 h-4 w-4" />
                  {isUploadingWitness ? "جارٍ حفظ الشاهد..." : "إضافة شاهد"}
                </Button>
              </div>

              {indicator.evidences.length > 0 ? (
                <div className="space-y-3">
                  {indicator.evidences.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          {item.note ? <p className="mt-1 text-sm leading-7 text-slate-600">{item.note}</p> : null}
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm"
                          >
                            <Paperclip className="ml-1 h-3.5 w-3.5" />
                            فتح الملف
                          </a>
                        ) : null}
                        {item.linkUrl ? (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm"
                          >
                            <Link2 className="ml-1 h-3.5 w-3.5" />
                            فتح الرابط
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-7 text-slate-500">
                  لا توجد شواهد مرفوعة لهذا المؤشر بعد.
                </div>
              )}
            </div>
          </InfoPanel>
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] p-4">
      <h4 className="mb-3 text-sm font-black text-slate-900">{title}</h4>
      {children}
    </div>
  );
}

function getStatusLabel(status: IndicatorCardData["status"]) {
  if (status === "COMPLETED") return "مكتمل";
  if (status === "IN_PROGRESS") return "قيد العمل";
  return "لم يبدأ";
}
