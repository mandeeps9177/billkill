"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Step = "phone" | "password" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { signup, login } = useAuth();
  const [step, setStep] = useState<Step>("phone");
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
      if (data.exists) {
        setUserName(data.name || "");
        setStep("password");
      } else {
        setStep("register");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (password.length < 4) { setError("Enter your password"); return; }
    setError("");
    setLoading(true);
    try {
      await login(phoneClean, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Wrong password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    if (name.trim().length < 2) { setError("Enter your full name"); return; }
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

  const s = {
    page: { minHeight: "100vh", background: "#F8F9FA", display: "flex", flexDirection: "column" as const, alignItems: "center" as const, justifyContent: "center" as const, padding: "40px 20px", fontFamily: "'Google Sans','Roboto',system-ui,sans-serif" },
    card: { background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420 },
    label: { display: "block" as const, fontSize: 13, fontWeight: 500, color: "#5F6368", marginBottom: 6 },
    input: { width: "100%", border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const },
    btn: { display: "flex", alignItems: "center" as const, justifyContent: "center" as const, gap: 8, width: "100%", background: "#202124", color: "#fff", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit" },
    btnOff: { display: "flex", alignItems: "center" as const, justifyContent: "center" as const, gap: 8, width: "100%", background: "#E8EAED", color: "#80868B", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "default", fontFamily: "inherit" },
  };

  return (
    <div style={s.page}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, background: "#202124", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>✈</div>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#202124" }}>bill<span style={{ color: "#1A73E8" }}>kill</span></span>
      </Link>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28, width: "100%", maxWidth: 420 }}>
        {["Phone", step === "register" ? "Create account" : "Sign in"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 600, flexShrink: 0,
                background: (step === "phone" && i === 0) || step !== "phone" ? "#202124" : "#E8EAED",
                color: (step === "phone" && i === 0) || step !== "phone" ? "#fff" : "#80868B",
              }}>
                {i === 0 && step !== "phone" ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: step === "phone" && i > 0 ? "#80868B" : "#202124", whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < 1 && <div style={{ flex: 1, height: 1, background: step !== "phone" ? "#202124" : "#E8EAED", margin: "0 10px" }} />}
          </div>
        ))}
      </div>

      {/* Step: Phone */}
      {step === "phone" && (
        <div style={s.card}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Welcome to Billkill</h1>
          <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>Enter your phone number to get started</p>

          <label style={s.label}>Mobile number</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", background: "#F8F9FA", fontWeight: 500, flexShrink: 0 }}>🇮🇳 +91</div>
            <input type="tel" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handlePhoneNext()} style={{ ...s.input, flex: 1 }} autoFocus />
          </div>

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handlePhoneNext} disabled={loading} style={phoneValid && !loading ? s.btn : s.btnOff}>
            {loading ? "Checking…" : "Continue →"}
          </button>
        </div>
      )}

      {/* Step: Password (existing user) */}
      {step === "password" && (
        <div style={s.card}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#202124", marginBottom: 4 }}>
            Welcome back{userName ? `, ${userName.split(" ")[0]}` : ""}! 👋
          </h1>
          <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>Enter your password to sign in</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8F9FA", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 14 }}>📱</span>
            <span style={{ fontSize: 14, color: "#202124", fontWeight: 500 }}>+91 {phoneFormatted}</span>
            <button onClick={() => { setStep("phone"); setPassword(""); setError(""); }} style={{ marginLeft: "auto", fontSize: 12, color: "#1A73E8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Change</button>
          </div>

          <label style={s.label}>Password</label>
          <input type="password" placeholder="Your password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...s.input, marginBottom: 20 }} autoFocus />

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading} style={password.length >= 4 && !loading ? s.btn : s.btnOff}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </div>
      )}

      {/* Step: Register (new user) */}
      {step === "register" && (
        <div style={s.card}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>You're new here! Set up your account in seconds.</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8F9FA", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 14 }}>📱</span>
            <span style={{ fontSize: 14, color: "#202124", fontWeight: 500 }}>+91 {phoneFormatted}</span>
            <button onClick={() => { setStep("phone"); setPassword(""); setName(""); setError(""); }} style={{ marginLeft: "auto", fontSize: 12, color: "#1A73E8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Change</button>
          </div>

          <label style={s.label}>Full name</label>
          <input type="text" placeholder="e.g. Priya Sharma" value={name} onChange={e => { setName(e.target.value); setError(""); }} style={{ ...s.input, marginBottom: 16 }} autoFocus />

          <label style={s.label}>Create a password</label>
          <input type="password" placeholder="At least 4 characters" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleRegister()} style={{ ...s.input, marginBottom: 16 }} />

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }}>
            <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }} style={{ marginTop: 3, width: 16, height: 16, cursor: "pointer", flexShrink: 0, accentColor: "#202124" }} />
            <span style={{ fontSize: 13, color: "#5F6368", lineHeight: 1.6 }}>
              I agree to the <Link href="/terms" target="_blank" style={{ color: "#1A73E8", textDecoration: "none", fontWeight: 500 }}>Terms & Conditions</Link> and <Link href="/privacy" target="_blank" style={{ color: "#1A73E8", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link>.
            </span>
          </label>

          {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

          <button onClick={handleRegister} disabled={loading} style={name.trim().length >= 2 && password.length >= 4 && agreed && !loading ? s.btn : s.btnOff}>
            {loading ? "Creating account…" : "Start sharing rides →"}
          </button>
        </div>
      )}
    </div>
  );
}
