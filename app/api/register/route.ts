import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "تعذر التحقق من البيانات المدخلة.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return NextResponse.json({ message: "البريد الإلكتروني مسجل مسبقًا." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      passwordHash,
      schoolName: parsed.data.schoolName,
      educationOffice: parsed.data.educationOffice,
      academicYear: parsed.data.academicYear,
      schoolSettings: {
        create: {
          printHeader: `مدرسة ${parsed.data.schoolName}`,
        },
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });

  return NextResponse.json(
    {
      message: "تم إنشاء الحساب بنجاح.",
      user,
    },
    { status: 201 },
  );
}
