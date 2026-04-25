import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { externalEvaluationEvidenceSchema } from "@/lib/validations/external-evaluation";

type Params = { params: Promise<{ indicatorCode: string }> };

export async function POST(request: Request, context: Params) {
  try {
    const session = await requireApiSession();
    const { indicatorCode } = await context.params;
    const body = await request.json();
    const parsed = externalEvaluationEvidenceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات الشاهد غير صحيحة." }, { status: 400 });
    }

    const progress = await prisma.externalEvaluationIndicatorProgress.findUnique({
      where: {
        userId_indicatorCode: {
          userId: session.user.id,
          indicatorCode,
        },
      },
      select: { id: true },
    });

    if (!progress) {
      return NextResponse.json({ message: "لم يتم العثور على المؤشر." }, { status: 404 });
    }

    const evidence = await prisma.externalEvaluationIndicatorEvidence.create({
      data: {
        progressId: progress.id,
        title: parsed.data.title,
        fileUrl: parsed.data.fileUrl || null,
        linkUrl: parsed.data.linkUrl || null,
        note: parsed.data.note || null,
      },
    });

    return NextResponse.json({ evidence }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "تعذر حفظ شاهد المؤشر.");
  }
}
