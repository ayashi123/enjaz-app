import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { calculateWeightedScore, getPerformanceLabel } from "@/lib/evaluation-engine";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { evaluationSchema } from "@/lib/validations/evaluation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Params) {
  try {
    const session = await requireApiSession();
    const { id } = await context.params;
    const body = await request.json();
    const parsed = evaluationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات التقييم غير مكتملة." }, { status: 400 });
    }

    const finalScoreOutOfFive = calculateWeightedScore(parsed.data.elements);
    const performanceLabel = getPerformanceLabel(finalScoreOutOfFive);

    const evaluation = await prisma.teacherEvaluation.updateMany({
      where: { id, userId: session.user.id },
      data: {
        teacherId: parsed.data.teacherId,
        followupNo: parsed.data.followupNo,
        visitDate: new Date(parsed.data.visitDate),
        lessonTitle: parsed.data.lessonTitle,
        finalScoreOutOfFive,
        performanceLabel,
        strengths: parsed.data.strengths.join("\n"),
        developmentPoints: parsed.data.developmentPoints.join("\n"),
        aiFeedback: parsed.data.aiFeedback,
        managerName: parsed.data.managerName,
        teacherSignature: parsed.data.teacherSignature || null,
        managerSignature: parsed.data.managerSignature || null,
        rubricJson: body.rubricJson || parsed.data.elements,
      },
    });

    if (evaluation.count === 0) {
      return NextResponse.json({ message: "التقييم المطلوب غير موجود." }, { status: 404 });
    }

    return NextResponse.json({ evaluation: { id } });
  } catch (error) {
    return handleApiError(error, "تعذر تحديث التقييم.");
  }
}
