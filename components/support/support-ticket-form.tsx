"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function SupportTicketForm() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("تقني");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitTicket() {
    startTransition(async () => {
      setMessage(null);

      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, priority, description }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result.message || "تعذر إرسال التذكرة.");
        return;
      }

      setSubject("");
      setCategory("تقني");
      setPriority("MEDIUM");
      setDescription("");
      setMessage("تم إرسال التذكرة إلى فريق الدعم الفني.");
    });
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-black text-slate-900">إرسال تذكرة دعم فني</h2>
      <div className="mt-5 grid gap-4">
        <input className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="عنوان المشكلة" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>تقني</option>
            <option>حساب</option>
            <option>اشتراك</option>
            <option>تقارير</option>
            <option>أخرى</option>
          </select>
          <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" value={priority} onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}>
            <option value="LOW">منخفضة</option>
            <option value="MEDIUM">متوسطة</option>
            <option value="HIGH">عالية</option>
          </select>
        </div>
        <textarea className="min-h-[140px] rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="اكتب تفاصيل المشكلة أو الطلب..." value={description} onChange={(e) => setDescription(e.target.value)} />
        {message ? <div className="rounded-2xl border border-[#d7e6db] bg-[#f6fbf7] px-4 py-3 text-sm font-medium text-[#15445a]">{message}</div> : null}
        <div>
          <Button type="button" onClick={submitTicket} disabled={isPending} className="rounded-2xl">
            إرسال التذكرة
          </Button>
        </div>
      </div>
    </div>
  );
}
