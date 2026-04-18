import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { teacherSchema } from "@/lib/validations/teacher";

export async function POST(request: Request) {
  try {
    const session = await requireApiSession();
    const body = (await request.json()) as { teachers?: unknown[] };
    const teachers = Array.isArray(body.teachers) ? body.teachers : [];

    const validated = teachers
      .map((teacher: unknown) => teacherSchema.safeParse(teacher))
      .filter((item) => item.success)
      .map((item) => item.data);

    if (validated.length === 0) {
      return NextResponse.json(
        { message: "لا توجد بيانات قابلة للاستيراد. تأكد من وجود عمود الاسم وأن الصفوف غير فارغة." },
        { status: 400 },
      );
    }

    await prisma.teacher.createMany({
      data: validated.map((teacher) => ({
        userId: session.user.id,
        fullName: teacher.fullName,
        nationalId: teacher.nationalId || null,
        specialization: teacher.specialization || null,
        subject: teacher.subject || null,
        className: teacher.className || null,
      })),
    });

    return NextResponse.json({
      success: true,
      count: validated.length,
      message: `تم استيراد ${validated.length} معلم/معلمة بنجاح.`,
    });
  } catch (error) {
    return handleApiError(error, "تعذر استيراد بيانات المعلمين.");
  }
}
