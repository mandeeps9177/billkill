"use client";

export default function SavingsCalc() {
  return (
    <div style={{ background: "#202124", borderRadius: 16, padding: "28px 32px", maxWidth: 480, width: "100%", color: "#fff" }}>
      <p style={{ fontSize: 13, color: "#80868B", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Share & save</p>
      <p style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Rides from just <span style={{ color: "#1E8E3E" }}>₹400</span></p>
      <p style={{ fontSize: 14, color: "#BDC1C6", lineHeight: 1.6 }}>
        Split your BLR airport cab with co-travellers on the same route. No surge pricing, no waiting — just a cheaper ride.
      </p>
    </div>
  );
}
