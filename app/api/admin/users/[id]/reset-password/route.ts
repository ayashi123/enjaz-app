import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-errors";
import { prisma } from "@/lib/db";
import { requireAdminApiSession } from "@/lib/session";

function generateTemporaryPassword() {
  return `Enjaz-${Math.random().toString(36).slice(2, 8)}-${new Date().getFullYear()}`;
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminApiSession();
    const { id } = await params;
    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    await prisma.user.update({
      where: { id },
      data: {
        passwordHash,
      },
    });

    return NextResponse.json({ temporaryPassword });
  } catch (error) {
    return handleApiError(error, "تعذر إعادة تعيين كلمة المرور.");
  }
}
