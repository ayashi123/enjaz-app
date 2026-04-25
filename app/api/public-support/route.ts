import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { publicSupportTicketSchema } from "@/lib/validations/support";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = publicSupportTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات الطلب غير مكتملة." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, isActive: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "لا يوجد حساب مشترك بهذا البريد الإلكتروني. تحقق من البريد أو أنشئ حسابًا جديدًا." },
        { status: 404 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "هذا الحساب غير مفعل حاليًا. تواصل مع الدعم الفني لإعادة التفعيل." },
        { status: 403 },
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject: parsed.data.subject,
        category: "الدخول والحساب",
        description: parsed.data.description,
        priority: parsed.data.priority,
      },
    });

    return NextResponse.json({
      ticketId: ticket.id,
      message: "تم إرسال طلب الدعم بنجاح. سيظهر لفريق المتابعة داخل لوحة المشرف العام.",
    });
  } catch (error) {
    return handleApiError(error, "تعذر إرسال طلب الدعم الفني.");
  }
}
