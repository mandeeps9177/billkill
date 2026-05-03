import { NextResponse } from "next/server";
import { queryAll, queryOne, execute, persistDb } from "@/db";

const MATCH_WINDOW_MINUTES = 90;

export async function POST() {
  try {

    // 1. Find all open/proposed trip requests for upcoming dates
    const openTrips = await queryAll(`SELECT * FROM trip_requests
       WHERE status IN ('open', 'proposed')
         AND travel_date >= date('now')
       ORDER BY direction, area, terminal, travel_date, flight_time`
    );

    let proposalsCreated = 0;

    // 2. For each open trip, find compatible candidates
    for (const trip of openTrips) {
      const candidates = await queryAll(`SELECT * FROM trip_requests
         WHERE id != ?
           AND user_id != ?
           AND status IN ('open', 'proposed')
           AND direction = ?
           AND area = ?
           AND terminal = ?
           AND travel_date = ?
           AND ABS(
             (CAST(substr(flight_time, 1, 2) AS INTEGER) * 60 + CAST(substr(flight_time, 4, 2) AS INTEGER))
             - (CAST(substr(?, 1, 2) AS INTEGER) * 60 + CAST(substr(?, 4, 2) AS INTEGER))
           ) <= ?`,
        [trip.id, trip.user_id, trip.direction, trip.area, trip.terminal, trip.travel_date, trip.flight_time, trip.flight_time, MATCH_WINDOW_MINUTES]
      );

      for (const candidate of candidates) {
        // Always store lower id as trip_request_a to prevent duplicates
        const [idA, idB] = trip.id < candidate.id ? [trip.id, candidate.id] : [candidate.id, trip.id];

        // Skip if proposal already exists
        const existing = await queryOne("SELECT id FROM match_proposals WHERE trip_request_a = ? AND trip_request_b = ? AND status IN ('pending', 'confirmed')",
          [idA, idB]
        );
        if (existing) continue;

        // Skip if either trip is already confirmed
        const alreadyMatched = await queryOne(`SELECT id FROM match_proposals
           WHERE status = 'confirmed'
             AND (trip_request_a IN (?, ?) OR trip_request_b IN (?, ?))`,
          [idA, idB, idA, idB]
        );
        if (alreadyMatched) continue;

        // Create proposal
        await execute("INSERT INTO match_proposals (trip_request_a, trip_request_b) VALUES (?, ?)",
          [idA, idB]
        );

        // Update trip statuses to 'proposed'
        await execute("UPDATE trip_requests SET status = 'proposed' WHERE id IN (?, ?) AND status = 'open'", [idA, idB]);

        proposalsCreated++;
      }
    }

    // 3. Expire stale proposals (>24 hours, still pending)
    const { changes: proposalsExpired } = await execute(`UPDATE match_proposals
       SET status = 'expired', resolved_at = datetime('now')
       WHERE status = 'pending'
         AND proposed_at < datetime('now', '-24 hours')`
    );

    // 4. Expire trip requests whose travel date has passed
    const { changes: tripsExpired } = await execute(`UPDATE trip_requests
       SET status = 'expired'
       WHERE status IN ('open', 'proposed')
         AND travel_date < date('now')`
    );

    persistDb();

    return NextResponse.json({
      proposals_created: proposalsCreated,
      proposals_expired: proposalsExpired,
      trips_expired: tripsExpired,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
