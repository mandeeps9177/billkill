// Run with: npx tsx src/scripts/test-race.ts
// Make sure dev server is running first (npm run dev)

const BASE = "http://localhost:3000";

async function api(path: string, opts: any = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts.headers },
  });
  return { ok: res.ok, data: await res.json() };
}

async function login(phone: string) {
  const { data } = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password: "test123" }),
  });
  return data.token;
}

async function test() {
  console.log("🧪 RACE CONDITION TEST\n");
  console.log("Scenario: Mandeep accepts proposals from Arjun, Meera, and Kavya.");
  console.log("Then Meera accepts first → match confirmed.");
  console.log("Arjun and Kavya's proposals should auto-expire.\n");
  console.log("─".repeat(60));

  // 1. Create Meera & Kavya
  for (const u of [
    { name: "Meera Pillai", phone: "9000000088" },
    { name: "Kavya Nair", phone: "9000000077" },
  ]) {
    const { ok, data } = await api("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ ...u, password: "test123" }),
    });
    console.log(`👤 ${u.name}: ${ok ? "created" : data.error}`);
  }

  // 2. Create matching trips for Meera & Kavya
  for (const u of [
    { phone: "9000000088", time: "04:40", flight: "SG-112", name: "Meera" },
    { phone: "9000000077", time: "05:00", flight: "UK-830", name: "Kavya" },
  ]) {
    const token = await login(u.phone);
    const { ok, data } = await api("/api/trip-requests", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        direction: "to",
        area: "Indiranagar",
        terminal: "Terminal 1 (T1) — Domestic",
        travel_date: "2026-05-27",
        flight_time: u.time,
        flight_number: u.flight,
        pax_count: 1,
        bag_count: 1,
      }),
    });
    console.log(`✈️  ${u.name}'s trip: ${ok ? "created" : data.error}`);
  }

  // 3. Run batch matcher
  const { data: matchResult } = await api("/api/match-batch", { method: "POST" });
  console.log(`\n🔄 Batch matcher: ${matchResult.proposals_created} proposals created`);
  console.log("─".repeat(60));

  // 4. Mandeep accepts ALL proposals
  const mandeepToken = await login("9000000001");
  const { data: mandeepProps } = await api("/api/proposals", {
    headers: { Authorization: `Bearer ${mandeepToken}` },
  });
  console.log(`\n📋 Mandeep has ${mandeepProps.proposals.length} proposals:`);

  for (const p of mandeepProps.proposals) {
    if (p.my_response === "pending") {
      const { data } = await api("/api/proposals", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${mandeepToken}` },
        body: JSON.stringify({ proposal_id: p.id, response: "accepted" }),
      });
      console.log(`   ✅ Accepted proposal #${p.id} with ${p.other_name} → ${data.status}`);
    } else {
      console.log(`   ⏭️  Proposal #${p.id} with ${p.other_name} already ${p.my_response}`);
    }
  }

  console.log("─".repeat(60));

  // 5. Meera accepts → should CONFIRM the match
  console.log("\n🎯 Meera now accepts her proposal...");
  const meeraToken = await login("9000000088");
  const { data: meeraProps } = await api("/api/proposals", {
    headers: { Authorization: `Bearer ${meeraToken}` },
  });

  for (const p of meeraProps.proposals) {
    if (p.my_response === "pending") {
      const { data } = await api("/api/proposals", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${meeraToken}` },
        body: JSON.stringify({ proposal_id: p.id, response: "accepted" }),
      });
      console.log(`   Meera accepted → ${data.status.toUpperCase()}`);
    }
  }

  console.log("─".repeat(60));

  // 6. Check Kavya — her proposal should be EXPIRED
  console.log("\n🔍 Checking Kavya's proposals...");
  const kavyaToken = await login("9000000077");
  const { data: kavyaProps } = await api("/api/proposals", {
    headers: { Authorization: `Bearer ${kavyaToken}` },
  });
  console.log(`   Kavya has ${kavyaProps.proposals.length} pending proposals (expected: 0 — auto-expired)`);

  // 7. Check Arjun — his proposal should also be EXPIRED
  console.log("\n🔍 Checking Arjun's proposals...");
  const arjunToken = await login("9000000099");
  const { data: arjunProps } = await api("/api/proposals", {
    headers: { Authorization: `Bearer ${arjunToken}` },
  });
  console.log(`   Arjun has ${arjunProps.proposals.length} pending proposals (expected: 0 — auto-expired)`);

  // 8. Final check — Mandeep's trip should be MATCHED
  console.log("\n🔍 Checking Mandeep's trips...");
  const { data: mandeepTrips } = await api("/api/trip-requests", {
    headers: { Authorization: `Bearer ${mandeepToken}` },
  });
  for (const t of mandeepTrips.trips) {
    console.log(`   Trip #${t.id}: ${t.area} → ${t.status.toUpperCase()}`);
  }

  console.log("\n" + "─".repeat(60));
  console.log("✅ TEST COMPLETE");
  console.log("─".repeat(60));
}

test().catch(console.error);
