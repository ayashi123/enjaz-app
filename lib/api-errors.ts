import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { UnauthorizedApiError } from "@/lib/session";

export function handleApiError(error: unknown, fallbackMessage = "حدث خطأ غير متوقع.") {
  if (error instanceof UnauthorizedApiError) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      { message: "تعذر الاتصال بقاعدة البيانات. تحقق من DATABASE_URL أو من تشغيل PostgreSQL." },
      { status: 503 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "يوجد سجل بالقيمة الفريدة نفسها بالفعل." }, { status: 409 });
    }

    if (error.code === "P2003") {
      return NextResponse.json({ message: "تعذر إتمام العملية بسبب مرجع مرتبط غير صالح." }, { status: 400 });
    }

    if (error.code === "P2025") {
      return NextResponse.json({ message: "السجل المطلوب غير موجود أو تم حذفه." }, { status: 404 });
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return NextResponse.json({ message: "حدث خلل غير متوقع أثناء التواصل مع قاعدة البيانات." }, { status: 500 });
  }

  if (error instanceof Error) {
    return NextResponse.json({ message: error.message || fallbackMessage }, { status: 500 });
  }

  return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}
