import Link from "next/link";
import SavingsCalc from "@/components/SavingsCalc";
import SignupCard from "@/components/SignupCard";
import { ROUTES, SITE } from "@/data/config";

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
            *Fares are estimates based on splitting between 2–3 co-travellers on the same route. Actual fare depends on the number of riders matched and the taxi booked.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 24px", background: "#F8F9FA" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#202124", textAlign: "center", marginBottom: 8 }}>How it works</h2>
          <p style={{ fontSize: 16, color: "#5F6368", textAlign: "center", marginBottom: 48 }}>Three steps to a cheaper airport ride</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            {[
              { step: "1", title: "Sign up in 30 seconds", desc: "Google, LinkedIn, or phone number. We verify everyone so you know who you're riding with." },
              { step: "2", title: "Enter your flight details", desc: "Tell us your travel date, flight time, and pickup area. We handle the rest." },
              { step: "3", title: "Match, share, save", desc: "We find someone on the same route at the same time. Share the cab and split the bill." },
            ].map((item) => (
              <div key={item.step} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E8EAED" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F1F3F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#202124" }}>
                    {item.step}
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#202124", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#5F6368", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAVINGS TABLE */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#202124", textAlign: "center", marginBottom: 8 }}>What you save</h2>
          <p style={{ fontSize: 16, color: "#5F6368", textAlign: "center", marginBottom: 40 }}>Real fares for popular BLR routes</p>

          <div style={{ border: "1px solid #E8EAED", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F8F9FA" }}>
                  <th style={{ textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "#80868B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Route</th>
                  <th style={{ textAlign: "right", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "#80868B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Solo</th>
                  <th style={{ textAlign: "right", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "#80868B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Est. time</th>
                  <th style={{ textAlign: "right", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: "#80868B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Saved</th>
                </tr>
              </thead>
              <tbody>
                {ROUTES.map((r) => (
                  <tr key={r.area} style={{ borderTop: "1px solid #E8EAED" }}>
                    <td style={{ padding: "14px 20px", fontWeight: 500, color: "#202124" }}>{r.area}</td>
                    <td style={{ padding: "14px 20px", textAlign: "right", color: "#5F6368" }}>{r.distance_km} km</td><td style={{ padding: "14px 20px", textAlign: "right", color: "#5F6368" }}>~{r.drive_mins} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "#BDC1C6", textAlign: "center", marginTop: 12 }}>
            *Estimates based on average Ola/Uber pricing. Shared fare assumes a split between 2 riders. Actual fare varies based on the number of co-travellers matched and the taxi booked.
          </p>
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
