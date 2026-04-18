"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, FileBadge2, Files, Save, Sparkles } from "lucide-react";
import { managerEvidenceTypes } from "@/data/manager-elements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAttachmentLabel } from "@/lib/attachments";

type DetailProps = {
  item: {
    id: string;
    elementTitle: string;
    isDone: boolean;
    notes: string | null;
    updatedAt: string;
  };
  definition: {
    weight: number;
    interpretation: string;
    performanceScales: Array<{ level: number; title: string; description: string }>;
    evidenceExamples: string[];
  };
  evidences: Array<{
    id: string;
    title: string;
    evidenceType: string;
    evidenceDate: string;
    notes: string | null;
    status: string;
    attachments: string[];
  }>;
};

export function ManagerElementDetail({ item, definition, evidences }: DetailProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(item.notes || "");
  const [isDone, setIsDone] = useState(item.isDone);
  const [isSavingState, setIsSavingState] = useState(false);

  const [title, setTitle] = useState("");
  const [evidenceType, setEvidenceType] = useState<(typeof managerEvidenceTypes)[number]>("محضر اجتماع");
  const [evidenceDate, setEvidenceDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<"DRAFT" | "VERIFIED" | "ARCHIVED">("DRAFT");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);

  const selectedFileNames = useMemo(() => selectedFiles.map((file) => file.name), [selectedFiles]);

  async function uploadSelectedFiles() {
    if (selectedFiles.length === 0) return [];

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/uploads/evidence", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(payload?.message || "تعذر رفع الملفات.");
    }

    const payload = (await response.json()) as { files: string[]; provider?: "local" | "supabase" };
    return payload.files;
  }

  async function saveElementState() {
    setIsSavingState(true);
    const response = await fetch(`/api/manager-elements/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        elementTitle: item.elementTitle,
        isDone,
        notes,
      }),
    });
    setIsSavingState(false);

    if (!response.ok) {
      window.alert("تعذر تحديث حالة العنصر. حاول مرة أخرى.");
      return;
    }

    router.refresh();
  }

  async function saveEvidence() {
    if (!title.trim()) {
      window.alert("أدخل عنوان الشاهد أولًا.");
      return;
    }

    try {
      setIsSubmittingEvidence(true);
      const uploadedFiles = await uploadSelectedFiles();
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          relatedType: "MANAGER_ELEMENT",
          relatedRef: item.id,
          evidenceType,
          status,
          evidenceDate,
          notes: evidenceNotes,
          attachments: uploadedFiles,
        }),
      });

      if (!response.ok) {
        window.alert("تعذر حفظ الشاهد لهذا العنصر.");
        return;
      }

      setTitle("");
      setEvidenceType("محضر اجتماع");
      setStatus("DRAFT");
      setEvidenceNotes("");
      setSelectedFiles([]);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حفظ الشاهد لهذا العنصر.");
    } finally {
      setIsSubmittingEvidence(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(242,249,248,0.96)_55%,rgba(251,248,240,0.98)_100%)] p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Button variant="ghost" className="h-auto px-0 text-slate-500 hover:bg-transparent" onClick={() => router.push("/dashboard/manager-elements")}>
              <ArrowRight className="ms-2 h-4 w-4" />
              العودة إلى العناصر
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isDone ? "success" : "warning"}>{isDone ? "مكتمل" : "تحت المتابعة"}</Badge>
              <Badge variant="secondary">الوزن {definition.weight}%</Badge>
            </div>
            <h1 className="text-3xl font-bold leading-[1.8] text-slate-900">{item.elementTitle}</h1>
            <p className="max-w-4xl text-sm leading-8 text-slate-600">{definition.interpretation}</p>
          </div>
          <div className="rounded-[28px] border border-teal-100 bg-white/85 px-5 py-4 text-sm text-slate-600 shadow-sm">
            <p>
              آخر تحديث: <span className="font-semibold text-slate-900">{new Date(item.updatedAt).toLocaleDateString("ar-SA")}</span>
            </p>
            <p className="mt-2">
              عدد الشواهد الحالية: <span className="font-semibold text-slate-900">{evidences.length}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <Sparkles className="h-5 w-5 text-teal-700" />
              <h2 className="text-xl font-bold">سلالم الأداء</h2>
            </div>
            <div className="grid gap-3">
              {definition.performanceScales.map((scale) => (
                <div key={scale.level} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-base font-bold text-slate-900">المستوى {scale.level}</span>
                    <Badge variant="secondary">{scale.title}</Badge>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{scale.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <Files className="h-5 w-5 text-sky-700" />
              <h2 className="text-xl font-bold">أمثلة الشواهد</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {definition.evidenceExamples.map((example) => (
                <div key={example} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                  {example}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <h2 className="text-xl font-bold">حالة العنصر وملاحظاته</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="حالة التنفيذ">
                <select
                  className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
                  value={isDone ? "done" : "pending"}
                  onChange={(event) => setIsDone(event.target.value === "done")}
                >
                  <option value="pending">تحت المتابعة</option>
                  <option value="done">مكتمل</option>
                </select>
              </Field>
              <Field label="آخر تحديث">
                <Input value={new Date(item.updatedAt).toLocaleDateString("ar-SA")} disabled />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="ملاحظات المتابعة">
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-[140px]"
                  placeholder="سجل ملخص الإنجاز، أو نقاط المتابعة، أو أي ملاحظة إشرافية ذات صلة."
                />
              </Field>
            </div>
            <div className="mt-4">
              <Button onClick={saveElementState} disabled={isSavingState}>
                <Save className="h-4 w-4" />
                {isSavingState ? "جاري حفظ التحديث..." : "حفظ حالة العنصر"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2 text-slate-900">
              <FileBadge2 className="h-5 w-5 text-amber-700" />
              <h2 className="text-xl font-bold">إضافة شاهد جديد</h2>
            </div>
            <div className="grid gap-4">
              <Field label="عنوان الشاهد">
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="مثال: محضر متابعة تنفيذ الخطة التشغيلية" />
              </Field>

              <Field label="نوع الشاهد">
                <select
                  className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
                  value={evidenceType}
                  onChange={(event) => setEvidenceType(event.target.value as (typeof managerEvidenceTypes)[number])}
                  required
                >
                  {managerEvidenceTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="تاريخ الشاهد">
                  <Input type="date" value={evidenceDate} onChange={(event) => setEvidenceDate(event.target.value)} />
                </Field>
                <Field label="حالة الشاهد">
                  <select
                    className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as typeof status)}
                  >
                    <option value="DRAFT">مسودة</option>
                    <option value="VERIFIED">معتمد</option>
                    <option value="ARCHIVED">مؤرشف</option>
                  </select>
                </Field>
              </div>

              <Field label="المرفقات">
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
                  <Input
                    type="file"
                    multiple
                    onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
                  />
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    يقبل النظام جميع أنواع الملفات. يتم حفظ أسماء الملفات ضمن الشاهد الحالي تمهيدًا لتوصيل
                    التخزين الفعلي لاحقًا.
                  </p>
                  {selectedFileNames.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedFileNames.map((name) => (
                        <Badge key={name} variant="secondary">
                          {getAttachmentLabel(name)}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Field>

              <Field label="ملاحظات الشاهد">
                <Textarea
                  value={evidenceNotes}
                  onChange={(event) => setEvidenceNotes(event.target.value)}
                  className="min-h-[140px]"
                  placeholder="اكتب شرحًا مختصرًا يوضح سياق الشاهد، وجهة الاستفادة منه، وأثره على تقويم العنصر."
                />
              </Field>

              <Button onClick={saveEvidence} disabled={isSubmittingEvidence}>
                {isSubmittingEvidence ? "جاري حفظ الشاهد..." : "حفظ الشاهد"}
              </Button>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900">سجل الشواهد المرتبطة</h2>
            <div className="mt-4 space-y-3">
              {evidences.length > 0 ? (
                evidences.map((evidence) => (
                  <div key={evidence.id} className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900">{evidence.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{evidence.evidenceType}</Badge>
                        <Badge variant="secondary">
                          {new Date(evidence.evidenceDate).toLocaleDateString("ar-SA")}
                        </Badge>
                      </div>
                    </div>
                    {evidence.notes ? <p className="mt-3 text-sm leading-7 text-slate-600">{evidence.notes}</p> : null}
                    {evidence.attachments.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {evidence.attachments.map((attachment) => (
                          <a
                            key={attachment}
                            href={attachment}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-300"
                          >
                            {getAttachmentLabel(attachment)}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm leading-7 text-slate-500">
                  لا توجد شواهد مرتبطة بهذا العنصر بعد. يمكنك إضافة أول شاهد من النموذج أعلاه.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
