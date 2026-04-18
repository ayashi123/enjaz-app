import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { requireApiSession } from "@/lib/session";
import { uploadFiles } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const session = await requireApiSession();
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ message: "لم يتم اختيار ملفات للرفع." }, { status: 400 });
    }

    const result = await uploadFiles(files, session.user.id, "evidence");

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error, "تعذر رفع الملفات.");
  }
}
