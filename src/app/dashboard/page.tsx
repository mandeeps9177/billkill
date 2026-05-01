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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) fetchData();
  }, [authLoading, user]);

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
      setProposals(proposalsData.proposals || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
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
        {proposals.length > 0 && (
          <div style={{ marginBottom: 32, animation: "fadeUp 0.45s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1A73E8", animation: "pulse 2s infinite" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#202124" }}>Match proposals</h2>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1A73E8", background: "#E8F0FE", borderRadius: 10, padding: "2px 10px" }}>{proposals.length}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {proposals.map((p: any) => {
                const fare = getFare(p.my_area);
                return (
                  <div key={p.id} style={{ background: "#fff", border: "2px solid #1A73E8", borderRadius: 18, padding: 0, overflow: "hidden" }}>
                    {/* Blue header strip */}
                    <div style={{ background: "#E8F0FE", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1A73E8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                          {p.other_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#202124" }}>🎉 {p.other_name}</p>
                          <p style={{ fontSize: 12, color: "#5F6368" }}>wants to share your ride</p>
                        </div>
                      </div>
                      {fare && (
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 11, color: "#80868B" }}>You save</p>
                          <p style={{ fontSize: 18, fontWeight: 700, color: "#1E8E3E" }}>₹{fare.savings}</p>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                        {[
                          { label: "Route", val: `${p.other_area} → BLR`, icon: "📍" },
                          { label: "Date", val: formatDate(p.travel_date), icon: "📅" },
                          { label: "Their flight", val: formatTime(p.other_flight_time), icon: "🕐" },
                        ].map(d => (
                          <div key={d.label} style={{ background: "#F8F9FA", borderRadius: 10, padding: "10px 12px" }}>
                            <p style={{ fontSize: 11, color: "#80868B", marginBottom: 2 }}>{d.icon} {d.label}</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#202124" }}>{d.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Status + actions */}
                      {p.my_response === "pending" ? (
                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            onClick={() => handleProposalAction(p.id, "accepted")}
                            disabled={actionLoading === p.id}
                            style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#1E8E3E", color: "#fff", fontWeight: 600, padding: "12px 20px", borderRadius: 12, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                          >
                            {actionLoading === p.id ? "…" : "✓ Accept match"}
                          </button>
                          <button
                            onClick={() => handleProposalAction(p.id, "rejected")}
                            disabled={actionLoading === p.id}
                            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#5F6368", fontWeight: 600, padding: "12px 16px", borderRadius: 12, fontSize: 14, border: "1px solid #DADCE0", cursor: "pointer", fontFamily: "inherit" }}
                          >
                            Decline
                          </button>
                        </div>
                      ) : p.my_response === "accepted" && p.other_response === "pending" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FEF7E0", borderRadius: 12, padding: "12px 16px" }}>
                          <Clock style={{ width: 16, height: 16, color: "#F9AB00" }} />
                          <p style={{ fontSize: 13, color: "#5F6368", fontWeight: 500 }}>You accepted — waiting for {p.other_name.split(" ")[0]}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Active trips ── */}
        {activeTrips.length > 0 && (
          <div style={{ marginBottom: 32, animation: "fadeUp 0.5s ease" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#202124", marginBottom: 16 }}>Active trips</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activeTrips.map((trip: any) => {
                const sc = statusConfig[trip.status] || statusConfig.open;
                const StatusIcon = sc.icon;
                const fare = getFare(trip.area);
                return (
                  <div key={trip.id} style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Left icon */}
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: sc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <StatusIcon style={{ width: 20, height: 20, color: sc.color }} />
                    </div>

                    {/* Middle info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#202124" }}>
                          {trip.direction === "to" ? `${trip.area} → BLR` : `BLR → ${trip.area}`}
                        </span>
                        {trip.flight_number && (
                          <span style={{ fontSize: 12, color: "#80868B", background: "#F1F3F4", borderRadius: 6, padding: "2px 8px" }}>{trip.flight_number}</span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: "#5F6368" }}>
                        {formatDate(trip.travel_date)} · {formatTime(trip.flight_time)} · {trip.pax_count} pax · {trip.bag_count} bag{trip.bag_count !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Right: status + fare */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: sc.color, background: sc.bg, borderRadius: 8, padding: "4px 12px", marginBottom: 4 }}>
                        {sc.label}
                      </span>
                      {fare && (
                        <p style={{ fontSize: 12, color: "#1E8E3E", fontWeight: 600 }}>save ₹{fare.savings}</p>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); cancelTrip(trip.id); }}
                        style={{ fontSize: 11, color: "#D93025", background: "#FCE8E6", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600, marginTop: 4, fontFamily: "inherit" }}
                      >
                        Cancel
                      </button>
                    </div>
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
