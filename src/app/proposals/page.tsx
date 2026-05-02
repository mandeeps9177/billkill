"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import { ROUTES } from "@/data/config";
import { Clock, MapPin, Plane, Users, ArrowRight, Check, X } from "lucide-react";

export default function ProposalsPage() {
  const router = useRouter();
  const { user, loading: authLoading, apiFetch } = useAuth();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) fetchProposals();
  }, [authLoading, user]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/proposals");
      const data = await res.json();
      setProposals(data.proposals || []);
      if (data.proposals?.length > 0 && !selectedId) {
        setSelectedId(data.proposals[0].id);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (proposalId: number, response: "accepted" | "rejected") => {
    setActionLoading(proposalId);
    try {
      const res = await apiFetch("/api/proposals", {
        method: "PATCH",
        body: JSON.stringify({ proposal_id: proposalId, response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchProposals();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally { setActionLoading(null); }
  };

  const getFare = (area: string) => {
    const r = ROUTES.find(r => r.area === area);
    return r ? { solo: r.solo, shared: r.shared, savings: r.solo - r.shared, pct: Math.round(((r.solo - r.shared) / r.solo) * 100) } : null;
  };

  const formatDate = (d: string) => {
    try { return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
    catch { return d; }
  };

  const formatTime = (t: string) => {
    try { const [h, m] = t.split(":"); const hr = parseInt(h); return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? "PM" : "AM"}`; }
    catch { return t; }
  };

  const selected = proposals.find(p => p.id === selectedId);

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
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slideRight { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 20px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, paddingTop: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#202124" }}>Match proposals</h1>
            <p style={{ fontSize: 14, color: "#80868B" }}>
              {proposals.length > 0 ? `${proposals.length} co-traveller${proposals.length > 1 ? "s" : ""} want to share your ride` : "No proposals yet"}
            </p>
          </div>
          <Link href="/dashboard" style={{ fontSize: 13, color: "#5F6368", textDecoration: "none", fontWeight: 500, padding: "8px 16px", border: "1px solid #DADCE0", borderRadius: 10, background: "#fff" }}>
            ← Dashboard
          </Link>
        </div>

        {proposals.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 20, padding: "56px 24px", textAlign: "center", animation: "fadeUp 0.4s ease" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E8F0FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>🔍</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#202124", marginBottom: 6 }}>No match proposals</h2>
            <p style={{ fontSize: 14, color: "#80868B", maxWidth: 300, margin: "0 auto 24px", lineHeight: 1.6 }}>
              We're scanning for co-travellers on your route. You'll see proposals here once we find a match.
            </p>
            <Link href="/dashboard" style={{ fontSize: 14, color: "#1A73E8", textDecoration: "none", fontWeight: 600 }}>Back to dashboard →</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, alignItems: "start", animation: "fadeUp 0.4s ease" }}>
            {/* Left: proposal list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {proposals.map((p: any) => {
                const isActive = p.id === selectedId;
                const fare = getFare(p.my_area);
                const initials = p.other_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 16, border: isActive ? "2px solid #1A73E8" : "1px solid #E8EAED",
                      background: isActive ? "#E8F0FE" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: isActive ? "#1A73E8" : "#E8EAED", display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? "#fff" : "#5F6368", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#202124", marginBottom: 2 }}>{p.other_name}</p>
                      <p style={{ fontSize: 12, color: "#80868B" }}>{p.other_area} · {formatTime(p.other_flight_time)}</p>
                    </div>
                    {fare && <span style={{ fontSize: 13, fontWeight: 700, color: "#1E8E3E", flexShrink: 0 }}>-₹{fare.savings}</span>}
                  </button>
                );
              })}
            </div>

            {/* Right: selected proposal detail */}
            {selected && (() => {
              const fare = getFare(selected.my_area);
              const initials = selected.other_name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
              return (
                <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 20, overflow: "hidden", animation: "slideRight 0.3s ease" }} key={selected.id}>
                  {/* Header */}
                  <div style={{ background: "linear-gradient(135deg, #1A73E8, #1558B0)", padding: "28px 28px 24px", color: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, border: "2px solid rgba(255,255,255,0.4)" }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ fontSize: 20, fontWeight: 700 }}>{selected.other_name}</p>
                        <p style={{ fontSize: 13, opacity: 0.8 }}>wants to share your ride</p>
                      </div>
                    </div>

                    {/* Route visualization */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 18px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", border: "3px solid rgba(255,255,255,0.5)" }} />
                        <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#202124", border: "3px solid rgba(255,255,255,0.5)" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontSize: 11, opacity: 0.6 }}>PICKUP</p>
                          <p style={{ fontSize: 15, fontWeight: 600 }}>{selected.other_area}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 11, opacity: 0.6 }}>DROP</p>
                          <p style={{ fontSize: 15, fontWeight: 600 }}>BLR Airport · {selected.terminal?.split("—")[0]?.trim()}</p>
                        </div>
                      </div>
                      <ArrowRight style={{ width: 20, height: 20, opacity: 0.5 }} />
                    </div>
                  </div>

                  {/* Details grid */}
                  <div style={{ padding: "24px 28px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                      {[
                        { icon: "📅", label: "Travel date", val: formatDate(selected.travel_date) },
                        { icon: "🕐", label: "Their flight time", val: formatTime(selected.other_flight_time) },
                        { icon: "✈️", label: "Your flight time", val: formatTime(selected.my_flight_time) },
                        { icon: "👥", label: "Their group size", val: `${selected.other_pax} traveller${selected.other_pax > 1 ? "s" : ""}` },
                      ].map(d => (
                        <div key={d.label} style={{ background: "#F8F9FA", borderRadius: 12, padding: "14px 16px" }}>
                          <p style={{ fontSize: 11, color: "#80868B", marginBottom: 4 }}>{d.icon} {d.label}</p>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>{d.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Savings breakdown */}
                    {fare && (
                      <div style={{ background: "#F8F9FA", borderRadius: 16, padding: "20px 22px", marginBottom: 24 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#80868B", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Fare breakdown</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontSize: 14, color: "#5F6368" }}>Solo cab (Ola/Uber)</span>
                          <span style={{ fontSize: 14, color: "#5F6368", textDecoration: "line-through" }}>₹{fare.solo}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontSize: 14, color: "#5F6368" }}>Shared with Billkill</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>₹{fare.shared}</span>
                        </div>
                        <div style={{ borderTop: "1px solid #E8EAED", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#1E8E3E" }}>You save</span>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#1E8E3E" }}>₹{fare.savings} ({fare.pct}%)</span>
                        </div>
                      </div>
                    )}

                    {/* Trip link */}
                    <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#1A73E8", textDecoration: "none", fontWeight: 500, marginBottom: 24 }}>
                      <Plane style={{ width: 14, height: 14 }} /> View linked trip request →
                    </Link>

                    {/* Actions */}
                    {selected.my_response === "pending" ? (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => handleAction(selected.id, "accepted")}
                          disabled={actionLoading === selected.id}
                          style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1E8E3E", color: "#fff", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "transform 0.15s" }}
                        >
                          <Check style={{ width: 18, height: 18 }} />
                          {actionLoading === selected.id ? "Accepting…" : "Accept match"}
                        </button>
                        <button
                          onClick={() => handleAction(selected.id, "rejected")}
                          disabled={actionLoading === selected.id}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#fff", color: "#D93025", fontWeight: 600, padding: "14px 16px", borderRadius: 12, fontSize: 15, border: "1px solid #DADCE0", cursor: "pointer", fontFamily: "inherit" }}
                        >
                          <X style={{ width: 16, height: 16 }} /> Decline
                        </button>
                      </div>
                    ) : selected.my_response === "accepted" && selected.other_response === "pending" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FEF7E0", borderRadius: 14, padding: "16px 20px" }}>
                        <Clock style={{ width: 18, height: 18, color: "#F9AB00" }} />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>You accepted!</p>
                          <p style={{ fontSize: 13, color: "#5F6368" }}>Waiting for {selected.other_name.split(" ")[0]} to confirm…</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
