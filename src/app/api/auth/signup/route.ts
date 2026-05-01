import { NextResponse } from "next/server";
import { getDb, queryOne, execute, persistDb } from "@/db";
import { hashPassword, generateToken } from "@/db/auth";

export async function POST(request: Request) {
  try {
    const { name, phone, email, password } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: "name, phone, and password are required" }, { status: 400 });
    }

    const db = await getDb();

    const existing = queryOne(db, "SELECT id FROM users WHERE phone = ?", [phone]);
    if (existing) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
    }

    const { lastId } = execute(
      db,
      "INSERT INTO users (name, phone, email, password_hash) VALUES (?, ?, ?, ?)",
      [name, phone, email || null, hashPassword(password)]
    );
    persistDb();

    const token = generateToken(lastId);

    return NextResponse.json({ user: { id: lastId, name, phone, email }, token }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
