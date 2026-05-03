import { NextResponse } from "next/server";
import { queryAll } from "@/db";
import { getUserFromRequest } from "@/db/auth";

// GET /api/trip-requests/proposals?trip_id=X
// Returns ALL proposals (pending, confirmed, expired, rejected) for a specific trip
export async function GET(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const tripId = url.searchParams.get("trip_id");
    if (!tripId) return NextResponse.json({ error: "trip_id is required" }, { status: 400 });

    const proposals = await queryAll(`SELECT
        mp.*,
        other_trip.area AS other_area,
        other_trip.flight_time AS other_flight_time,
        other_trip.pax_count AS other_pax,
        other_user.name AS other_name,
        CASE WHEN my_trip.id = mp.trip_request_a THEN 'a' ELSE 'b' END AS my_side,
        CASE WHEN my_trip.id = mp.trip_request_a THEN mp.user_a_response ELSE mp.user_b_response END AS my_response,
        CASE WHEN my_trip.id = mp.trip_request_a THEN mp.user_b_response ELSE mp.user_a_response END AS other_response
      FROM match_proposals mp
      JOIN trip_requests my_trip ON (
        (mp.trip_request_a = my_trip.id OR mp.trip_request_b = my_trip.id)
        AND my_trip.user_id = ?
        AND my_trip.id = ?
      )
      JOIN trip_requests other_trip ON (
        other_trip.id = CASE WHEN my_trip.id = mp.trip_request_a THEN mp.trip_request_b ELSE mp.trip_request_a END
      )
      JOIN users other_user ON other_user.id = other_trip.user_id
      ORDER BY
        CASE mp.status
          WHEN 'confirmed' THEN 1
          WHEN 'pending' THEN 2
          WHEN 'expired' THEN 3
          WHEN 'rejected' THEN 4
        END,
        mp.proposed_at DESC`,
      [auth.userId, parseInt(tripId)]
    );

    return NextResponse.json({ proposals });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
