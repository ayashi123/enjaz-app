import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  footerText,
  footerLink,
  footerLinkLabel,
  children,
}: {
  title: string;
  description: string;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="overflow-hidden border-white/80 bg-gradient-to-br from-primary via-emerald-900 to-slate-900 text-white shadow-soft lg:hidden">
          <CardContent className="p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold leading-[1.6]">منصة إنجاز التعليمية</h1>
            <p className="mt-3 text-sm leading-7 text-emerald-50/90">
              واجهة متكاملة للإدارة المدرسية، صممت لتوحيد التقييمات، الشواهد، المتابعة، والتقارير الرسمية في بيئة
              مؤسسية حديثة.
            </p>
          </CardContent>
        </Card>

        <Card className="hidden overflow-hidden border-white/80 bg-gradient-to-br from-primary via-emerald-900 to-slate-900 text-white shadow-soft lg:block">
          <CardContent className="flex h-full flex-col justify-between p-10">
            <div className="space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-[1.5]">منصة إنجاز التعليمية</h1>
                <p className="max-w-xl text-base leading-8 text-emerald-50/90">
                  واجهة متكاملة للإدارة المدرسية، صممت لتوحيد التقييمات، الشواهد، المتابعة، والتقارير الرسمية في
                  بيئة مؤسسية حديثة.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-white/92 shadow-soft">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold text-primary">الوصول الآمن</p>
              <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm leading-7 text-slate-600">{description}</p>
            </div>

            {children}

            <div className="mt-6 text-sm text-slate-600">
              {footerText}{" "}
              <Link href={footerLink} className="font-bold text-primary hover:text-primary/80">
                {footerLinkLabel}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
