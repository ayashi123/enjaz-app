"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

type SupportTicketRecord = {
  id: string;
  subject: string;
  category: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
  updatedAt: Date;
  user: {
    fullName: string;
    email: string;
    schoolName: string;
  };
  replies: Array<{
    id: string;
    authorId: string;
    authorName: string;
    isAdmin: boolean;
    message: string;
    createdAt: Date;
  }>;
};

export function AdminSupportManager({ tickets }: { tickets: SupportTicketRecord[] }) {
  const [items, setItems] = useState(tickets);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function sendReply(ticketId: string, status: SupportTicketRecord["status"]) {
    const messageBody = drafts[ticketId]?.trim();
    if (!messageBody) return;

    startTransition(async () => {
      setMessage(null);
      const response = await fetch(`/api/admin/support/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageBody, status }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result.message || "تعذر إرسال الرد.");
        return;
      }

      setItems((current) =>
        current.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status: result.ticket.status, replies: result.ticket.replies, updatedAt: result.ticket.updatedAt }
            : ticket,
        ),
      );
      setDrafts((current) => ({ ...current, [ticketId]: "" }));
      setMessage("تم إرسال الرد وتحديث التذكرة.");
    });
  }

  return (
    <div className="space-y-4">
      {message ? <div className="rounded-2xl border border-[#d7e6db] bg-[#f6fbf7] px-4 py-3 text-sm font-medium text-[#15445a]">{message}</div> : null}
      {items.map((ticket) => (
        <div key={ticket.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-900">{ticket.subject}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{ticket.category}</span>
            <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#22527a]">{getStatusLabel(ticket.status)}</span>
            <span className="rounded-full bg-[#fff4ea] px-3 py-1 text-xs font-bold text-[#9a5518]">{getPriorityLabel(ticket.priority)}</span>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            <p>المشترك: <span className="font-semibold text-slate-900">{ticket.user.fullName}</span></p>
            <p>البريد: <span className="font-semibold text-slate-900">{ticket.user.email}</span></p>
            <p>المدرسة: <span className="font-semibold text-slate-900">{ticket.user.schoolName}</span></p>
            <p>آخر تحديث: <span className="font-semibold text-slate-900">{new Date(ticket.updatedAt).toLocaleDateString("ar-SA")}</span></p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-8 text-slate-700">{ticket.description}</div>

          <div className="mt-4 space-y-3">
            {ticket.replies.map((reply) => (
              <div key={reply.id} className={`rounded-2xl px-4 py-3 text-sm leading-8 ${reply.isAdmin ? "bg-[#eef6ff]" : "bg-[#f8fafc]"}`}>
                <p className="font-bold text-slate-900">{reply.authorName}</p>
                <p className="mt-1 text-slate-700">{reply.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            <textarea
              className="min-h-[110px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary"
              placeholder="اكتب رد الدعم الفني هنا..."
              value={drafts[ticket.id] || ""}
              onChange={(event) => setDrafts((current) => ({ ...current, [ticket.id]: event.target.value }))}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={isPending} onClick={() => sendReply(ticket.id, "IN_PROGRESS")} className="rounded-2xl">
                رد وقيد المعالجة
              </Button>
              <Button type="button" variant="secondary" disabled={isPending} onClick={() => sendReply(ticket.id, "RESOLVED")} className="rounded-2xl">
                رد وتم الحل
              </Button>
              <Button type="button" variant="secondary" disabled={isPending} onClick={() => sendReply(ticket.id, "CLOSED")} className="rounded-2xl">
                إغلاق التذكرة
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusLabel(status: SupportTicketRecord["status"]) {
  switch (status) {
    case "IN_PROGRESS":
      return "قيد المعالجة";
    case "RESOLVED":
      return "تم الحل";
    case "CLOSED":
      return "مغلق";
    default:
      return "جديد";
  }
}

function getPriorityLabel(priority: SupportTicketRecord["priority"]) {
  switch (priority) {
    case "HIGH":
      return "عالية";
    case "LOW":
      return "منخفضة";
    default:
      return "متوسطة";
  }
}
