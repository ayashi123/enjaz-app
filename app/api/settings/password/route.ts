import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { changePasswordSchema } from "@/lib/validations/settings";

export async function PATCH(request: Request) {
  try {
    const session = await requireApiSession();
    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات تغيير كلمة المرور غير مكتملة." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ message: "لم يتم العثور على الحساب." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "كلمة المرور الحالية أو المؤقتة غير صحيحة." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "تعذر تغيير كلمة المرور.");
  }
}
