import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "connected",
      database: "postgresql",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "disconnected",
        message: "تعذر الاتصال بقاعدة البيانات الحالية.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
