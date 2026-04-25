"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, School, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "لوحة المشرف", icon: LayoutDashboard },
  { href: "/admin/users", label: "إدارة الحسابات", icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f4faf7_0%,#eef5f4_35%,#f8f6f0_100%)] lg:grid lg:grid-cols-[300px_1fr]">
      <aside className="hidden bg-[linear-gradient(180deg,#163c4b_0%,#113240_55%,#0c2732_100%)] px-5 py-6 text-slate-100 lg:block">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 shadow-panel">
              <p className="text-xs font-semibold text-[#d6e8ef]">منصة إنجاز التعليمية</p>
              <h2 className="mt-2 text-xl font-bold text-white">المشرف العام</h2>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                مركز إدارة المنصة والحسابات وصلاحيات الوصول والمتابعة العامة للنظام.
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      active ? "bg-white text-[#123949] shadow-sm" : "text-slate-200 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
            صلاحية المشرف العام تمنحك التحكم في الحسابات وحالة التفعيل وأدوار الوصول على مستوى النظام بالكامل.
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="rounded-[24px] border border-white/75 bg-white/90 px-5 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold text-primary">لوحة الإشراف العام</p>
              <p className="mt-1 text-sm text-slate-500">إدارة المدارس والحسابات وصلاحيات المنصة من مكان واحد.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/dashboard">
                <Button variant="secondary" className="rounded-2xl border border-[#d8e3e7] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa]">
                  <School className="ml-2 h-4 w-4" />
                  العودة للمنصة
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="rounded-2xl border border-[#d8e3e7] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa]"
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </header>

        <div className="border-b border-slate-200 bg-white/70 px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium",
                    active ? "bg-[#15445a] text-white" : "border border-[#e4ecec] bg-white text-slate-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
