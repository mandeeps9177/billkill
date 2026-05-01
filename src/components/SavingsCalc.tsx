"use client";
import { useState } from "react";
import { ROUTES } from "@/data/config";

export default function SavingsCalc() {
  const [sel, setSel] = useState(0);
  const r = ROUTES[sel];
  const savings = r.solo - r.shared;
  const pct = Math.round((savings / r.solo) * 100);

  return (
    <div style={{ border: "1px solid #E8EAED", borderRadius: 16, padding: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#80868B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Check your savings
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {ROUTES.map((route, i) => (
          <button
            key={route.area}
            onClick={() => setSel(i)}
            style={{
              fontSize: 12, padding: "5px 12px", borderRadius: 20,
              border: sel === i ? "1px solid #202124" : "1px solid #DADCE0",
              background: sel === i ? "#202124" : "transparent",
              color: sel === i ? "#fff" : "#5F6368",
              fontWeight: sel === i ? 600 : 400, cursor: "pointer",
            }}
          >
            {route.area}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 12, color: "#80868B", marginBottom: 4 }}>{r.area} → BLR Airport</p>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#202124" }}>₹{r.shared}</span>
          <span style={{ fontSize: 14, color: "#BDC1C6", textDecoration: "line-through", marginLeft: 8 }}>₹{r.solo}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A73E8" }}>
          Save ₹{savings} ({pct}%)
        </span>
      </div>
    </div>
  );
}
