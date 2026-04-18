"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl border-white/80 bg-white/90 shadow-soft">
        <CardContent className="p-8">
          <div className="mb-5 flex items-center gap-3 text-rose-700">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-2xl font-bold">حدث خطأ أثناء تحميل لوحة النظام</h1>
          </div>
          <p className="text-sm leading-8 text-slate-600">
            حاولنا تحميل البيانات المطلوبة لكن العملية لم تكتمل بنجاح. يمكنك إعادة المحاولة مباشرة، وإن استمر
            الخطأ فراجع إعدادات قاعدة البيانات أو أعد تحميل الصفحة.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={reset}>
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة المحاولة
            </Button>
          </div>
          {process.env.NODE_ENV === "development" ? (
            <pre className="mt-6 overflow-auto rounded-3xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
              {error.message}
            </pre>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
