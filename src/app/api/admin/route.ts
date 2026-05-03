import { NextResponse } from "next/server";
import { queryAll } from "@/db";

// GET /api/admin?table=users
// Simple admin endpoint to view table contents
export async function GET(request: Request) {
  const url = new URL(request.url);
  const table = url.searchParams.get("table");
  const secret = url.searchParams.get("key");

  // Simple auth — change this secret
  if (secret !== "billkill-admin-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!table) {
      // List all tables
      const tables = await queryAll("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
      return NextResponse.json({ tables: tables.map((t: any) => t.name) });
    }

    // Sanitize table name to prevent SQL injection
    const safeName = table.replace(/[^a-zA-Z0-9_]/g, "");
    const rows = await queryAll(`SELECT * FROM ${safeName} ORDER BY rowid DESC LIMIT 100`);
    const count = await queryAll(`SELECT COUNT(*) as total FROM ${safeName}`);

    return NextResponse.json({ table: safeName, total: count[0]?.total, rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
