import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "إدارة مدرسية متكاملة",
    description: "ملفات المدرسة والمدير والكوادر التعليمية في مساحة تشغيل واحدة واضحة وآمنة.",
    icon: Building2,
  },
  {
    title: "محرك تقييم احترافي",
    description: "تقييمات قائمة على النموذج الرسمي مع حساب نهائي من 5 وتقارير جاهزة للطباعة.",
    icon: FileCheck2,
  },
  {
    title: "حوكمة وأمان",
    description: "دخول آمن وبنية تشغيل جاهزة للإنتاج مع إدارة حسابات وصلاحيات ومتابعة واضحة.",
    icon: ShieldCheck,
  },
  {
    title: "رؤية تنفيذية",
    description: "لوحات متابعة للمؤشرات والإنجازات والعناصر الإدارية والتنبيهات التشغيلية.",
    icon: Users2,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="glass-panel mb-6 flex flex-col gap-4 rounded-[30px] px-5 py-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-3">
          <div>
            <p className="text-xs font-semibold text-primary">منصة إنجاز التعليمية</p>
            <p className="text-sm text-muted-foreground">نظام للإدارة المدرسية</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Button asChild variant="ghost" className="rounded-2xl border border-[#dfe7e9] bg-white/70">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button asChild className="rounded-2xl">
              <Link href="/register">إنشاء حساب</Link>
            </Button>
          </div>
        </header>

        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              بيئة عمل مصممة لمديري المدارس والوكلاء
            </div>

            <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.98)_0%,rgba(244,248,248,0.95)_55%,rgba(252,246,236,0.98)_100%)] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.09)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-[0.18em] text-primary/75">ENJAZ</p>
                  <h1 className="text-3xl font-black leading-[1.4] text-slate-900 sm:text-5xl">
                    منصة تشغيل حديثة
                    <br />
                    أقرب للتطبيقات
                  </h1>
                </div>

                <div className="hidden h-20 w-20 rounded-[28px] bg-[linear-gradient(135deg,#15445a_0%,#2f6c68_100%)] shadow-[0_18px_30px_rgba(21,68,90,0.18)] sm:block" />
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 sm:text-lg">
                صممت منصة إنجاز التعليمية لتجمع بين التتبع التنفيذي والمتابعة الصفية وإدارة الشواهد وحوكمة الأداء في
                تجربة رقمية مرنة تناسب الهاتف واللوحي وسطح المكتب.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/80 bg-white/90 p-3 text-center shadow-sm">
                  <p className="text-xl font-black text-slate-900">11</p>
                  <p className="text-xs text-slate-500">عنصر تقييم</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/90 p-3 text-center shadow-sm">
                  <p className="text-xl font-black text-slate-900">4</p>
                  <p className="text-xs text-slate-500">مجالات خارجية</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/90 p-3 text-center shadow-sm">
                  <p className="text-xl font-black text-slate-900">A4</p>
                  <p className="text-xs text-slate-500">تقارير رسمية</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                <Button asChild size="lg" className="rounded-2xl">
                  <Link href="/register">
                    ابدأ المنصة الآن
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="rounded-2xl">
                  <Link href="/login">الدخول إلى الحساب</Link>
                </Button>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-white/70 bg-white/92 shadow-soft">
            <CardHeader className="border-b border-[#dde7ea] bg-[linear-gradient(135deg,#eff5f6_0%,#f9f3e6_100%)]">
              <CardTitle className="text-xl font-black">ملامح النسخة الإنتاجية</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 sm:p-6">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[24px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] p-4 shadow-sm transition-transform hover:-translate-y-1 sm:p-5"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mb-2 text-lg font-black text-slate-900">{feature.title}</h2>
                    <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
