import { NextResponse } from "next/server";
import { queryOne } from "@/db";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: "phone is required" }, { status: 400 });
    const user = await queryOne("SELECT id, name FROM users WHERE phone = ?", [phone]);
    return NextResponse.json({ exists: !!user, name: user?.name || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
