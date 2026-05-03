import { NextResponse } from "next/server";
import { queryOne } from "@/db";
import { verifyPassword, generateToken } from "@/db/auth";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "phone and password are required" }, { status: 400 });
    }

    const user: any = await queryOne(
      "SELECT id, name, phone, email, password_hash FROM users WHERE phone = ?",
      [phone]
    );

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
    }

    const token = generateToken(user.id);

    return NextResponse.json({
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email },
      token,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
