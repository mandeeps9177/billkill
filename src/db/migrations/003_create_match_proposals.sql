CREATE TABLE IF NOT EXISTS match_proposals (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_request_a   INTEGER NOT NULL REFERENCES trip_requests(id),
  trip_request_b   INTEGER NOT NULL REFERENCES trip_requests(id),
  user_a_response  TEXT    NOT NULL DEFAULT 'pending' CHECK (user_a_response IN ('pending', 'accepted', 'rejected')),
  user_b_response  TEXT    NOT NULL DEFAULT 'pending' CHECK (user_b_response IN ('pending', 'accepted', 'rejected')),
  status           TEXT    NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'expired')),
  proposed_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  resolved_at      TEXT,

  -- prevent duplicate proposals for the same pair
  UNIQUE(trip_request_a, trip_request_b)
);

CREATE INDEX idx_proposals_status ON match_proposals(status);
CREATE INDEX idx_proposals_trip_a ON match_proposals(trip_request_a);
CREATE INDEX idx_proposals_trip_b ON match_proposals(trip_request_b);
