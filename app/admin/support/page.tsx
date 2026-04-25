import { AdminSupportManager } from "@/components/admin/admin-support-manager";
import { getSupportTicketsData } from "@/lib/portal-data";
import { requireAdminSession } from "@/lib/session";

export default async function AdminSupportPage() {
  await requireAdminSession();
  const data = await getSupportTicketsData();

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-primary">الدعم الفني</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">تذاكر المشتركين والمتابعة</h1>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
          من هنا يتابع المشرف العام جميع تذاكر الدعم الفني، ويرد عليها، ويحدّث حالتها حتى الإغلاق.
        </p>
      </div>

      <AdminSupportManager tickets={data.tickets} />
    </section>
  );
}
