import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireApiSession } from "@/lib/session";
import { settingsSchema } from "@/lib/validations/settings";

export async function PATCH(request: Request) {
  try {
    const session = await requireApiSession();
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "بيانات الإعدادات غير مكتملة." }, { status: 400 });
    }

    const settings = await prisma.schoolSettings.upsert({
      where: { userId: session.user.id },
      update: {
        schoolLogo: parsed.data.schoolLogo || null,
        managerSignatureImage: parsed.data.managerSignatureImage || null,
        officialStampImage: parsed.data.officialStampImage || null,
        printHeader: parsed.data.printHeader || null,
      },
      create: {
        userId: session.user.id,
        schoolLogo: parsed.data.schoolLogo || null,
        managerSignatureImage: parsed.data.managerSignatureImage || null,
        officialStampImage: parsed.data.officialStampImage || null,
        printHeader: parsed.data.printHeader || null,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error, "تعذر حفظ الإعدادات.");
  }
}
