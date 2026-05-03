"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthContext";

const AREAS = ["Koramangala", "Indiranagar", "HSR Layout", "Sarjapur", "Whitefield", "Electronic City", "Hebbal", "Yeshwanthpur", "Jayanagar", "JP Nagar", "Marathahalli", "Bellandur", "Bannerghatta Road"];
const TERMINALS = ["Terminal 1 (T1) — Domestic", "Terminal 2 (T2) — International & Domestic"];

const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  "Koramangala":      { lat: 12.9279, lng: 77.6271 },
  "Indiranagar":      { lat: 12.9784, lng: 77.6408 },
  "HSR Layout":       { lat: 12.9116, lng: 77.6474 },
  "Sarjapur":         { lat: 12.8604, lng: 77.7085 },
  "Whitefield":       { lat: 12.9698, lng: 77.7499 },
  "Electronic City":  { lat: 12.8399, lng: 77.6770 },
  "Hebbal":           { lat: 13.0450, lng: 77.5945 },
  "Yeshwanthpur":     { lat: 13.0210, lng: 77.5510 },
  "Jayanagar":        { lat: 12.9250, lng: 77.5938 },
  "JP Nagar":         { lat: 12.9063, lng: 77.5857 },
  "Marathahalli":     { lat: 12.9591, lng: 77.6974 },
  "Bellandur":        { lat: 12.9254, lng: 77.6784 },
  "Bannerghatta Road":{ lat: 12.8748, lng: 77.5977 },
};

const BLR_AIRPORT = { lat: 13.1986, lng: 77.7066 };

const AREA_DRIVE_MINS: Record<string, number> = {
  "Koramangala": 75, "Indiranagar": 65, "HSR Layout": 80, "Sarjapur": 85,
  "Whitefield": 70, "Electronic City": 90, "Hebbal": 35, "Yeshwanthpur": 45,
  "Jayanagar": 80, "JP Nagar": 85, "Marathahalli": 60, "Bellandur": 75,
  "Bannerghatta Road": 95,
};

const AREA_DIST_KM: Record<string, number> = {
  "Koramangala": 42, "Indiranagar": 38, "HSR Layout": 44, "Sarjapur": 48,
  "Whitefield": 35, "Electronic City": 52, "Hebbal": 18, "Yeshwanthpur": 28,
  "Jayanagar": 45, "JP Nagar": 47, "Marathahalli": 33, "Bellandur": 40,
  "Bannerghatta Road": 55,
};

type Direction = "to" | "from";

/* ─── Pulsing ring for "searching" ─── */
function PulseRing() {
  return (
    <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 20px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #1A73E8",
          animation: `pulseRing 2s ease-out ${i * 0.6}s infinite`, opacity: 0,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 16, borderRadius: "50%", background: "#202124",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff",
      }}>🔍</div>
    </div>
  );
}

