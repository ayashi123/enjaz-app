"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoaderCircle, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setErrorMessage("");
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMessage("تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">البريد الإلكتروني</label>
        <Input
          type="email"
          autoComplete="email"
          placeholder="principal@school.sa"
          {...form.register("email")}
        />
        <p className="text-xs text-rose-600">{form.formState.errors.email?.message}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">كلمة المرور</label>
          <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80">
            نسيت كلمة المرور؟
          </Link>
        </div>
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...form.register("password")}
        />
        <p className="text-xs text-rose-600">{form.formState.errors.password?.message}</p>
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
            جاري تسجيل الدخول
          </>
        ) : (
          <>
            <LogIn className="ml-2 h-4 w-4" />
            تسجيل الدخول
          </>
        )}
      </Button>
    </form>
  );
}
