CREATE TABLE IF NOT EXISTS trip_requests (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id),
  direction     TEXT    NOT NULL CHECK (direction IN ('to', 'from')),
  area          TEXT    NOT NULL,
  terminal      TEXT    NOT NULL,
  travel_date   TEXT    NOT NULL,  -- YYYY-MM-DD
  flight_time   TEXT    NOT NULL,  -- HH:MM
  flight_number TEXT,
  pax_count     INTEGER NOT NULL DEFAULT 1,
  bag_count     INTEGER NOT NULL DEFAULT 0,
  status        TEXT    NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'proposed', 'matched', 'expired', 'cancelled')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_trip_requests_user    ON trip_requests(user_id);
CREATE INDEX idx_trip_requests_status  ON trip_requests(status);
CREATE INDEX idx_trip_requests_match   ON trip_requests(status, direction, area, terminal, travel_date);
