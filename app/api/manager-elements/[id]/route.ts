import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { managerElementSchema } from "@/lib/validations/manager-element";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Params) {
  try {
    const session = await requireApiSession();
    const { id } = await context.params;
    const body = await request.json();
    const parsed = managerElementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات غير صحيحة." }, { status: 400 });
    }

    const updated = await prisma.managerElementProgress.updateMany({
      where: { id, userId: session.user.id },
      data: {
        elementTitle: parsed.data.elementTitle,
        isDone: parsed.data.isDone,
        notes: parsed.data.notes || null,
      },
    });

    return NextResponse.json({ updated });
  } catch (error) {
    return handleApiError(error, "تعذر تحديث عنصر المدير.");
  }
}
