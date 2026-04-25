import { DatabaseAlert } from "@/components/dashboard/database-alert";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsForm } from "@/components/settings/settings-form";
import { getSettingsData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireSession();
  const data = await getSettingsData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-5 sm:space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(245,248,249,0.96)_55%,rgba(252,246,238,0.98)_100%)] p-5 shadow-soft sm:p-6">
          <h1 className="section-title text-2xl font-black sm:text-3xl">الإعدادات</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            حدّث بيانات المدرسة وهوية الطباعة الرسمية وروابط الشعار والتوقيع والختم وكلمة المرور من واجهة أوضح
            وأنسب للجوال.
          </p>
        </div>

        <SettingsForm user={data.user} settings={data.settings} />
      </section>
    </DashboardShell>
  );
}
