"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import { Plane, MapPin, Plus, Clock, Users, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { ROUTES } from "@/data/config";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  open: { label: "Searching", color: "#F9AB00", bg: "#FEF7E0", icon: Clock },
  proposed: { label: "Match found", color: "#1A73E8", bg: "#E8F0FE", icon: Users },
  matched: { label: "Confirmed", color: "#1E8E3E", bg: "#E6F4EA", icon: CheckCircle },
  expired: { label: "Expired", color: "#80868B", bg: "#F1F3F4", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "#D93025", bg: "#FCE8E6", icon: AlertCircle },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, apiFetch } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [tripProposalMap, setTripProposalMap] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) fetchData();
  }, [authLoading, user]);

  const fetchTripProposals = async (trips: any[]) => {
    const map: Record<number, any[]> = {};
    const token = localStorage.getItem("bk_token");
    for (const t of trips) {
      try {
        const res = await fetch("/api/trip-requests/proposals?trip_id=" + t.id, {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await res.json();
        map[t.id] = data.proposals || [];
      } catch { map[t.id] = []; }
    }
    setTripProposalMap(map);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tripsRes, proposalsRes] = await Promise.all([
        apiFetch("/api/trip-requests"),
        apiFetch("/api/proposals"),
      ]);
      const tripsData = await tripsRes.json();
      const proposalsData = await proposalsRes.json();
      setTrips(tripsData.trips || []);
      await fetchTripProposals(tripsData.trips || []);
      setProposals(proposalsData.proposals || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProposalAction = async (proposalId: number, response: "accepted" | "rejected") => {
    setActionLoading(proposalId);
    try {
      const res = await apiFetch("/api/proposals", {
        method: "PATCH",
        body: JSON.stringify({ proposal_id: proposalId, response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const cancelTrip = async (tripId: number) => {
    if (!confirm("Cancel this trip? This cannot be undone.")) return;
    try {
      const res = await apiFetch("/api/trip-requests/cancel", {
        method: "PATCH",
        body: JSON.stringify({ trip_id: tripId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to cancel trip");
    }
  };

  const activeTrips = trips.filter(t => ["open", "proposed", "matched"].includes(t.status));
  const pastTrips = trips.filter(t => ["expired", "cancelled"].includes(t.status));

  const getFare = (area: string) => {
    const r = ROUTES.find(r => r.area === area);
    return r ? { solo: r.solo, shared: r.shared, savings: r.solo - r.shared } : null;
  };

  const formatDate = (d: string) => {
    try {
      const date = new Date(d + "T00:00:00");
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return d; }
  };

  const formatTime = (t: string) => {
    try {
      const [h, m] = t.split(":");
      const hr = parseInt(h);
      return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? "PM" : "AM"}`;
    } catch { return t; }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
        <Navbar />
        <div style={{ paddingTop: 120, textAlign: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #E8EAED", borderTopColor: "#1A73E8", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "80px 20px 64px" }}>
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, paddingTop: 16, animation: "fadeUp 0.3s ease" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#202124", marginBottom: 4 }}>
              Hi, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p style={{ fontSize: 14, color: "#80868B" }}>
              {activeTrips.length > 0
                ? `${activeTrips.length} active trip${activeTrips.length > 1 ? "s" : ""} · ${proposals.length} pending proposal${proposals.length !== 1 ? "s" : ""}`
                : "No active trips yet"}
            </p>
          </div>
          <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#202124", color: "#fff", fontWeight: 600, padding: "12px 20px", borderRadius: 12, fontSize: 14, textDecoration: "none", transition: "transform 0.15s", fontFamily: "inherit" }}>
            <Plus style={{ width: 16, height: 16 }} /> New trip
          </Link>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32, animation: "fadeUp 0.4s ease" }}>
          {[
            { label: "Total trips", val: trips.length, accent: "#1A73E8", bg: "#E8F0FE", icon: "✈️" },
            { label: "Matched", val: trips.filter(t => t.status === "matched").length, accent: "#1E8E3E", bg: "#E6F4EA", icon: "🤝" },
            { label: "Searching", val: trips.filter(t => ["open", "proposed"].includes(t.status)).length, accent: "#F9AB00", bg: "#FEF7E0", icon: "🔍" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: "20px 18px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>{s.icon}</div>
              <p style={{ fontSize: 12, color: "#80868B", fontWeight: 500, marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#202124" }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* ── Match proposals ── */}

        {activeTrips.length > 0 && (
          <div style={{ marginBottom: 32, animation: "fadeUp 0.5s ease" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#202124", marginBottom: 16 }}>Active trips</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeTrips.map((trip: any) => {
                const sc = statusConfig[trip.status] || statusConfig.open;
                const StatusIcon = sc.icon;
                const tripProposals = tripProposalMap[trip.id] || [];
                return (
                  <div key={trip.id} style={{
                    background: trip.status === "matched" ? "#fff" : "#fff",
                    border: "1px solid #E8EAED",
                    borderRadius: 16, overflow: "hidden",
                  }}>
                    {/* Trip info row */}
                    <div style={{
                      padding: "18px 20px", display: "flex", alignItems: "center", gap: 16,
                      background: "#fff",
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: sc.bg,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <StatusIcon style={{ width: 20, height: 20, color: sc.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#202124" }}>
                            {trip.direction === "to" ? `${trip.area} → BLR` : `BLR → ${trip.area}`}
                          </span>
                          {trip.flight_number && (
                            <span style={{ fontSize: 12, color: "#80868B", background: "#F1F3F4", borderRadius: 6, padding: "2px 8px" }}>{trip.flight_number}</span>
                          )}
                          {trip.status === "matched" && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#1E8E3E", borderRadius: 6, padding: "3px 10px" }}>✓ RIDE MATCHED</span>
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: "#5F6368" }}>
                          {formatDate(trip.travel_date)} · {formatTime(trip.flight_time)} · {trip.pax_count} pax · {trip.bag_count} bag{trip.bag_count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        {trip.status !== "matched" && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: sc.color, background: sc.bg, borderRadius: 8, padding: "4px 12px" }}>
                            {sc.label}
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); cancelTrip(trip.id); }}
                          style={{ fontSize: 11, color: "#D93025", background: "none", border: "1px solid #FADBD8", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Linked proposals */}
                    {tripProposals.length > 0 && (
                      <div style={{ borderTop: "2px solid #E8EAED" }}>
                        {/* Section header */}
                        <div style={{ padding: "12px 20px", background: "#F8F9FA", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#5F6368", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Match History
                          </span>
                          <span style={{ fontSize: 11, color: "#80868B", background: "#E8EAED", borderRadius: 8, padding: "1px 8px" }}>
                            {tripProposals.length}
                          </span>
                        </div>

                        {tripProposals.map((p: any, idx: number) => {
                          const initials = p.other_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                          const isConfirmed = p.status === "confirmed";
                          const isExpired = p.status === "expired";
                          const isRejected = p.status === "rejected";
                          const isPending = p.status === "pending";
                          const faded = isExpired || isRejected;

                          return (
                            <div key={p.id} style={{
                              padding: "16px 20px",
                              borderTop: idx > 0 ? "1px solid #E8EAED" : "none",
                              background: isConfirmed ? "#E6F4EA" : faded ? "#FAFAFA" : "#fff",
                              opacity: faded ? 0.65 : 1,
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{
                                  width: 40, height: 40, borderRadius: "50%",
                                  background: isConfirmed ? "#1E8E3E" : faded ? "#BDC1C6" : "#1A73E8",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
                                }}>
                                  {initials}
                                </div>

                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 14, fontWeight: 600, color: faded ? "#80868B" : "#202124", marginBottom: 2 }}>
                                    {p.other_name}
                                  </p>
                                  {!isConfirmed && (
                                  <p style={{ fontSize: 12, color: "#80868B" }}>
                                    {p.other_area} · Flight at {formatTime(p.other_flight_time)} · {p.other_pax} pax
                                  </p>
                                )}
                                </div>

                                {/* Status badge */}
                                <div style={{ flexShrink: 0 }}>
                                  {isConfirmed && (
                                    <span style={{ fontSize: 11, fontWeight: 600, color: "#1E8E3E", background: "#C8E6C9", borderRadius: 8, padding: "4px 12px" }}>✓ Matched</span>
                                  )}
                                  {isExpired && (
                                    <span style={{ fontSize: 11, fontWeight: 500, color: "#80868B", background: "#E8EAED", borderRadius: 8, padding: "4px 12px" }}>Expired</span>
                                  )}
                                  {isRejected && (
                                    <span style={{ fontSize: 11, fontWeight: 500, color: "#D93025", background: "#FCE8E6", borderRadius: 8, padding: "4px 12px" }}>Declined</span>
                                  )}
                                  {isPending && p.my_response === "accepted" && (
                                    <span style={{ fontSize: 11, fontWeight: 600, color: "#F9AB00", background: "#FEF7E0", borderRadius: 8, padding: "4px 12px" }}>⏳ Waiting</span>
                                  )}
                                </div>
                              </div>

                              {/* Status explanation */}
                              {isConfirmed && (
                                <div style={{ marginTop: 12, padding: "14px 16px", background: "#fff", borderRadius: 12, border: "1px solid #C8E6C9" }}>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                                    <div style={{ background: "#E6F4EA", borderRadius: 8, padding: "8px 12px" }}>
                                      <p style={{ fontSize: 10, color: "#1E8E3E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Area</p>
                                      <p style={{ fontSize: 14, fontWeight: 700, color: "#202124" }}>{p.other_area}</p>
                                    </div>
                                    <div style={{ background: "#E6F4EA", borderRadius: 8, padding: "8px 12px" }}>
                                      <p style={{ fontSize: 10, color: "#1E8E3E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Their flight</p>
                                      <p style={{ fontSize: 14, fontWeight: 700, color: "#202124" }}>{formatTime(p.other_flight_time)}</p>
                                    </div>
                                    <div style={{ background: "#E6F4EA", borderRadius: 8, padding: "8px 12px" }}>
                                      <p style={{ fontSize: 10, color: "#1E8E3E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Group size</p>
                                      <p style={{ fontSize: 14, fontWeight: 700, color: "#202124" }}>{p.other_pax} pax</p>
                                    </div>
                                  </div>
                                  <p style={{ fontSize: 12, color: "#1E8E3E", fontWeight: 500 }}>🎉 You're sharing this ride with {p.other_name.split(" ")[0]}! Coordinate pickup details before your trip.</p>
                                </div>
                              )}

                              {isExpired && (
                                <p style={{ fontSize: 11, color: "#80868B", marginTop: 6, marginLeft: 54 }}>
                                  {p.my_response === "accepted" ? "Auto-expired — you matched with someone else" :
                                   p.my_response === "pending" ? "Expired — no response in time" :
                                   "Expired by system"}
                                </p>
                              )}

                              {isRejected && (
                                <p style={{ fontSize: 11, color: "#80868B", marginTop: 6, marginLeft: 54 }}>
                                  {p.my_response === "rejected" ? "You declined this match" : p.other_name.split(" ")[0] + " declined this match"}
                                </p>
                              )}

                              {isPending && p.my_response === "accepted" && p.other_response === "pending" && (
                                <p style={{ fontSize: 11, color: "#F9AB00", marginTop: 6, marginLeft: 54 }}>
                                  You accepted — waiting for {p.other_name.split(" ")[0]} to respond
                                </p>
                              )}

                              {/* Inline accept/decline for pending proposals */}
                              {isPending && p.my_response === "pending" && (
                                <div style={{ marginTop: 12, marginLeft: 54, display: "flex", gap: 8 }}>
                                  <button
                                    onClick={() => handleProposalAction(p.id, "accepted")}
                                    disabled={actionLoading === p.id}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 6,
                                      background: "#1E8E3E", color: "#fff", fontWeight: 600,
                                      padding: "10px 20px", borderRadius: 10, fontSize: 13,
                                      border: "none", cursor: "pointer", fontFamily: "inherit",
                                    }}
                                  >
                                    {actionLoading === p.id ? "..." : "✓ Accept"}
                                  </button>
                                  <button
                                    onClick={() => handleProposalAction(p.id, "rejected")}
                                    disabled={actionLoading === p.id}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 6,
                                      background: "#fff", color: "#5F6368", fontWeight: 500,
                                      padding: "10px 20px", borderRadius: 10, fontSize: 13,
                                      border: "1px solid #DADCE0", cursor: "pointer", fontFamily: "inherit",
                                    }}
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Searching state */}
                    {trip.status === "open" && tripProposals.length === 0 && (
                      <div style={{ borderTop: "1px solid #E8EAED", padding: "12px 20px", background: "#FFFBF0", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14 }}>🔍</span>
                        <p style={{ fontSize: 12, color: "#80868B" }}>Scanning for co-travellers on your route…</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Past trips ── */}
        {pastTrips.length > 0 && (
          <div style={{ animation: "fadeUp 0.55s ease" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#80868B", marginBottom: 16 }}>Past trips</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pastTrips.map((trip: any) => {
                const sc = statusConfig[trip.status] || statusConfig.expired;
                return (
                  <div key={trip.id} style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, opacity: 0.7 }}>
                    <MapPin style={{ width: 16, height: 16, color: "#BDC1C6", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#5F6368" }}>
                        {trip.direction === "to" ? `${trip.area} → BLR` : `BLR → ${trip.area}`}
                      </p>
                      <p style={{ fontSize: 12, color: "#80868B" }}>{formatDate(trip.travel_date)}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: sc.color, background: sc.bg, borderRadius: 6, padding: "2px 10px" }}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {trips.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 20, padding: "48px 24px", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E8F0FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>✈️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 6 }}>No trips yet</h2>
            <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
              Book your first trip to start finding co-travellers and saving money on airport cabs.
            </p>
            <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#202124", color: "#fff", fontWeight: 600, padding: "14px 28px", borderRadius: 12, fontSize: 15, textDecoration: "none", fontFamily: "inherit" }}>
              <Plus style={{ width: 16, height: 16 }} /> Book a trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
