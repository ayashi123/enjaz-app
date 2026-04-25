"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ClipboardList,
  ClipboardPenLine,
  FileArchive,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "الرئيسية", icon: Home },
  { href: "/dashboard/teachers", label: "المعلمون", icon: Users },
  { href: "/dashboard/manager-elements", label: "عناصر المدير", icon: ShieldCheck },
  { href: "/dashboard/evidence", label: "الأدلة", icon: FileArchive },
  { href: "/dashboard/external-evaluation", label: "التقويم الخارجي", icon: ClipboardPenLine },
  { href: "/dashboard/evaluations", label: "التقييمات", icon: ClipboardList },
  { href: "/dashboard/reports", label: "التقارير", icon: FileText },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[300px_1fr]">
      <aside className="hidden bg-[linear-gradient(180deg,#123949_0%,#173f52_52%,#0f2d39_100%)] px-5 py-6 text-slate-100 lg:block">
        <Sidebar pathname={pathname} />
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/78 backdrop-blur-xl">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-3 rounded-[28px] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(243,248,248,0.94)_60%,rgba(250,246,238,0.96)_100%)] px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] sm:items-center sm:px-5">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary">منصة إنجاز التعليمية</p>
                <p className="max-w-[220px] text-xs leading-6 text-slate-500 sm:max-w-none sm:text-sm">
                  لوحة تشغيل لإدارة الأداء التعليمي والملفات المدرسية
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden rounded-full border border-[#d7e3e7] bg-white/80 px-4 py-2 text-xs font-semibold text-[#15445a] shadow-sm md:block">
                  بيئة تشغيل مؤسسية مرنة
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl border border-[#d9e6e8] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa] lg:hidden"
                  onClick={() => setOpen((value) => !value)}
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="hidden rounded-2xl border border-[#d8e3e7] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa] sm:inline-flex"
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 lg:hidden">
              <Button
                variant="secondary"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex-1 rounded-2xl border border-[#d8e3e7] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa] sm:hidden"
              >
                <LogOut className="ml-2 h-4 w-4" />
                خروج
              </Button>
              <div className="rounded-full border border-[#dbe6e7] bg-white/80 px-4 py-2 text-[11px] font-semibold text-[#15445a] shadow-sm">
                تجربة جوال محسنة
              </div>
            </div>
          </div>
          {open ? (
            <div className="border-t border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,250,251,0.98)_100%)] px-4 py-4 lg:hidden">
              <Sidebar pathname={pathname} mobile onNavigate={() => setOpen(false)} />
            </div>
          ) : null}
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({
  pathname,
  mobile = false,
  onNavigate,
}: {
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        <div
          className={cn(
            "rounded-[28px] px-5 py-5",
            mobile
              ? "border border-[#dce8e8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f8f8_65%,#fbf7ef_100%)] shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
              : "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.04)_100%)] shadow-panel",
          )}
        >
          <p className={cn("text-xs font-semibold", mobile ? "text-primary" : "text-[#d6e8ef]")}>لوحة التحكم</p>
          <h2 className={cn("mt-2 text-xl font-bold", mobile ? "text-slate-900" : "text-white")}>إدارة المدرسة والأداء</h2>
        </div>
        <nav className={cn("space-y-2", mobile && "grid grid-cols-2 gap-2 space-y-0")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  mobile
                    ? active
                      ? "bg-[#15445a] text-white shadow-sm"
                      : "border border-[#e4ecec] bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:bg-slate-50"
                    : active
                      ? "bg-white text-[#123949] shadow-sm"
                      : "text-slate-200 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {!mobile ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
          تم تجهيز المنصة لتشمل إدارة المعلمين، التقييمات، الأدلة، عناصر المدير، والتقارير النهائية على قاعدة بيانات
          حقيقية وبواجهة تشغيل مؤسسية واضحة.
        </div>
      ) : null}
    </div>
  );
}
