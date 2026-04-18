import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl border-white/80 bg-white/90 shadow-soft">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold">الصفحة غير موجودة</h1>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            يبدو أن الرابط المطلوب غير متاح أو تم نقله. يمكنك العودة إلى الصفحة الرئيسية أو لوحة التحكم.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild variant="secondary">
              <Link href="/">الصفحة الرئيسية</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">لوحة التحكم</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
