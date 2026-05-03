"use client";
import Link from "next/link";
import { SITE } from "@/data/config";

export default function SignupCard() {
  return (
    <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: 32, maxWidth: 420, width: "100%" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Ready to share your next ride?</h2>
      <p style={{ fontSize: 14, color: "#5F6368", marginBottom: 24, lineHeight: 1.6 }}>
        Join {SITE.matchedCount} travellers already saving on BLR airport cabs.
      </p>

      <Link href="/login" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: "100%", background: "#202124", color: "#fff", fontWeight: 600,
        padding: "14px 24px", borderRadius: 12, fontSize: 15, textDecoration: "none",
        fontFamily: "inherit",
      }}>
        Get started →
      </Link>

      <p style={{ fontSize: 12, color: "#BDC1C6", textAlign: "center", marginTop: 16 }}>
        Sign up in 30 seconds. No app download needed.
      </p>
    </div>
  );
}
