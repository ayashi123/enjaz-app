"use client";

import { useState, useTransition } from "react";
import { LifeBuoy, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PublicSupportForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submitSupportRequest() {
    startTransition(async () => {
      setMessage(null);
      setIsError(false);

      const response = await fetch("/api/public-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, priority, description }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setIsError(true);
        setMessage(result.message || "تعذر إرسال طلب الدعم.");
        return;
      }

      setEmail("");
      setSubject("");
      setPriority("MEDIUM");
      setDescription("");
      setMessage(result.message || "تم إرسال طلب الدعم بنجاح.");
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[#d8e7de] bg-[#f6fbf8] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-900">الدعم الفني للمشتركين</h3>
            <p className="text-sm leading-7 text-slate-600">
              استخدم البريد الإلكتروني المسجل في المنصة، ثم اشرح مشكلة الدخول أو الحساب ليصل الطلب مباشرة إلى فريق
              الدعم والمشرف العام.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <Input
          type="email"
          placeholder="البريد الإلكتروني المسجل"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Input
          placeholder="عنوان المشكلة"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />

        <select
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none ring-0 transition focus:border-primary"
          value={priority}
          onChange={(event) => setPriority(event.target.value as "LOW" | "MEDIUM" | "HIGH")}
        >
          <option value="LOW">أولوية منخفضة</option>
          <option value="MEDIUM">أولوية متوسطة</option>
          <option value="HIGH">أولوية عالية</option>
        </select>

        <textarea
          className="min-h-[150px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary"
          placeholder="اكتب تفاصيل المشكلة، مثل: تعذر تسجيل الدخول، كلمة مرور مؤقتة، أو مشكلة في الاشتراك."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        {message ? (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              isError ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-[#d7e6db] bg-[#f6fbf7] text-[#15445a]"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div>
          <Button type="button" onClick={submitSupportRequest} disabled={isPending} className="rounded-2xl">
            <Send className="ml-2 h-4 w-4" />
            إرسال طلب الدعم
          </Button>
        </div>
      </div>
    </div>
  );
}
