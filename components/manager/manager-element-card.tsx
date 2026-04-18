"use client";

import Link from "next/link";
import { ArrowUpLeft, CheckCircle2, CircleDashed, FileStack, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ManagerElementCard({
  item,
  evidenceCount,
  weight,
}: {
  item: { id: string; elementTitle: string; isDone: boolean; notes: string | null; updatedAt: string };
  evidenceCount: number;
  weight?: number;
}) {
  return (
    <Link
      href={`/dashboard/manager-elements/${item.id}`}
      className="group block rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,250,250,0.98)_100%)] p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={item.isDone ? "success" : "warning"}>{item.isDone ? "مكتمل" : "يحتاج متابعة"}</Badge>
            {typeof weight === "number" ? <Badge variant="secondary">الوزن {weight}%</Badge> : null}
          </div>
          <h3 className="text-xl font-bold leading-8 text-slate-900">{item.elementTitle}</h3>
          <p className="text-sm text-slate-500">
            آخر تحديث: {new Date(item.updatedAt).toLocaleDateString("ar-SA")}
          </p>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50/80 p-3 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
          <ArrowUpLeft className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            {item.isDone ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <CircleDashed className="h-4 w-4 text-amber-700" />}
            حالة التنفيذ
          </div>
          <p className="text-sm text-slate-500">{item.isDone ? "تم توثيق الإنجاز والمتابعة" : "العنصر ما زال ضمن قائمة المتابعة"}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileStack className="h-4 w-4 text-sky-700" />
            عدد الشواهد
          </div>
          <p className="text-sm text-slate-500">{evidenceCount} شاهد مرتبط بهذا العنصر</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-violet-700" />
            الملاحظات
          </div>
          <p className="line-clamp-2 text-sm text-slate-500">
            {item.notes?.trim() ? item.notes : "افتح البطاقة لإضافة التفسير والملاحظات والشواهد بشكل منظم."}
          </p>
        </div>
      </div>
    </Link>
  );
}
