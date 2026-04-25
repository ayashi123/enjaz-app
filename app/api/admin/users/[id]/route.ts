import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireAdminApiSession } from "@/lib/session";
import { adminUserUpdateSchema } from "@/lib/validations/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdminApiSession();
    const { id } = await params;
    const body = await request.json();
    const parsed = adminUserUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات التحديث غير مكتملة." }, { status: 400 });
    }

    if (id === session.user.id) {
      return NextResponse.json({ message: "لا يمكن تعديل صلاحيات أو حالة حسابك الحالي من هذه الصفحة." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        role: parsed.data.role,
        isActive: parsed.data.isActive,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error, "تعذر تحديث بيانات الحساب.");
  }
}
