"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, PencilLine, Plus, Trash2, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSchema, type TeacherFormValues, type TeacherInput } from "@/lib/validations/teacher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TeacherRecord = TeacherInput & {
  id: string;
};

export function TeacherFormDialog({
  mode,
  teacher,
}: {
  mode: "create" | "edit";
  teacher?: TeacherRecord;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: teacher?.fullName || "",
      nationalId: teacher?.nationalId || "",
      specialization: teacher?.specialization || "",
      subject: teacher?.subject || "",
      className: teacher?.className || "",
    },
  });

  useEffect(() => {
    form.reset({
      fullName: teacher?.fullName || "",
      nationalId: teacher?.nationalId || "",
      specialization: teacher?.specialization || "",
      subject: teacher?.subject || "",
      className: teacher?.className || "",
    });
  }, [form, teacher]);

  async function onSubmit(values: TeacherFormValues) {
    setServerError("");
    const response = await fetch(mode === "create" ? "/api/teachers" : `/api/teachers/${teacher?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      setServerError(data.message || "تعذر حفظ بيانات المعلم.");
      return;
    }

    setIsOpen(false);
    form.reset();
    router.refresh();
  }

  return (
    <>
      <Button variant={mode === "create" ? "default" : "outline"} onClick={() => setIsOpen(true)}>
        {mode === "create" ? <Plus className="ml-2 h-4 w-4" /> : <PencilLine className="ml-2 h-4 w-4" />}
        {mode === "create" ? "إضافة معلم" : "تعديل"}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/80 bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{mode === "create" ? "إضافة معلم جديد" : "تحديث بيانات المعلم"}</h3>
                <p className="text-sm text-slate-500">أدخل البيانات الأساسية للملف المهني للمعلم.</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="الاسم الكامل" error={form.formState.errors.fullName?.message}>
                  <Input {...form.register("fullName")} placeholder="أ. خالد الحربي" />
                </Field>
                <Field label="رقم الهوية" error={form.formState.errors.nationalId?.message}>
                  <Input {...form.register("nationalId")} placeholder="1023456789" />
                </Field>
                <Field label="التخصص" error={form.formState.errors.specialization?.message}>
                  <Input {...form.register("specialization")} placeholder="العلوم" />
                </Field>
                <Field label="المادة" error={form.formState.errors.subject?.message}>
                  <Input {...form.register("subject")} placeholder="العلوم" />
                </Field>
                <Field label="الصف" error={form.formState.errors.className?.message}>
                  <Input {...form.register("className")} placeholder="الأول المتوسط" />
                </Field>
              </div>

              {serverError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {serverError}
                </div>
              ) : null}

              <div className="flex flex-wrap justify-end gap-3 pt-3">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحفظ
                    </>
                  ) : (
                    "حفظ البيانات"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function TeacherDeleteButton({ teacherId, teacherName }: { teacherId: string; teacherName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`سيتم حذف ملف ${teacherName} وكل تقييماته المرتبطة. هل تريد المتابعة؟`);
    if (!confirmed) return;

    setIsSubmitting(true);
    const response = await fetch(`/api/teachers/${teacherId}`, {
      method: "DELETE",
    });
    setIsSubmitting(false);

    if (!response.ok) {
      window.alert("تعذر حذف المعلم حاليًا.");
      return;
    }

    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      onClick={handleDelete}
      disabled={isSubmitting}
      className="text-rose-700 hover:bg-rose-50 hover:text-rose-800"
    >
      <Trash2 className="ml-2 h-4 w-4" />
      حذف
    </Button>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
      <p className="text-xs text-rose-600">{error}</p>
    </div>
  );
}
