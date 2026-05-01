"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "@/data/config";

export default function SignupCard() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = (val: string) => {
    // Only allow digits and spaces
    const cleaned = val.replace(/[^\d\s]/g, "");
    setPhone(cleaned);
    setError("");
  };

  const handleSubmit = () => {
    const digits = phone.replace(/\s/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    // Navigate to signup with phone pre-filled
    router.push(`/signup?phone=${digits}`);
  };

  const digits = phone.replace(/\s/g, "");
  const isValid = digits.length === 10;

  return (
    <div style={{ border: "1px solid #E8EAED", borderRadius: 16, padding: 28 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Get started</h2>
      <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>Enter your phone number to sign up or log in</p>

      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#5F6368", marginBottom: 6 }}>Mobile number</label>
      <div style={{ display: "flex", gap: 8, marginBottom: error ? 4 : 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", background: "#F8F9FA", fontWeight: 500 }}>
          🇮🇳 +91
        </div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="98765 43210"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          maxLength={12}
          style={{
            flex: 1,
            border: error ? "2px solid #D93025" : "1px solid #DADCE0",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 15,
            color: "#202124",
            outline: "none",
          }}
        />
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>
      )}

      {/* Digit counter */}
      <p style={{ fontSize: 11, color: isValid ? "#1E8E3E" : "#80868B", textAlign: "right", marginBottom: 12, marginTop: error ? 0 : -8 }}>
        {digits.length}/10 digits {isValid && "✓"}
      </p>

      <button
        onClick={handleSubmit}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%",
          background: isValid ? "#202124" : "#E8EAED",
          color: isValid ? "#fff" : "#80868B",
          fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15,
          border: "none", cursor: isValid ? "pointer" : "default",
          transition: "all 0.15s",
        }}
      >
        Send OTP →
      </button>

      <p style={{ fontSize: 12, color: "#80868B", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
        We'll send a 6-digit code to verify your number.<br />
        No password needed — ever.
      </p>

      <p style={{ fontSize: 11, color: "#BDC1C6", textAlign: "center", marginTop: 12 }}>
        By signing up you agree to our{" "}
        <a href="/terms" style={{ textDecoration: "underline", color: "#BDC1C6" }}>Terms</a> and{" "}
        <a href="/privacy" style={{ textDecoration: "underline", color: "#BDC1C6" }}>Privacy Policy</a>
      </p>

      {/* Social proof */}
      <div style={{ borderTop: "1px solid #E8EAED", marginTop: 16, paddingTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex" }}>
          {["PR", "AK", "SM", "VN"].map((init, i) => (
            <div key={i} style={{ width: 26, height: 26, borderRadius: "50%", background: "#F1F3F4", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#5F6368", marginLeft: i > 0 ? -8 : 0 }}>
              {init}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#5F6368" }}>
          <strong style={{ color: "#202124" }}>{SITE.matchedCount}</strong> matched this month
        </p>
      </div>
    </div>
  );
}
