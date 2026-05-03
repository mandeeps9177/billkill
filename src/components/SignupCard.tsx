"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { SITE } from "@/data/config";

export default function SignupCard() {
  const router = useRouter();
  const { signup, login } = useAuth();
  const [step, setStep] = useState<"phone" | "password" | "register">("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  const phoneClean = phone.replace(/\D/g, "").slice(0, 10);
  const phoneValid = phoneClean.length === 10;
  const phoneFormatted = phoneClean.replace(/(\d{5})(\d{5})/, "$1 $2");

  const handlePhoneNext = async () => {
    if (!phoneValid) { setError("Enter a valid 10-digit mobile number"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneClean }),
      });
      const data = await res.json();
      if (data.exists) { setUserName(data.name || ""); setStep("password"); }
      else { setStep("register"); }
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleLogin = async () => {
    if (password.length < 4) { setError("Enter your password"); return; }
    setError("");
    setLoading(true);
    try { await login(phoneClean, password); router.push("/dashboard"); }
    catch (err: any) { setError(err.message || "Wrong password"); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    if (name.trim().length < 2) { setError("Enter your full name"); return; }
    if (!agreed) { setError("Please accept the Terms & Conditions"); return; }
    setError("");
    setLoading(true);
    try { await signup(name.trim(), phoneClean, password); router.push("/book"); }
    catch (err: any) { setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = { width: "100%", border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const btnStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", background: "#202124", color: "#fff", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit" };
  const btnOffStyle: React.CSSProperties = { ...btnStyle, background: "#E8EAED", color: "#80868B", cursor: "default" };

  return (
    <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%" }}>

      {step === "phone" && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Get started</h2>
          <p style={{ fontSize: 14, color: "#5F6368", marginBottom: 20 }}>Enter your phone number to sign up or log in</p>

          <label style={{ fontSize: 13, fontWeight: 500, color: "#5F6368", display: "block", marginBottom: 6 }}>Mobile number</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", background: "#F8F9FA", fontWeight: 500, flexShrink: 0 }}>🇮🇳 +91</div>
            <input type="tel" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handlePhoneNext()} style={{ ...inputStyle, flex: 1 }} autoFocus />
          </div>

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handlePhoneNext} disabled={loading} style={phoneValid && !loading ? btnStyle : btnOffStyle}>
            {loading ? "Checking…" : "Continue →"}
          </button>

          <p style={{ fontSize: 11, color: "#BDC1C6", textAlign: "center", marginTop: 12 }}>{SITE.matchedCount} matched this month</p>
        </>
      )}

      {step === "password" && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 4 }}>
            Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}! 👋
          </h2>
          <p style={{ fontSize: 14, color: "#5F6368", marginBottom: 20 }}>Enter your password to sign in</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8F9FA", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 14 }}>📱</span>
            <span style={{ fontSize: 14, color: "#202124", fontWeight: 500 }}>+91 {phoneFormatted}</span>
            <button onClick={() => { setStep("phone"); setPassword(""); setError(""); }} style={{ marginLeft: "auto", fontSize: 12, color: "#1A73E8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Change</button>
          </div>

          <label style={{ fontSize: 13, fontWeight: 500, color: "#5F6368", display: "block", marginBottom: 6 }}>Password</label>
          <input type="password" placeholder="Your password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inputStyle, marginBottom: 20 }} autoFocus />

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading} style={password.length >= 4 && !loading ? btnStyle : btnOffStyle}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </>
      )}

      {step === "register" && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Create account</h2>
          <p style={{ fontSize: 14, color: "#5F6368", marginBottom: 20 }}>You're new! Set up in seconds.</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8F9FA", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 14 }}>📱</span>
            <span style={{ fontSize: 14, color: "#202124", fontWeight: 500 }}>+91 {phoneFormatted}</span>
            <button onClick={() => { setStep("phone"); setPassword(""); setName(""); setError(""); }} style={{ marginLeft: "auto", fontSize: 12, color: "#1A73E8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Change</button>
          </div>

          <label style={{ fontSize: 13, fontWeight: 500, color: "#5F6368", display: "block", marginBottom: 6 }}>Full name</label>
          <input type="text" placeholder="e.g. Priya Sharma" value={name} onChange={e => { setName(e.target.value); setError(""); }} style={{ ...inputStyle, marginBottom: 12 }} autoFocus />

          <label style={{ fontSize: 13, fontWeight: 500, color: "#5F6368", display: "block", marginBottom: 6 }}>Create a password</label>
          <input type="password" placeholder="At least 4 characters" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleRegister()} style={{ ...inputStyle, marginBottom: 12 }} />

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, cursor: "pointer" }}>
            <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }} style={{ marginTop: 3, width: 16, height: 16, cursor: "pointer", flexShrink: 0, accentColor: "#202124" }} />
            <span style={{ fontSize: 12, color: "#5F6368", lineHeight: 1.5 }}>
              I agree to the <Link href="/terms" target="_blank" style={{ color: "#1A73E8", textDecoration: "none", fontWeight: 500 }}>Terms</Link> and <Link href="/privacy" target="_blank" style={{ color: "#1A73E8", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link>.
            </span>
          </label>

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handleRegister} disabled={loading} style={name.trim().length >= 2 && password.length >= 4 && agreed && !loading ? btnStyle : btnOffStyle}>
            {loading ? "Creating…" : "Start sharing rides →"}
          </button>
        </>
      )}
    </div>
  );
}