/* ─── Main component ─── */
export default function BookPage() {
  const router = useRouter();
  const { user, loading: authLoading, apiFetch } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<Direction>("to");
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [flight, setFlight] = useState("");
  const [terminal, setTerminal] = useState("");
  const [pax, setPax] = useState("1");
  const [bags, setBags] = useState("1");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

          
  const validate = () => {
    const e: Record<string, string> = {};
    if (!date) e.date = "Select your travel date";
    if (!time) e.time = "Select your flight time";
    if (!area) e.area = direction === "to" ? "Select your pickup area" : "Select your drop area";
    if (!terminal) e.terminal = "Select your terminal";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiFetch("/api/trip-requests", {
        method: "POST",
        body: JSON.stringify({
          direction, area, terminal,
          travel_date: date, flight_time: time,
          flight_number: flight || undefined,
          pax_count: parseInt(pax), bag_count: parseInt(bags),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await apiFetch("/api/match-batch", { method: "POST" });
      setStep(3);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit trip");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const driveMins = area ? AREA_DRIVE_MINS[area] || 60 : 0;
  const distKm = area ? AREA_DIST_KM[area] || 40 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulseRing {
          0% { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .bk-input { width:100%; border:1px solid #DADCE0; border-radius:10px; padding:12px 14px; font-size:15px; color:#202124; outline:none; font-family:inherit; background:#fff; transition: border-color 0.2s, box-shadow 0.2s; }
        .bk-input:focus { border-color:#1A73E8; box-shadow: 0 0 0 3px rgba(26,115,232,0.12); }
        .bk-input-err { border-color:#D93025 !important; }
        .bk-input-err:focus { box-shadow: 0 0 0 3px rgba(217,48,37,0.12); }
        .bk-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2380868B' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        .bk-btn { display:flex; align-items:center; justify-content:center; width:100%; background:#202124; color:#fff; font-weight:600; padding:15px 24px; border-radius:12px; font-size:16px; border:none; cursor:pointer; font-family:inherit; transition: transform 0.15s, box-shadow 0.15s; }
        .bk-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
        .bk-btn:active { transform: translateY(0); }
        .bk-btn-sec { display:flex; align-items:center; justify-content:center; flex:1; background:#fff; color:#202124; font-weight:600; padding:14px 24px; border-radius:12px; font-size:15px; border:1px solid #DADCE0; cursor:pointer; font-family:inherit; transition: background 0.15s; }
        .bk-btn-sec:hover { background:#F8F9FA; }
        .bk-dir-btn { display:flex; align-items:center; gap:10px; padding:14px 16px; border-radius:12px; border:1.5px solid #DADCE0; background:#fff; color:#5F6368; font-weight:400; font-size:14px; cursor:pointer; font-family:inherit; transition: all 0.2s; }
        .bk-dir-btn.active { border-color:#202124; background:#202124; color:#fff; font-weight:600; }
        .bk-area-chip { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:20px; border:1.5px solid #E8EAED; background:#fff; font-size:13px; color:#3C4043; cursor:pointer; font-family:inherit; transition: all 0.2s; white-space: nowrap; }
        .bk-area-chip:hover { border-color:#BDC1C6; background:#F8F9FA; }
        .bk-area-chip.active { border-color:#1A73E8; background:#E8F0FE; color:#1A73E8; font-weight:600; }
        .bk-terminal-btn { display:flex; align-items:center; gap:10px; padding:13px 16px; border-radius:10px; border:1.5px solid #DADCE0; background:#fff; color:#5F6368; font-size:14px; cursor:pointer; font-family:inherit; transition: all 0.15s; width:100%; text-align:left; }
        .bk-terminal-btn:hover { border-color:#BDC1C6; }
        .bk-terminal-btn.active { border-color:#202124; background:#F8F9FA; color:#202124; font-weight:600; }
        .bk-route-info-tag { display:inline-flex; align-items:center; gap:4px; background:#F8F9FA; border:1px solid #E8EAED; border-radius:8px; padding:6px 12px; font-size:12px; color:#5F6368; font-weight:500; }
        .bk-label { display:block; font-size:12px; font-weight:600; color:#80868B; margin-bottom:8px; letter-spacing:0.5px; text-transform:uppercase; }
        .bk-divider { border:none; border-top:1px solid #F1F3F4; margin:20px 0; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F8F9FA", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #E8EAED", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 28, height: 28, background: "#202124", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✈</div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#202124" }}>bill<span style={{ color: "#1A73E8" }}>kill</span></span>
            </Link>
            <Link href="/dashboard" style={{ fontSize: 13, color: "#5F6368", textDecoration: "none", fontWeight: 500 }}>Dashboard</Link>
          </div>
        </nav>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
            {/* Progress pills */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "20px 0 16px" }}>
              {["Travel details", "Your quote", "Match!"].map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, flex: i < 2 ? 1 : undefined }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20,
                    background: step >= i + 1 ? "#202124" : "#fff",
                    border: step >= i + 1 ? "none" : "1px solid #E8EAED",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: step >= i + 1 ? "#fff" : "#80868B" }}>{step > i + 1 ? "✓" : i + 1}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: step >= i + 1 ? "#fff" : "#80868B" }}>{label}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? "#202124" : "#E8EAED" }} />}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start", paddingBottom: 64 }}>
              {/* LEFT: Form */}
              <div ref={formRef} style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 20, padding: "28px 28px 32px", animation: "fadeUp 0.4s ease" }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#202124", marginBottom: 2 }}>Your travel details</h1>
                <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>We'll match you with co-travellers on the same route</p>

                {/* Direction */}
                <label className="bk-label">Direction</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                  {([["to", "City → Airport", "🏙️"], ["from", "Airport → City", "✈️"]] as [Direction, string, string][]).map(([val, label, icon]) => (
                    <button key={val} onClick={() => setDirection(val)} className={`bk-dir-btn ${direction === val ? "active" : ""}`}>
                      <span style={{ fontSize: 18 }}>{icon}</span> {label}
                    </button>
                  ))}
                </div>

                {/* Area chips */}
                <label className="bk-label">{direction === "to" ? "Pickup area" : "Drop area"}</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                  {AREAS.map(a => (
                    <button key={a} onClick={() => { setArea(a); setMapLoaded(false); setErrors(p => ({ ...p, area: "" })); }} className={`bk-area-chip ${area === a ? "active" : ""}`}>
                      {area === a && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1A73E8" }} />}
                      {a}
                    </button>
                  ))}
                </div>
                {errors.area && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 8 }}>{errors.area}</p>}
                {area && (
                  <p style={{ fontSize: 12, color: "#80868B" }}>
                    {direction === "to" ? `Drop: BLR Airport (${terminal || "select terminal"})` : `Pickup: BLR Airport (${terminal || "select terminal"})`}
                  </p>
                )}

                <hr className="bk-divider" />

                {/* Date + Time */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                  <div>
                    <label className="bk-label">Travel date</label>
                    <input type="date" min={today} value={date} onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date: "" })); }} className={`bk-input ${errors.date ? "bk-input-err" : ""}`} />
                    {errors.date && <p style={{ fontSize: 12, color: "#D93025", marginTop: 4 }}>{errors.date}</p>}
                  </div>
                  <div>
                    <label className="bk-label">{direction === "to" ? "Departure time" : "Arrival time"}</label>
                    <input type="time" value={time} onChange={e => { setTime(e.target.value); setErrors(p => ({ ...p, time: "" })); }} className={`bk-input ${errors.time ? "bk-input-err" : ""}`} />
                    {errors.time && <p style={{ fontSize: 12, color: "#D93025", marginTop: 4 }}>{errors.time}</p>}
                  </div>
                </div>

                {/* Flight */}
                <div style={{ marginBottom: 20 }}>
                  <label className="bk-label">Flight number <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                  <input type="text" placeholder="e.g. 6E-204, AI-501" value={flight} onChange={e => setFlight(e.target.value)} className="bk-input" />
                  <p style={{ fontSize: 11, color: "#BDC1C6", marginTop: 4 }}>We'll auto-fill your departure time</p>
                </div>

                <hr className="bk-divider" />

                {/* Terminal */}
                <label className="bk-label">BLR Terminal</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {TERMINALS.map(t => (
                    <button key={t} onClick={() => { setTerminal(t); setErrors(p => ({ ...p, terminal: "" })); }} className={`bk-terminal-btn ${terminal === t ? "active" : ""}`}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", border: terminal === t ? "5px solid #202124" : "2px solid #DADCE0", flexShrink: 0, transition: "border 0.15s" }} />
                      {t}
                    </button>
                  ))}
                </div>
                {errors.terminal && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 8 }}>{errors.terminal}</p>}

                <hr className="bk-divider" />

                {/* Pax + Bags */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                  <div>
                    <label className="bk-label">👤 Travellers</label>
                    <select value={pax} onChange={e => setPax(e.target.value)} className="bk-input bk-select">
                      <option value="1">Just me</option>
                      <option value="2">2 people</option>
                      <option value="3">3 people</option>
                    </select>
                  </div>
                  <div>
                    <label className="bk-label">🧳 Check-in bags</label>
                    <select value={bags} onChange={e => setBags(e.target.value)} className="bk-input bk-select">
                      <option value="0">No bags</option>
                      <option value="1">1 bag</option>
                      <option value="2">2 bags</option>
                      <option value="3">3+ bags</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleSubmit} className="bk-btn" disabled={submitting}>
                  {submitting ? "Finding matches…" : "Find my match →"}
                </button>
                {submitError && <p style={{ fontSize: 12, color: "#D93025", marginTop: 8, textAlign: "center" }}>{submitError}</p>}
              </div>

              {/* RIGHT: Dynamic Visual */}
              <div style={{ position: "sticky", top: 76 }}>
                {/* Map card */}
                <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 20, overflow: "hidden", animation: "fadeUp 0.5s ease" }}>
                  {area && AREA_COORDS[area] ? (
                    <>
                      {/* Route header */}
                      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {/* Route dots */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1A73E8", border: "2px solid #E8F0FE" }} />
                            <div style={{ width: 1.5, height: 20, background: "#DADCE0" }} />
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#202124", border: "2px solid #E8EAED" }} />
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div>
                              <p style={{ fontSize: 11, color: "#80868B", lineHeight: 1 }}>{direction === "to" ? "PICKUP" : "DROP"}</p>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A73E8" }}>{area}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 11, color: "#80868B", lineHeight: 1 }}>{direction === "to" ? "DROP" : "PICKUP"}</p>
                              <p style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>BLR Airport</p>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                          <span className="bk-route-info-tag">🕐 ~{driveMins} min</span>
                          <span className="bk-route-info-tag">📏 ~{distKm} km</span>
                        </div>
                      </div>

                      {/* Google Maps directions embed */}
                      <div style={{ position: "relative", height: 340, borderTop: "1px solid #E8EAED" }}>
                        {!mapLoaded && (
                          <div style={{ position: "absolute", inset: 0, background: "#F1F3F4", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, zIndex: 1 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #E8EAED", borderTopColor: "#1A73E8", animation: "spin 0.8s linear infinite" }} />
                            <p style={{ fontSize: 13, color: "#80868B", fontWeight: 500 }}>Loading route…</p>
                          </div>
                        )}
                        <iframe
                          key={`${area}-${direction}`}
                          width="100%"
                          height="340"
                          style={{ border: "none", display: "block", opacity: mapLoaded ? 1 : 0, transition: "opacity 0.4s" }}
                          loading="lazy"
                          onLoad={() => setMapLoaded(true)}
                          src={
                            direction === "to"
                              ? `https://maps.google.com/maps?saddr=${encodeURIComponent(area + ", Bengaluru")}&daddr=Kempegowda+International+Airport+Bengaluru&output=embed`
                              : `https://maps.google.com/maps?saddr=Kempegowda+International+Airport+Bengaluru&daddr=${encodeURIComponent(area + ", Bengaluru")}&output=embed`
                          }
                        />
                      </div>

                      {/* Bottom actions */}
                      <div style={{ padding: "12px 20px", borderTop: "1px solid #E8EAED", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#5F6368", fontWeight: 500 }}>📍 {area}, Bengaluru</span>
                        <a href={`https://www.google.com/maps/dir/${encodeURIComponent(area + ", Bengaluru")}/Kempegowda+International+Airport`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#1A73E8", textDecoration: "none", fontWeight: 600 }}>
                          Open in Maps →
                        </a>
                      </div>
                    </>
                  ) : (
                    /* Empty state */
                    <div style={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, background: "linear-gradient(135deg, #F8F9FA 0%, #E8EAED 100%)" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>🗺️</div>
                      <p style={{ fontSize: 15, color: "#5F6368", fontWeight: 600 }}>Your route preview</p>
                      <p style={{ fontSize: 13, color: "#80868B", textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>Select a pickup area to see the driving route to BLR Airport</p>
                    </div>
                  )}
                </div>
              </div>

              <Link href="/dashboard" className="bk-btn" style={{ textDecoration: "none", display: "flex" }}>
                Go to dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
