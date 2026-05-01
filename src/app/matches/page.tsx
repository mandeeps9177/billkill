"use client";
import { useState } from "react";
import { Check, X, Plane, MapPin, Clock, Star, Shield, ChevronRight, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const mockMatches = [
  {
    id: 1, score: 94, name: "Rahul M.", role: "Senior Engineer", company: "Infosys",
    rating: 4.8, trips: 12, verified: true, matchDate: "Jan 15, 2025",
    flight: "6E 2341", time: "07:45 AM", direction: "to", area: "Whitefield",
    saving: 460, sharedFare: 380, status: "pending"
  },
  {
    id: 2, score: 87, name: "Divya S.", role: "Product Designer", company: "Swiggy",
    rating: 5.0, trips: 7, verified: true, matchDate: "Jan 15, 2025",
    flight: "AI 504", time: "08:20 AM", direction: "to", area: "Koramangala",
    saving: 390, sharedFare: 420, status: "pending"
  },
];

const pastMatches = [
  { id: 3, name: "Kiran P.", role: "Data Analyst", company: "Amazon", status: "completed", saving: 510, date: "Dec 22, 2024" },
  { id: 4, name: "Ananya R.", role: "Consultant", company: "Deloitte", status: "completed", saving: 380, date: "Dec 10, 2024" },
];

function MatchCard({ match, onAccept, onReject }: { match: typeof mockMatches[0], onAccept: () => void, onReject: () => void }) {
  return (
    <div className="md-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Match score banner */}
      <div style={{ background: "var(--md-primary)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>Match score</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ height: 6, width: 120, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${match.score}%`, background: "white", borderRadius: 3 }} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "white" }}>{match.score}%</span>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Profile */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--md-primary-container)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--md-primary)", flexShrink: 0 }}>
            {match.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: "var(--md-on-surface)" }}>{match.name}</span>
              {match.verified && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--md-secondary-container)", borderRadius: "var(--radius-full)", padding: "2px 8px" }}>
                  <Shield size={11} color="var(--md-secondary)" />
                  <span style={{ fontSize: 11, fontWeight: 500, color: "var(--md-on-secondary-container)" }}>Verified</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: 14, color: "var(--md-on-surface-variant)", marginBottom: 4 }}>{match.role} · {match.company}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={12} fill="#FBBF24" color="#FBBF24" />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--md-on-surface)" }}>{match.rating}</span>
              <span style={{ fontSize: 13, color: "var(--md-on-surface-variant)" }}>· {match.trips} trips</span>
            </div>
          </div>
        </div>

        {/* Trip details */}
        <div style={{ background: "var(--md-surface-variant)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Plane size={14} color="var(--md-primary)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, color: "var(--md-on-surface-variant)", fontWeight: 500, marginBottom: 2 }}>FLIGHT</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--md-on-surface)" }}>{match.flight}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Clock size={14} color="var(--md-primary)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, color: "var(--md-on-surface-variant)", fontWeight: 500, marginBottom: 2 }}>DEPARTS</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--md-on-surface)" }}>{match.time}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <MapPin size={14} color="var(--md-primary)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, color: "var(--md-on-surface-variant)", fontWeight: 500, marginBottom: 2 }}>PICKUP AREA</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--md-on-surface)" }}>{match.area}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <MapPin size={14} color="var(--md-secondary)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 11, color: "var(--md-on-surface-variant)", fontWeight: 500, marginBottom: 2 }}>DROP</p>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--md-on-surface)" }}>BLR Airport</p>
              </div>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div style={{ background: "var(--md-secondary-container)", borderRadius: "var(--radius-md)", padding: "12px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "var(--md-on-secondary-container)", fontWeight: 500, marginBottom: 4 }}>YOUR SHARE</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--md-on-secondary-container)" }}>₹{match.sharedFare}</p>
          </div>
          <div style={{ background: "var(--md-primary-container)", borderRadius: "var(--radius-md)", padding: "12px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "var(--md-on-primary-container)", fontWeight: 500, marginBottom: 4 }}>YOU SAVE</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--md-primary)" }}>₹{match.saving}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onReject} className="btn-outlined" style={{ flex: 1, justifyContent: "center", padding: "12px", color: "var(--md-error)", borderColor: "var(--md-error)" }}>
            <X size={16} /> Decline
          </button>
          <button onClick={onAccept} className="btn-primary" style={{ flex: 2, justifyContent: "center", padding: "12px", background: "var(--md-secondary)" }}>
            <Check size={16} /> Accept match
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  const [matches, setMatches] = useState(mockMatches);
  const [accepted, setAccepted] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const pending = matches.filter(m => !accepted.includes(m.id) && !rejected.includes(m.id));

  return (
    <div style={{ minHeight: "100vh", background: "var(--md-surface)" }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "var(--md-on-surface)", marginBottom: 8 }}>My matches</h1>
            <p style={{ fontSize: 15, color: "var(--md-on-surface-variant)" }}>Review and respond to your ride matches.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--md-primary-container)", borderRadius: "var(--radius-full)", padding: "8px 16px" }}>
            <Bell size={16} color="var(--md-primary)" />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, color: "var(--md-on-primary-container)" }}>{pending.length} pending</span>
          </div>
        </div>

        {accepted.length > 0 && (
          <div style={{ background: "var(--md-secondary-container)", borderRadius: "var(--radius-lg)", padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <Check size={20} color="var(--md-secondary)" />
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--md-on-secondary-container)" }}>Match accepted!</p>
              <p style={{ fontSize: 13, color: "var(--md-on-secondary-container)", opacity: 0.8 }}>We're notifying your co-traveller. Confirmation once they accept.</p>
            </div>
          </div>
        )}

        {pending.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 40 }}>
            {pending.map(m => (
              <MatchCard key={m.id} match={m}
                onAccept={() => setAccepted(a => [...a, m.id])}
                onReject={() => setRejected(r => [...r, m.id])} />
            ))}
          </div>
        ) : (
          <div className="md-card" style={{ padding: 40, textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--md-surface-variant)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Plane size={28} color="var(--md-on-surface-variant)" />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--md-on-surface)", marginBottom: 8 }}>You're in the pool</h3>
            <p style={{ fontSize: 14, color: "var(--md-on-surface-variant)", marginBottom: 20, lineHeight: 1.6 }}>
              No pending matches right now. We'll notify you the moment we find a match.
            </p>
            <Link href="/book" className="btn-tonal" style={{ textDecoration: "none" }}>
              Add another trip <ChevronRight size={15} />
            </Link>
          </div>
        )}

        {/* Past matches */}
        <div>
          <p className="label-sm" style={{ marginBottom: 16 }}>Past rides</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pastMatches.map(m => (
              <div key={m.id} className="md-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--md-surface-variant)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--md-on-surface-variant)" }}>{m.name[0]}</div>
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--md-on-surface)" }}>{m.name}</p>
                    <p style={{ fontSize: 13, color: "var(--md-on-surface-variant)" }}>{m.role} · {m.company} · {m.date}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--md-secondary)" }}>₹{m.saving} saved</p>
                  <div style={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: 4 }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#FBBF24" color="#FBBF24" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
