import Link from "next/link";
import { ArrowLeft, Building2, FileCheck2, ShieldCheck, Sparkles, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "إدارة مدرسية متكاملة",
    description: "ملفات المدرسة والقائد والكوادر التعليمية في مساحة واحدة واضحة وآمنة.",
    icon: Building2,
  },
  {
    title: "محرك تقييم احترافي",
    description: "تقييمات قائمة على النموذج الرسمي مع حساب موزون نهائي من 5 وتقارير جاهزة.",
    icon: FileCheck2,
  },
  {
    title: "حوكمة وأمان",
    description: "دخول آمن بالبريد الإلكتروني وكلمات المرور المشفرة وبنية جاهزة للإنتاج.",
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
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="glass-panel mb-8 flex flex-col gap-4 rounded-[28px] px-5 py-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-3">
          <div>
            <p className="text-xs font-semibold text-primary">منصة إنجاز التعليمية</p>
            <p className="text-sm text-muted-foreground">نظام عربي لإدارة الأداء التعليمي وقيادة المدرسة</p>
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

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/85 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              بيئة عمل مصممة لقادة المدارس والوكلاء
            </div>
            <div className="space-y-5">
              <h1 className="section-title max-w-3xl text-3xl font-bold leading-[1.45] sm:text-5xl">
                إدارة تقييمات المعلمين والأدلة والتقارير الرسمية بمنصة عربية هادئة واحترافية.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                صممت منصة إنجاز التعليمية لتجمع بين التتبع التنفيذي، المتابعة الصفية، إدارة الشواهد، وحوكمة الأداء في
                تجربة رقمية مرنة تناسب الهاتف واللوحي وسطح المكتب.
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
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

          <Card className="overflow-hidden border-white/70 bg-white/92 shadow-soft">
            <CardHeader className="border-b border-[#dde7ea] bg-[linear-gradient(135deg,#eff5f6_0%,#f9f3e6_100%)]">
              <CardTitle className="text-xl font-bold">ملامح النسخة الإنتاجية</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-5 sm:p-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-[22px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfc_100%)] p-4 shadow-sm transition-transform hover:-translate-y-1 sm:p-5"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mb-2 text-lg font-bold">{feature.title}</h2>
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
