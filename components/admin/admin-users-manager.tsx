"use client";

import { useState, useTransition } from "react";
import { KeyRound, Trash2, UserRoundCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminUserRecord = {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  educationOffice: string;
  academicYear: string;
  role: "SUPER_ADMIN" | "SCHOOL_MANAGER";
  isActive: boolean;
  subscriptionStatus: "ACTIVE" | "TRIAL" | "EXPIRED" | "SUSPENDED";
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  createdAt: Date;
  _count: {
    teachers: number;
    evaluations: number;
    evidences: number;
  };
};

export function AdminUsersManager({
  users,
  currentUserId,
}: {
  users: AdminUserRecord[];
  currentUserId: string;
}) {
  const [items, setItems] = useState(users);
  const [message, setMessage] = useState<string | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateUser(
    id: string,
    payload: {
      role: "SUPER_ADMIN" | "SCHOOL_MANAGER";
      isActive: boolean;
      subscriptionStatus: "ACTIVE" | "TRIAL" | "EXPIRED" | "SUSPENDED";
      subscriptionEnd: string | null;
    },
  ) {
    startTransition(async () => {
      setMessage(null);
      setTemporaryPassword(null);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(result.message || "تعذر تحديث الحساب.");
        return;
      }

      setItems((current) =>
        current.map((user) =>
          user.id === id
            ? {
                ...user,
                role: result.user.role,
                isActive: result.user.isActive,
                subscriptionStatus: result.user.subscriptionStatus,
                subscriptionEnd: result.user.subscriptionEnd ? new Date(result.user.subscriptionEnd) : null,
              }
            : user,
        ),
      );
      setMessage("تم تحديث الحساب بنجاح.");
    });
  }

  function resetPassword(id: string) {
    startTransition(async () => {
      setMessage(null);
      setTemporaryPassword(null);

      const response = await fetch(`/api/admin/users/${id}/reset-password`, {
        method: "POST",
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result.message || "تعذر إعادة تعيين كلمة المرور.");
        return;
      }

      setTemporaryPassword(`كلمة المرور المؤقتة للحساب: ${result.temporaryPassword}`);
      setMessage("تم إنشاء كلمة مرور مؤقتة جديدة.");
    });
  }

  function deleteUser(id: string) {
    const confirmed = window.confirm("سيتم حذف الحساب وكل بياناته نهائيًا. هل تريد المتابعة؟");
    if (!confirmed) return;

    startTransition(async () => {
      setMessage(null);
      setTemporaryPassword(null);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result.message || "تعذر حذف الحساب.");
        return;
      }

      setItems((current) => current.filter((user) => user.id !== id));
      setMessage("تم حذف الحساب نهائيًا.");
    });
  }

  return (
    <div className="space-y-4">
      {message ? <div className="rounded-2xl border border-[#d7e6db] bg-[#f6fbf7] px-4 py-3 text-sm font-medium text-[#15445a]">{message}</div> : null}
      {temporaryPassword ? <div className="rounded-2xl border border-[#e7ddc7] bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#7a4b12]">{temporaryPassword}</div> : null}

      {items.map((user) => {
        const isSelf = user.id === currentUserId;
        const subscriptionEndValue = user.subscriptionEnd ? new Date(user.subscriptionEnd).toISOString().slice(0, 10) : "";

        return (
          <div key={user.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{user.fullName}</h3>
                  <span className="rounded-full bg-[#edf6f0] px-3 py-1 text-xs font-bold text-[#1f6a43]">
                    {user.role === "SUPER_ADMIN" ? "مشرف عام" : "مدير مدرسة"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.isActive ? "bg-[#eef6ff] text-[#22527a]" : "bg-[#fff2f2] text-[#9b2c2c]"}`}>
                    {user.isActive ? "نشط" : "موقوف"}
                  </span>
                  <span className="rounded-full bg-[#fff4ea] px-3 py-1 text-xs font-bold text-[#9a5518]">
                    {getSubscriptionLabel(user.subscriptionStatus)}
                  </span>
                  {isSelf ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">حسابك الحالي</span> : null}
                </div>

                <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p>البريد الإلكتروني: <span className="font-semibold text-slate-900">{user.email}</span></p>
                  <p>المدرسة: <span className="font-semibold text-slate-900">{user.schoolName}</span></p>
                  <p>الإدارة التعليمية: <span className="font-semibold text-slate-900">{user.educationOffice}</span></p>
                  <p>العام الدراسي: <span className="font-semibold text-slate-900">{user.academicYear}</span></p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">المعلمون: {user._count.teachers}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">التقييمات: {user._count.evaluations}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">الشواهد: {user._count.evidences}</span>
                </div>
              </div>

              <div className="grid gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 sm:min-w-[320px]">
                <label className="text-sm font-semibold text-slate-700">الدور</label>
                <select
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
                  value={user.role}
                  disabled={isSelf || isPending}
                  onChange={(event) =>
                    updateUser(user.id, {
                      role: event.target.value as "SUPER_ADMIN" | "SCHOOL_MANAGER",
                      isActive: user.isActive,
                      subscriptionStatus: user.subscriptionStatus,
                      subscriptionEnd: subscriptionEndValue || null,
                    })
                  }
                >
                  <option value="SCHOOL_MANAGER">مدير مدرسة</option>
                  <option value="SUPER_ADMIN">مشرف عام</option>
                </select>

                <label className="text-sm font-semibold text-slate-700">حالة الاشتراك</label>
                <select
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
                  value={user.subscriptionStatus}
                  disabled={isPending}
                  onChange={(event) =>
                    updateUser(user.id, {
                      role: user.role,
                      isActive: user.isActive,
                      subscriptionStatus: event.target.value as AdminUserRecord["subscriptionStatus"],
                      subscriptionEnd: subscriptionEndValue || null,
                    })
                  }
                >
                  <option value="ACTIVE">نشط</option>
                  <option value="TRIAL">تجريبي</option>
                  <option value="EXPIRED">منتهي</option>
                  <option value="SUSPENDED">معلق</option>
                </select>

                <label className="text-sm font-semibold text-slate-700">تاريخ انتهاء الاشتراك</label>
                <input
                  type="date"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
                  defaultValue={subscriptionEndValue}
                  disabled={isPending}
                  onBlur={(event) =>
                    updateUser(user.id, {
                      role: user.role,
                      isActive: user.isActive,
                      subscriptionStatus: user.subscriptionStatus,
                      subscriptionEnd: event.target.value || null,
                    })
                  }
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={isSelf || isPending || user.isActive}
                    onClick={() =>
                      updateUser(user.id, {
                        role: user.role,
                        isActive: true,
                        subscriptionStatus: user.subscriptionStatus,
                        subscriptionEnd: subscriptionEndValue || null,
                      })
                    }
                    className="rounded-2xl bg-[#15445a] text-white hover:bg-[#123949]"
                  >
                    <UserRoundCheck className="ml-2 h-4 w-4" />
                    تفعيل
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isSelf || isPending || !user.isActive}
                    onClick={() =>
                      updateUser(user.id, {
                        role: user.role,
                        isActive: false,
                        subscriptionStatus: "SUSPENDED",
                        subscriptionEnd: subscriptionEndValue || null,
                      })
                    }
                    className="rounded-2xl border border-[#ead8d8] bg-white text-[#8f2f2f] hover:bg-[#fff7f7]"
                  >
                    <UserX className="ml-2 h-4 w-4" />
                    إيقاف
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" disabled={isPending} onClick={() => resetPassword(user.id)} className="rounded-2xl">
                    <KeyRound className="ml-2 h-4 w-4" />
                    إعادة تعيين كلمة المرور
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isSelf || isPending}
                    onClick={() => deleteUser(user.id)}
                    className="rounded-2xl border border-[#ead8d8] bg-white text-[#8f2f2f] hover:bg-[#fff7f7]"
                  >
                    <Trash2 className="ml-2 h-4 w-4" />
                    حذف الحساب
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getSubscriptionLabel(status: AdminUserRecord["subscriptionStatus"]) {
  switch (status) {
    case "TRIAL":
      return "تجريبي";
    case "EXPIRED":
      return "منتهي";
    case "SUSPENDED":
      return "معلق";
    default:
      return "نشط";
  }
}
