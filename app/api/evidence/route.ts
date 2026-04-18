import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { evidenceSchema } from "@/lib/validations/evidence";

export async function POST(request: Request) {
  try {
    const session = await requireApiSession();
    const body = await request.json();
    const parsed = evidenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات الشاهد غير مكتملة." }, { status: 400 });
    }

    const evidence = await prisma.evidence.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        relatedType: parsed.data.relatedType,
        relatedRef: parsed.data.relatedRef || null,
        evidenceType: parsed.data.evidenceType,
        status: parsed.data.status,
        evidenceDate: new Date(parsed.data.evidenceDate),
        notes: parsed.data.notes || null,
        attachments: parsed.data.attachments,
      },
    });

    return NextResponse.json({ evidence }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "تعذر حفظ الشاهد.");
  }
}
