import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { teacherSchema } from "@/lib/validations/teacher";

type Params = {
  params: Promise<{ teacherId: string }>;
};

export async function PATCH(request: Request, context: Params) {
  try {
    const session = await requireApiSession();
    const { teacherId } = await context.params;
    const body = await request.json();
    const parsed = teacherSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "البيانات المدخلة غير مكتملة." }, { status: 400 });
    }

    const teacher = await prisma.teacher.findFirst({
      where: {
        id: teacherId,
        userId: session.user.id,
      },
    });

    if (!teacher) {
      return NextResponse.json({ message: "تعذر العثور على المعلم." }, { status: 404 });
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        fullName: parsed.data.fullName,
        nationalId: parsed.data.nationalId || null,
        specialization: parsed.data.specialization || null,
        subject: parsed.data.subject || null,
        className: parsed.data.className || null,
      },
    });

    return NextResponse.json({ teacher: updatedTeacher });
  } catch (error) {
    return handleApiError(error, "تعذر تحديث بيانات المعلم.");
  }
}

export async function DELETE(_: Request, context: Params) {
  try {
    const session = await requireApiSession();
    const { teacherId } = await context.params;

    const teacher = await prisma.teacher.findFirst({
      where: {
        id: teacherId,
        userId: session.user.id,
      },
    });

    if (!teacher) {
      return NextResponse.json({ message: "تعذر العثور على المعلم." }, { status: 404 });
    }

    await prisma.teacher.delete({
      where: { id: teacherId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "تعذر حذف المعلم.");
  }
}
