import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { supportTicketSchema } from "@/lib/validations/support";

export async function POST(request: Request) {
  try {
    const session = await requireApiSession();
    const body = await request.json();
    const parsed = supportTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات التذكرة غير مكتملة." }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject: parsed.data.subject,
        category: parsed.data.category,
        description: parsed.data.description,
        priority: parsed.data.priority,
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    return handleApiError(error, "تعذر إرسال تذكرة الدعم.");
  }
}
