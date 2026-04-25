import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SupportTicketForm } from "@/components/support/support-ticket-form";
import { getSupportTicketsData } from "@/lib/portal-data";
import { requireSession } from "@/lib/session";

export default async function SupportPage() {
  const session = await requireSession();
  const data = await getSupportTicketsData(session.user.id);

  return (
    <DashboardShell>
      <section className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-primary">الدعم الفني</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">تواصل مع فريق الدعم</h1>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">
            أرسل مشكلتك أو استفسارك وسيصل مباشرة إلى لوحة المشرف العام مع متابعة حالة المعالجة.
          </p>
        </div>

        <SupportTicketForm />

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-slate-900">تذاكرك السابقة</h2>
          <div className="mt-5 grid gap-4">
            {data.tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-slate-900">{ticket.subject}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{ticket.category}</span>
                  <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#22527a]">{ticket.status}</span>
                </div>
                <p className="mt-3 text-sm leading-8 text-slate-700">{ticket.description}</p>
                <div className="mt-3 space-y-2">
                  {ticket.replies.map((reply) => (
                    <div key={reply.id} className={`rounded-2xl px-4 py-3 text-sm leading-8 ${reply.isAdmin ? "bg-[#eef6ff]" : "bg-white"}`}>
                      <p className="font-bold text-slate-900">{reply.authorName}</p>
                      <p>{reply.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
