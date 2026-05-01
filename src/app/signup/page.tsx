"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneClean = phone.replace(/\D/g, "").slice(0, 10);
  const phoneValid = phoneClean.length === 10;

  const handlePhoneNext = () => {
    if (!phoneValid) { setError("Enter a valid 10-digit mobile number"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    setError("");
    setStep(2);
  };

  const handleFinish = async () => {
    if (name.trim().length < 2) { setError("Please enter your full name"); return; }
    if (!agreed) { setError("Please accept the Terms & Conditions"); return; }
    setError("");
    setLoading(true);
    try {
      await signup(name.trim(), phoneClean, password);
      router.push("/book");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", background: "#F8F9FA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Google Sans','Roboto',system-ui,sans-serif" },
    card: { background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: 32, width: "100%", maxWidth: 440 },
    label: { display: "block", fontSize: 13, fontWeight: 500, color: "#5F6368", marginBottom: 6 },
    input: { width: "100%", border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", outline: "none", fontFamily: "inherit" },
    btn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#202124", color: "#fff", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit" },
    btnOff: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#E8EAED", color: "#80868B", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "default", fontFamily: "inherit" },
  };

  return (
    <div style={s.page}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, background: "#202124", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>✈</div>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#202124" }}>bill<span style={{ color: "#1A73E8" }}>kill</span></span>
      </Link>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28, width: "100%", maxWidth: 440 }}>
        {["Phone & password", "Your profile"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0, background: step >= i + 1 ? "#202124" : "#E8EAED", color: step >= i + 1 ? "#fff" : "#80868B" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: step === i + 1 ? "#202124" : "#80868B", whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < 1 && <div style={{ flex: 1, height: 1, background: step > 1 ? "#202124" : "#E8EAED", margin: "0 10px" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={s.card}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>Enter your phone number and a password</p>

          <label style={s.label}>Mobile number</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", background: "#F8F9FA", fontWeight: 500, flexShrink: 0 }}>🇮🇳 +91</div>
            <input type="tel" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handlePhoneNext()} style={{ ...s.input, flex: 1 }} autoFocus />
          </div>

          <label style={s.label}>Password</label>
          <input type="password" placeholder="At least 4 characters" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handlePhoneNext()} style={{ ...s.input, marginBottom: 20 }} />

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handlePhoneNext} style={phoneValid && password.length >= 4 ? s.btn : s.btnOff}>
            Continue →
          </button>

          <p style={{ fontSize: 12, color: "#5F6368", textAlign: "center", marginTop: 20 }}>
            Already have an account? <Link href="/login" style={{ color: "#1A73E8", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      )}

      {step === 2 && (
        <div style={s.card}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Almost done!</h1>
          <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>Your name is shown to your co-traveller when matched</p>

          <label style={s.label}>Full name</label>
          <input type="text" placeholder="e.g. Priya Sharma" value={name} onChange={e => { setName(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleFinish()} style={{ ...s.input, marginBottom: 16 }} autoFocus />

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }}>
            <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }} style={{ marginTop: 3, width: 16, height: 16, cursor: "pointer", flexShrink: 0, accentColor: "#202124" }} />
            <span style={{ fontSize: 13, color: "#5F6368", lineHeight: 1.6 }}>
              I agree to the <Link href="/terms" target="_blank" style={{ color: "#1A73E8", textDecoration: "none", fontWeight: 500 }}>Terms & Conditions</Link> and <Link href="/privacy" target="_blank" style={{ color: "#1A73E8", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link>.
            </span>
          </label>

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handleFinish} disabled={loading} style={name.trim().length >= 2 && agreed ? s.btn : s.btnOff}>
            {loading ? "Creating account…" : "Start saving →"}
          </button>

          <p style={{ fontSize: 12, color: "#BDC1C6", textAlign: "center", marginTop: 16 }}>
            Signing up as +91 {phoneClean}
          </p>
        </div>
      )}
    </div>
  );
}
