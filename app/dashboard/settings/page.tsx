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
      <section className="space-y-6">
        {!data.isDatabaseReady ? <DatabaseAlert /> : null}

        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,248,249,0.94)_55%,rgba(250,246,238,0.98)_100%)] p-6 shadow-soft">
          <h1 className="section-title text-3xl font-bold">الإعدادات</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            حدّث بيانات المدرسة، وهوية الطباعة الرسمية، وروابط الشعار والتوقيع والختم، بحيث تنعكس تلقائيًا
            في التقارير والمخرجات المطبوعة.
          </p>
        </div>

        <SettingsForm user={data.user} settings={data.settings} />
      </section>
    </DashboardShell>
  );
}
