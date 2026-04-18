import { AlertTriangle } from "lucide-react";

export function DatabaseAlert() {
  return (
    <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <div className="mb-2 flex items-center gap-2 font-bold">
        <AlertTriangle className="h-4 w-4" />
        قاعدة البيانات غير متصلة حاليًا
      </div>
      <p className="text-sm leading-7">
        الواجهة تعمل والبناء ناجح، لكن البيانات الحية تحتاج PostgreSQL فعليًا عبر المتغير
        <span className="mx-1 rounded bg-white px-2 py-1 font-mono text-xs">DATABASE_URL</span>
        حتى تظهر السجلات وتعمل العمليات الحقيقية.
      </p>
    </div>
  );
}
