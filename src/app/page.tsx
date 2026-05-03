import Link from "next/link";
import SavingsCalc from "@/components/SavingsCalc";
import SignupCard from "@/components/SignupCard";
import { SITE } from "@/data/config";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Google Sans', 'Roboto', system-ui, sans-serif" }}>

      {/* HERO */}
      <section style={{ borderBottom: "1px solid #E8EAED" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, background: "#202124", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>
                ✈
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#202124" }}>
                bill<span style={{ color: "#1A73E8" }}>kill</span>
              </span>
            </div>
            <Link href="/login" style={{ fontSize: 14, color: "#5F6368", textDecoration: "none" }}>
              Sign in
            </Link>
          </nav>

          {/* Two column hero */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>

            {/* Left */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#80868B", marginBottom: 12 }}>
                BLR Airport · Bengaluru
              </p>
              <h1 style={{ fontSize: 48, fontWeight: 800, color: "#202124", lineHeight: 1.08, marginBottom: 16, letterSpacing: -1 }}>
                {SITE.heroPrice}
              </h1>
              <p style={{ fontSize: 18, color: "#5F6368", lineHeight: 1.6, marginBottom: 28, maxWidth: 440 }}>
                {SITE.heroSubtext}
              </p>
              <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#5F6368", marginBottom: 32 }}>
                <span>✓ LinkedIn verified</span>
                <span>✓ Phone OTP</span>
                <span>✓ Free to join</span>
              </div>

              <SavingsCalc />
            </div>

            {/* Right — signup */}
            <SignupCard />
          </div>

          {/* Asterisk disclaimer */}
          <p style={{ fontSize: 11, color: "#BDC1C6", marginTop: 16, maxWidth: 500 }}>
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — ANIMATED TRIP */}
        <section style={{ padding: "80px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#202124", textAlign: "center", marginBottom: 8 }}>How it works</h2>
            <p style={{ fontSize: 16, color: "#5F6368", textAlign: "center", marginBottom: 48 }}>Three steps to share your airport ride</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 48 }}>
              {[
                { step: "1", icon: "📍", title: "Book your trip", desc: "Enter your area, flight date, and time. Takes 30 seconds." },
                { step: "2", icon: "🤝", title: "Get matched", desc: "We find co-travellers heading to the airport around the same time." },
                { step: "3", icon: "🚗", title: "Share the ride", desc: "Coordinate pickup, split the cab, and save on your airport trip." },
              ].map((s) => (
                <div key={s.step} style={{ textAlign: "center", padding: "32px 20px" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>{s.icon}</div>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#202124", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, margin: "0 auto 12px" }}>{s.step}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#202124", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#5F6368", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Animated trip card */}
            <div style={{ background: "#F8F9FA", borderRadius: 20, padding: "32px", overflow: "hidden", position: "relative" }}>
              <style>{`
                @keyframes carMove { 0% { transform: translateX(0); } 50% { transform: translateX(calc(100% - 40px)); } 100% { transform: translateX(0); } }
                @keyframes pulse2 { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.2); opacity:0.7; } }
                @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
              `}</style>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1A73E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22 }}>🚕</span>
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#202124" }}>Koramangala → BLR Airport</p>
                  <p style={{ fontSize: 13, color: "#80868B" }}>Tomorrow, 6:30 AM · 2 co-travellers matched</p>
                </div>
              </div>

              {/* Route line */}
              <div style={{ position: "relative", height: 60, marginBottom: 24 }}>
                <div style={{ position: "absolute", top: 28, left: 24, right: 24, height: 4, background: "#E8EAED", borderRadius: 2 }} />
                <div style={{ position: "absolute", top: 28, left: 24, width: "60%", height: 4, background: "linear-gradient(90deg, #1A73E8, #1E8E3E)", borderRadius: 2 }} />
                {/* Car */}
                <div style={{ position: "absolute", top: 14, left: 24, right: 24 }}>
                  <div style={{ fontSize: 24, animation: "carMove 4s ease-in-out infinite" }}>🚗</div>
                </div>
                {/* Start dot */}
                <div style={{ position: "absolute", top: 24, left: 16, width: 12, height: 12, borderRadius: "50%", background: "#1A73E8", border: "3px solid #E8F0FE" }} />
                {/* End dot */}
                <div style={{ position: "absolute", top: 24, right: 16, width: 12, height: 12, borderRadius: "50%", background: "#1E8E3E", border: "3px solid #E6F4EA" }} />
                {/* Labels */}
                <p style={{ position: "absolute", bottom: 0, left: 0, fontSize: 11, color: "#5F6368", fontWeight: 600 }}>Koramangala</p>
                <p style={{ position: "absolute", bottom: 0, right: 0, fontSize: 11, color: "#5F6368", fontWeight: 600 }}>BLR Airport</p>
              </div>

              {/* Matched travellers */}
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { name: "Priya S.", time: "6:30 AM", flight: "6E-204" },
                  { name: "Arjun R.", time: "7:00 AM", flight: "AI-501" },
                ].map((t, i) => (
                  <div key={t.name} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #E8EAED", animation: `fadeInUp 0.5s ease ${i * 0.2}s both` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "#1A73E8" : "#1E8E3E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                        {t.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>{t.name}</p>
                        <p style={{ fontSize: 11, color: "#80868B" }}>{t.flight}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#5F6368" }}>✈️ Flight at {t.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* TRUST */}
      <section style={{ padding: "80px 24px", background: "#F8F9FA" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#202124", textAlign: "center", marginBottom: 8 }}>Ride with confidence</h2>
          <p style={{ fontSize: 16, color: "#5F6368", textAlign: "center", marginBottom: 48 }}>Every rider is verified before they can match</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {[
              { icon: "🛡️", title: "LinkedIn verified", desc: "See your co-rider's name, company, and role before accepting." },
              { icon: "📱", title: "Phone OTP mandatory", desc: "Every account tied to a verified Indian mobile. No fake profiles." },
              { icon: "⏱️", title: "No pressure to accept", desc: "Review your match for 2 hours. Decline freely — we'll find another." },
            ].map((item) => (
              <div key={item.title} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8EAED" }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#202124", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#5F6368", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", background: "#fff", borderTop: "1px solid #E8EAED" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#202124", marginBottom: 12 }}>
            {SITE.ctaText}
          </h2>
          <p style={{ fontSize: 16, color: "#5F6368", marginBottom: 28 }}>
            {SITE.ctaSubtext}
          </p>
          <Link
            href="/signup"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#202124", color: "#fff", fontWeight: 600, padding: "16px 32px", borderRadius: 12, fontSize: 16, textDecoration: "none" }}
          >
            Start saving now →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #E8EAED", padding: "40px 24px", background: "#F8F9FA" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, background: "#202124", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10 }}>✈</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#202124" }}>bill<span style={{ color: "#1A73E8" }}>kill</span></span>
            </div>
            <p style={{ fontSize: 12, color: "#80868B" }}>Share your BLR airport ride with verified co-travellers.</p>
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/terms" style={{ color: "#5F6368", textDecoration: "none" }}>Terms</Link>
              <Link href="/privacy" style={{ color: "#5F6368", textDecoration: "none" }}>Privacy</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/signup" style={{ color: "#5F6368", textDecoration: "none" }}>Sign up</Link>
              <Link href="/login" style={{ color: "#5F6368", textDecoration: "none" }}>Login</Link>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", borderTop: "1px solid #DADCE0", marginTop: 32, paddingTop: 20, fontSize: 12, color: "#BDC1C6" }}>
          {SITE.copyright}
        </div>
      </footer>
    </div>
  );
}
