import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "منصة إنجاز التعليمية",
    timestamp: new Date().toISOString(),
  });
}
