"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoaderCircle, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      schoolName: "",
      educationOffice: "",
      academicYear: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    setErrorMessage("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.message || "تعذر إنشاء الحساب.");
      return;
    }

    const login = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (login?.error) {
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="اسم المدير / القائد" error={form.formState.errors.fullName?.message}>
          <Input placeholder="أ. أحمد محمد" {...form.register("fullName")} />
        </Field>
        <Field label="البريد الإلكتروني" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="principal@school.sa" {...form.register("email")} />
        </Field>
        <Field label="كلمة المرور" error={form.formState.errors.password?.message}>
          <Input type="password" placeholder="ثمانية أحرف على الأقل" {...form.register("password")} />
        </Field>
        <Field label="اسم المدرسة" error={form.formState.errors.schoolName?.message}>
          <Input placeholder="مدرسة النهضة المتوسطة" {...form.register("schoolName")} />
        </Field>
        <Field label="مكتب التعليم / الإدارة" error={form.formState.errors.educationOffice?.message}>
          <Input placeholder="مكتب تعليم شمال الرياض" {...form.register("educationOffice")} />
        </Field>
        <Field label="العام الدراسي" error={form.formState.errors.academicYear?.message}>
          <Input placeholder="1447 / 1448 هـ" {...form.register("academicYear")} />
        </Field>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <Button className="w-full" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
            جاري إنشاء الحساب
          </>
        ) : (
          <>
            <UserPlus className="ml-2 h-4 w-4" />
            إنشاء الحساب والدخول
          </>
        )}
      </Button>
    </form>
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
