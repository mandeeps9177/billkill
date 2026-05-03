"use client";
import { useState } from "react";
import { ROUTES } from "@/data/config";

export default function SavingsCalc() {
  const [sel, setSel] = useState(0);
  const r = ROUTES[sel];

  return (
    <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: 24, maxWidth: 480 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#5F6368", display: "block", marginBottom: 8 }}>Select your area</label>
      <select
        value={sel}
        onChange={e => setSel(Number(e.target.value))}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #DADCE0", fontSize: 15, color: "#202124", marginBottom: 16, fontFamily: "inherit" }}
      >
        {ROUTES.map((r, i) => (
          <option key={r.area} value={i}>{r.area}</option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, background: "#F8F9FA", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#80868B", marginBottom: 4 }}>Distance</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#202124" }}>{r.distance_km} km</p>
        </div>
        <div style={{ flex: 1, background: "#F8F9FA", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#80868B", marginBottom: 4 }}>Est. drive</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#202124" }}>~{r.drive_mins} min</p>
        </div>
      </div>
    </div>
  );
}
