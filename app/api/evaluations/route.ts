import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { calculateWeightedScore, getPerformanceLabel } from "@/lib/evaluation-engine";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { evaluationSchema } from "@/lib/validations/evaluation";

export async function POST(request: Request) {
  try {
    const session = await requireApiSession();
    const body = await request.json();
    const parsed = evaluationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات التقييم غير مكتملة." }, { status: 400 });
    }

    const finalScoreOutOfFive = calculateWeightedScore(parsed.data.elements);
    const performanceLabel = getPerformanceLabel(finalScoreOutOfFive);

    const evaluation = await prisma.teacherEvaluation.create({
      data: {
        userId: session.user.id,
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

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "تعذر حفظ التقييم.");
  }
}
