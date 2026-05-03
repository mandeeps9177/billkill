import { NextResponse } from "next/server";
import { queryOne, queryAll, execute, persistDb } from "@/db";
import { getUserFromRequest } from "@/db/auth";

// GET /api/proposals — list match proposals for the current user
export async function GET(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposals = await queryAll(`SELECT
        mp.*,
        my_trip.direction,
        my_trip.area        AS my_area,
        my_trip.flight_time AS my_flight_time,
        my_trip.travel_date,
        my_trip.terminal,
        other_trip.area        AS other_area,
        other_trip.flight_time AS other_flight_time,
        other_trip.pax_count   AS other_pax,
        other_user.name        AS other_name,
        CASE WHEN my_trip.id = mp.trip_request_a THEN 'a' ELSE 'b' END AS my_side,
        CASE WHEN my_trip.id = mp.trip_request_a THEN mp.user_a_response ELSE mp.user_b_response END AS my_response,
        CASE WHEN my_trip.id = mp.trip_request_a THEN mp.user_b_response ELSE mp.user_a_response END AS other_response
      FROM match_proposals mp
      JOIN trip_requests my_trip ON (
        (mp.trip_request_a = my_trip.id OR mp.trip_request_b = my_trip.id)
        AND my_trip.user_id = ?
      )
      JOIN trip_requests other_trip ON (
        other_trip.id = CASE WHEN my_trip.id = mp.trip_request_a THEN mp.trip_request_b ELSE mp.trip_request_a END
      )
      JOIN users other_user ON other_user.id = other_trip.user_id
      WHERE mp.status = 'pending'
      ORDER BY mp.proposed_at DESC`,
      [auth.userId]
    );

    return NextResponse.json({ proposals });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/proposals — accept or reject a proposal
// Body: { proposal_id, response: "accepted" | "rejected" }
export async function PATCH(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { proposal_id, response } = await request.json();

    if (!proposal_id || !["accepted", "rejected"].includes(response)) {
      return NextResponse.json(
        { error: "proposal_id and response ('accepted' or 'rejected') are required" },
        { status: 400 }
      );
    }

    // Find the proposal and figure out which side the user is on
    const proposal = await queryOne(`SELECT mp.*,
        tra.user_id AS user_a,
        trb.user_id AS user_b
      FROM match_proposals mp
      JOIN trip_requests tra ON tra.id = mp.trip_request_a
      JOIN trip_requests trb ON trb.id = mp.trip_request_b
      WHERE mp.id = ?`,
      [proposal_id]
    );

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    if (proposal.status !== "pending") {
      return NextResponse.json({ error: "Proposal is no longer pending" }, { status: 409 });
    }

    // Determine which side the user is
    let mySide: "a" | "b";
    if (proposal.user_a === auth.userId) mySide = "a";
    else if (proposal.user_b === auth.userId) mySide = "b";
    else {
      return NextResponse.json({ error: "You are not part of this proposal" }, { status: 403 });
    }

    const responseCol = mySide === "a" ? "user_a_response" : "user_b_response";
    const otherResponseCol = mySide === "a" ? "user_b_response" : "user_a_response";

    // Update my response
    await execute(`UPDATE match_proposals SET ${responseCol} = ? WHERE id = ?`,
      [response, proposal_id]
    );

    // If rejected, mark the whole proposal as rejected
    if (response === "rejected") {
      await execute("UPDATE match_proposals SET status = 'rejected', resolved_at = datetime('now') WHERE id = ?",
        [proposal_id]
      );
      persistDb();
      return NextResponse.json({ status: "rejected" });
    }

    // If accepted, check if the other side also accepted
    const otherResponse = proposal[otherResponseCol];

    if (otherResponse === "accepted") {
      // Both accepted — confirm the match

      // Check both trip requests are still open/proposed
      const tripA = await queryOne("SELECT status FROM trip_requests WHERE id = ?", [proposal.trip_request_a]);
      const tripB = await queryOne("SELECT status FROM trip_requests WHERE id = ?", [proposal.trip_request_b]);

      if (tripA.status === "matched" || tripB.status === "matched") {
        await execute("UPDATE match_proposals SET status = 'expired', resolved_at = datetime('now') WHERE id = ?",
          [proposal_id]
        );
        persistDb();
        return NextResponse.json({ status: "expired", reason: "One of the trips was already matched" });
      }

      // Confirm this proposal
      await execute("UPDATE match_proposals SET status = 'confirmed', resolved_at = datetime('now') WHERE id = ?",
        [proposal_id]
      );

      // Mark both trip requests as matched
      await execute("UPDATE trip_requests SET status = 'matched' WHERE id = ?", [proposal.trip_request_a]);
      await execute("UPDATE trip_requests SET status = 'matched' WHERE id = ?", [proposal.trip_request_b]);

      // Expire all other pending proposals involving either trip request
      await execute(`UPDATE match_proposals
         SET status = 'expired', resolved_at = datetime('now')
         WHERE id != ?
           AND status = 'pending'
           AND (trip_request_a IN (?, ?) OR trip_request_b IN (?, ?))`,
        [proposal_id, proposal.trip_request_a, proposal.trip_request_b, proposal.trip_request_a, proposal.trip_request_b]
      );

      persistDb();
      return NextResponse.json({ status: "confirmed" });
    }

    // Other side hasn't responded yet
    persistDb();
    return NextResponse.json({ status: "waiting", message: "Waiting for the other traveller to respond" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
