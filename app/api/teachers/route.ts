import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { teacherSchema } from "@/lib/validations/teacher";

export async function POST(request: Request) {
  try {
    const session = await requireApiSession();
    const body = await request.json();
    const parsed = teacherSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "البيانات المدخلة غير مكتملة." }, { status: 400 });
    }

    const teacher = await prisma.teacher.create({
      data: {
        userId: session.user.id,
        fullName: parsed.data.fullName,
        nationalId: parsed.data.nationalId || null,
        specialization: parsed.data.specialization || null,
        subject: parsed.data.subject || null,
        className: parsed.data.className || null,
      },
    });

    return NextResponse.json({ teacher }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "تعذر إنشاء ملف المعلم.");
  }
}
