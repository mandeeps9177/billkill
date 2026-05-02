// Run with: npx tsx src/scripts/seed.ts
import { getDb, execute, queryOne, persistDb } from "../db";
import { hashPassword } from "../db/auth";

async function seed() {
  const db = await getDb();

  console.log("🌱 Seeding database...\n");

  // Create test users
  const users = [
    { name: "Priya Sharma", phone: "9000000001", password: "test123" },
    { name: "Arjun Reddy", phone: "9000000002", password: "test123" },
    { name: "Meera Pillai", phone: "9000000003", password: "test123" },
    { name: "Rahul Verma", phone: "9000000004", password: "test123" },
  ];

  for (const u of users) {
    const exists = queryOne(db, "SELECT id FROM users WHERE phone = ?", [u.phone]);
    if (!exists) {
      execute(db, "INSERT INTO users (name, phone, password_hash) VALUES (?, ?, ?)", [u.name, u.phone, hashPassword(u.password)]);
      console.log(`  ✓ Created user: ${u.name} (${u.phone})`);
    } else {
      console.log(`  · User exists: ${u.name}`);
    }
  }

  // Create trip requests — same route/date so they match
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const travelDate = tomorrow.toISOString().split("T")[0];

  const trips = [
    { phone: "9000000001", direction: "to", area: "Koramangala", terminal: "Terminal 1 (T1) — Domestic", time: "06:30", flight: "6E-204" },
    { phone: "9000000002", direction: "to", area: "Koramangala", terminal: "Terminal 1 (T1) — Domestic", time: "07:00", flight: "AI-501" },
    { phone: "9000000003", direction: "to", area: "Koramangala", terminal: "Terminal 1 (T1) — Domestic", time: "06:45", flight: "SG-112" },
    { phone: "9000000004", direction: "to", area: "Whitefield", terminal: "Terminal 2 (T2) — International & Domestic", time: "14:20", flight: "UK-830" },
  ];

  for (const t of trips) {
    const user = queryOne(db, "SELECT id FROM users WHERE phone = ?", [t.phone]);
    if (!user) continue;
    execute(db, `INSERT INTO trip_requests (user_id, direction, area, terminal, travel_date, flight_time, flight_number, pax_count, bag_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, 'open')`,
      [user.id, t.direction, t.area, t.terminal, travelDate, t.time, t.flight]);
    console.log(`  ✓ Trip: ${t.area} ${t.time} (${t.flight})`);
  }

  persistDb();
  console.log("\n🔄 Running batch matcher...\n");

  // Run the matcher
  const res = await fetch("http://localhost:3000/api/match-batch", { method: "POST" });
  const result = await res.json();
  console.log(`  Proposals created: ${result.proposals_created}`);
  console.log(`  Proposals expired: ${result.proposals_expired}`);
  console.log(`  Trips expired: ${result.trips_expired}`);

  console.log("\n✅ Done! Test accounts:\n");
  console.log("  Phone: 9000000001  Password: test123  (Priya — Koramangala 6:30 AM)");
  console.log("  Phone: 9000000002  Password: test123  (Arjun — Koramangala 7:00 AM)");
  console.log("  Phone: 9000000003  Password: test123  (Meera — Koramangala 6:45 AM)");
  console.log("  Phone: 9000000004  Password: test123  (Rahul — Whitefield 2:20 PM)");
  console.log("\n  Priya, Arjun & Meera should have match proposals.");
  console.log("  Rahul has no match (only one on Whitefield route).\n");
}

seed().catch(console.error);
