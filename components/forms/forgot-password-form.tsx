"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-5">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">البريد الإلكتروني</label>
          <Input
            type="email"
            autoComplete="email"
            placeholder="principal@school.sa"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <p className="text-xs leading-6 text-slate-500">
            أدخل البريد المرتبط بحسابك، وسنعتمد هذا المسار لاحقًا لتفعيل إعادة التعيين عبر البريد الإلكتروني.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-800">
            تم تسجيل طلب الاستعادة لهذا البريد بشكل تمهيدي. إلى حين تفعيل الإرسال الآلي، يمكنك التواصل مع مسؤول
            المنصة أو العودة لتسجيل الدخول إن تذكرت كلمة المرور.
          </div>
        ) : null}

        <Button className="w-full" size="lg" type="submit">
          <MailCheck className="ml-2 h-4 w-4" />
          متابعة طلب الاستعادة
        </Button>
      </form>

      <Button asChild variant="ghost" className="w-full rounded-2xl">
        <Link href="/login">
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة إلى تسجيل الدخول
        </Link>
      </Button>
    </div>
  );
}
