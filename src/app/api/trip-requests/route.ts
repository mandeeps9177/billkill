import { NextResponse } from "next/server";
import { queryOne, queryAll, execute, persistDb } from "@/db";
import { getUserFromRequest } from "@/db/auth";

export async function POST(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { direction, area, terminal, travel_date, flight_time, flight_number, pax_count, bag_count } =
      await request.json();

    if (!direction || !area || !terminal || !travel_date || !flight_time) {
      return NextResponse.json(
        { error: "direction, area, terminal, travel_date, and flight_time are required" },
        { status: 400 }
      );
    }

    if (!["to", "from"].includes(direction)) {
      return NextResponse.json({ error: "direction must be 'to' or 'from'" }, { status: 400 });
    }

    const { lastId } = await execute(`INSERT INTO trip_requests (user_id, direction, area, terminal, travel_date, flight_time, flight_number, pax_count, bag_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [auth.userId, direction, area, terminal, travel_date, flight_time, flight_number || null, pax_count || 1, bag_count || 0]
    );
    persistDb();

    const trip = await queryOne("SELECT * FROM trip_requests WHERE id = ?", [lastId]);

    return NextResponse.json({ trip }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trips = await queryAll("SELECT * FROM trip_requests WHERE user_id = ? ORDER BY created_at DESC",
      [auth.userId]
    );

    return NextResponse.json({ trips });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
