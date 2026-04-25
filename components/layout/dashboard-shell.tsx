"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ClipboardList,
  ClipboardPenLine,
  FileArchive,
  FileText,
  Grid2x2,
  Headset,
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

type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "الرئيسية", icon: Home },
  { href: "/dashboard/teachers", label: "المعلمون", icon: Users },
  { href: "/dashboard/manager-elements", label: "عناصر المدير", icon: ShieldCheck },
  { href: "/dashboard/evidence", label: "الأدلة", icon: FileArchive },
  { href: "/dashboard/external-evaluation", label: "التقويم الخارجي", icon: ClipboardPenLine },
  { href: "/dashboard/evaluations", label: "التقييمات", icon: ClipboardList },
  { href: "/dashboard/reports", label: "التقارير", icon: FileText },
  { href: "/dashboard/support", label: "الدعم الفني", icon: Headset },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

const mobilePrimaryNav: NavItem[] = [
  { href: "/dashboard", label: "الرئيسية", shortLabel: "الرئيسية", icon: Home },
  { href: "/dashboard/teachers", label: "المعلمون", shortLabel: "المعلمون", icon: Users },
  { href: "/dashboard/evaluations", label: "التقييمات", shortLabel: "التقييم", icon: ClipboardList },
  { href: "/dashboard/reports", label: "التقارير", shortLabel: "التقارير", icon: FileText },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentSection = useMemo(() => {
    return navItems.find((item) => isActivePath(pathname, item.href))?.label ?? "لوحة التحكم";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-transparent lg:grid lg:grid-cols-[300px_1fr]">
      <aside className="hidden bg-[linear-gradient(180deg,#123949_0%,#173f52_52%,#0f2d39_100%)] px-5 py-6 text-slate-100 lg:block">
        <Sidebar pathname={pathname} />
      </aside>

      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-white/72 backdrop-blur-2xl">
          <div className="px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 rounded-[30px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(244,248,248,0.95)_58%,rgba(251,246,239,0.98)_100%)] px-4 py-3 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:px-5 sm:py-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold tracking-wide text-primary sm:text-xs">منصة إنجاز التعليمية</p>
                <h1 className="text-base font-black text-slate-900 sm:text-lg">{currentSection}</h1>
                <p className="text-[11px] leading-5 text-slate-500 sm:text-sm">واجهة تشغيل مرنة ومريحة للجوال واللوحي وسطح المكتب</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden rounded-full border border-[#d7e3e7] bg-white/85 px-4 py-2 text-xs font-semibold text-[#15445a] shadow-sm md:block">
                  تجربة تطبيقية حديثة
                </div>

                <Button
                  variant="secondary"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="hidden rounded-2xl border border-[#d8e3e7] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa] sm:inline-flex"
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل الخروج
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl border border-[#d9e6e8] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa] lg:hidden"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">{children}</main>

        <MobileBottomBar pathname={pathname} onMenuOpen={() => setOpen(true)} />

        {open ? (
          <MobileDrawer pathname={pathname} onClose={() => setOpen(false)} />
        ) : null}
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
            "rounded-[30px] px-5 py-5",
            mobile
              ? "border border-[#dce8e8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f8f8_65%,#fbf7ef_100%)] shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
              : "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.04)_100%)] shadow-panel",
          )}
        >
          <p className={cn("text-xs font-semibold", mobile ? "text-primary" : "text-[#d6e8ef]")}>لوحة التحكم</p>
          <h2 className={cn("mt-2 text-xl font-black", mobile ? "text-slate-900" : "text-white")}>إدارة المدرسة والأداء</h2>
          <p className={cn("mt-2 text-xs leading-6", mobile ? "text-slate-500" : "text-slate-300")}>
            تنقل واضح وبطاقات تشغيل سريعة وتجربة مريحة على الهاتف.
          </p>
        </div>

        <nav className={cn("space-y-2", mobile && "grid grid-cols-2 gap-2 space-y-0")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
                  mobile
                    ? active
                      ? "bg-[#15445a] text-white shadow-[0_12px_24px_rgba(21,68,90,0.22)]"
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
          النظام يدير المعلمين والتقييمات والأدلة وعناصر المدير والتقارير ضمن تجربة تشغيل متكاملة وحديثة.
        </div>
      ) : null}
    </div>
  );
}

function MobileBottomBar({
  pathname,
  onMenuOpen,
}: {
  pathname: string;
  onMenuOpen: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto max-w-md rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,249,250,0.95)_100%)] px-2 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
        <div className="grid grid-cols-5 gap-1">
          {mobilePrimaryNav.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold transition-all",
                  active ? "bg-[#15445a] text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.shortLabel ?? item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={onMenuOpen}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <Grid2x2 className="h-4 w-4" />
            <span>المزيد</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="إغلاق القائمة"
        className="absolute inset-0 bg-[#0f2029]/42 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-x-3 top-3 bottom-3 overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,#f7fbfb_0%,#fffaf3_100%)] shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-primary">تنقل المنصة</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">الوصول السريع</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl border border-slate-200 bg-white text-slate-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(100%-80px)] flex-col justify-between overflow-y-auto px-4 py-4">
          <Sidebar pathname={pathname} mobile onNavigate={onClose} />

          <Button
            variant="secondary"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-6 rounded-2xl border border-[#d8e3e7] bg-white text-[#15445a] shadow-sm hover:bg-[#f4f8fa]"
          >
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
