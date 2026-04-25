import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireAdminApiSession } from "@/lib/session";
import { supportReplySchema } from "@/lib/validations/support";

export async function POST(request: Request, { params }: { params: Promise<{ ticketId: string }> }) {
  try {
    const session = await requireAdminApiSession();
    const { ticketId } = await params;
    const body = await request.json();
    const parsed = supportReplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات الرد غير مكتملة." }, { status: 400 });
    }

    await prisma.supportTicketReply.create({
      data: {
        ticketId,
        authorId: session.user.id,
        authorName: session.user.name || "المشرف العام",
        isAdmin: true,
        message: parsed.data.message,
      },
    });

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: parsed.data.status || "IN_PROGRESS",
      },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    return handleApiError(error, "تعذر إرسال رد الدعم الفني.");
  }
}
