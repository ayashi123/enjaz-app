import { AdminUsersManager } from "@/components/admin/admin-users-manager";
import { getAdminUsersData } from "@/lib/portal-data";
import { requireAdminSession } from "@/lib/session";

export default async function AdminUsersPage() {
  const session = await requireAdminSession();
  const data = await getAdminUsersData();

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-primary">إدارة الحسابات</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">صلاحيات المستخدمين وحالة التفعيل</h1>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
          من هنا يمكنك إدارة دور كل حساب داخل المنصة بين مشرف عام ومدير مدرسة، مع التحكم في التفعيل والإيقاف للحسابات.
        </p>
      </div>

      <AdminUsersManager users={data.users} currentUserId={session.user.id} />
    </section>
  );
}
