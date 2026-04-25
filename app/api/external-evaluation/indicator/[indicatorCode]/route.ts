import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { externalEvaluationIndicatorSchema } from "@/lib/validations/external-evaluation";

type Params = { params: Promise<{ indicatorCode: string }> };

export async function PATCH(request: Request, context: Params) {
  try {
    const session = await requireApiSession();
    const { indicatorCode } = await context.params;
    const body = await request.json();
    const parsed = externalEvaluationIndicatorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات المؤشر غير مكتملة." }, { status: 400 });
    }

    const indicator = await prisma.externalEvaluationIndicatorProgress.upsert({
      where: {
        userId_indicatorCode: {
          userId: session.user.id,
          indicatorCode,
        },
      },
      update: {
        domainId: parsed.data.domainId,
        domainTitle: parsed.data.domainTitle,
        standardId: parsed.data.standardId,
        standardTitle: parsed.data.standardTitle,
        indicatorText: parsed.data.indicatorText,
        status: parsed.data.status,
        notes: parsed.data.notes || null,
      },
      create: {
        userId: session.user.id,
        domainId: parsed.data.domainId,
        domainTitle: parsed.data.domainTitle,
        standardId: parsed.data.standardId,
        standardTitle: parsed.data.standardTitle,
        indicatorCode: parsed.data.indicatorCode,
        indicatorText: parsed.data.indicatorText,
        status: parsed.data.status,
        notes: parsed.data.notes || null,
      },
    });

    return NextResponse.json({ indicator });
  } catch (error) {
    return handleApiError(error, "تعذر تحديث المؤشر.");
  }
}
