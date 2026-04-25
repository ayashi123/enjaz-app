"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { managerEvidenceTypes } from "@/data/manager-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAttachmentLabel } from "@/lib/attachments";

type RelatedOption = { id: string; label: string };

export function EvidenceForm({
  teachers,
  evaluations,
  managerElements,
}: {
  teachers: RelatedOption[];
  evaluations: RelatedOption[];
  managerElements: RelatedOption[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [relatedType, setRelatedType] = useState<"GENERAL" | "TEACHER" | "TEACHER_EVALUATION" | "MANAGER_ELEMENT">("GENERAL");
  const [relatedRef, setRelatedRef] = useState("");
  const [evidenceType, setEvidenceType] = useState<(typeof managerEvidenceTypes)[number]>("محضر اجتماع");
  const [status, setStatus] = useState<"DRAFT" | "VERIFIED" | "ARCHIVED">("DRAFT");
  const [evidenceDate, setEvidenceDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentOptions =
    relatedType === "TEACHER"
      ? teachers
      : relatedType === "TEACHER_EVALUATION"
        ? evaluations
        : relatedType === "MANAGER_ELEMENT"
          ? managerElements
          : [];

  const attachmentNames = useMemo(() => selectedFiles.map((file) => file.name), [selectedFiles]);

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

    const payload = (await response.json()) as { files: string[] };
    return payload.files;
  }

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      const uploadedFiles = await uploadSelectedFiles();
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          relatedType,
          relatedRef,
          evidenceType,
          status,
          evidenceDate,
          notes,
          attachments: uploadedFiles,
        }),
      });

      if (!response.ok) {
        window.alert("تعذر حفظ الشاهد.");
        return;
      }

      setTitle("");
      setRelatedType("GENERAL");
      setRelatedRef("");
      setEvidenceType("محضر اجتماع");
      setStatus("DRAFT");
      setEvidenceDate(new Date().toISOString().slice(0, 10));
      setNotes("");
      setSelectedFiles([]);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حفظ الشاهد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="عنوان الشاهد">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </Field>

      <Field label="نوع الارتباط">
        <select
          className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
          value={relatedType}
          onChange={(event) => {
            setRelatedType(event.target.value as typeof relatedType);
            setRelatedRef("");
          }}
        >
          <option value="GENERAL">عام</option>
          <option value="TEACHER">معلم</option>
          <option value="TEACHER_EVALUATION">تقييم معلم</option>
          <option value="MANAGER_ELEMENT">عنصر مدير</option>
        </select>
      </Field>

      {relatedType !== "GENERAL" ? (
        <Field label="المرجع المرتبط">
          <select
            className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
            value={relatedRef}
            onChange={(event) => setRelatedRef(event.target.value)}
          >
            <option value="">اختر المرجع</option>
            {currentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      <Field label="نوع الشاهد">
        <select
          className="flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-2 text-sm"
          value={evidenceType}
          onChange={(event) => setEvidenceType(event.target.value as (typeof managerEvidenceTypes)[number])}
        >
          {managerEvidenceTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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

      <Field label="تاريخ الشاهد">
        <Input type="date" value={evidenceDate} onChange={(event) => setEvidenceDate(event.target.value)} />
      </Field>

      <div className="md:col-span-2">
        <Field label="الملاحظات">
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Field>
      </div>

      <div className="md:col-span-2">
        <Field label="المرفقات">
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
            <Input type="file" multiple onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))} />
            <p className="mt-2 text-xs leading-6 text-slate-500">
              يقبل النظام جميع أنواع الملفات، ويتم حفظ أسماء الملفات داخل سجل الشاهد.
            </p>
            {attachmentNames.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {attachmentNames.map((name) => (
                  <span key={name} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                    {getAttachmentLabel(name)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </Field>
      </div>

      <div className="md:col-span-2">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-2xl sm:w-auto">
          {isSubmitting ? "جاري الحفظ..." : "حفظ الشاهد"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}
