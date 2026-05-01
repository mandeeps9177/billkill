"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneClean = phone.replace(/\D/g, "").slice(0, 10);
  const phoneValid = phoneClean.length === 10;

  const handleLogin = async () => {
    if (!phoneValid) { setError("Enter a valid 10-digit mobile number"); return; }
    if (password.length < 4) { setError("Enter your password"); return; }
    setError("");
    setLoading(true);
    try {
      await login(phoneClean, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid phone or password");
    } finally {
      setLoading(false);
    }
  };

  const s: Record<string, React.CSSProperties> = {
    input: { width: "100%", border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", outline: "none", fontFamily: "inherit" },
    btn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#202124", color: "#fff", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "pointer", fontFamily: "inherit" },
    btnOff: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#E8EAED", color: "#80868B", fontWeight: 600, padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", cursor: "default", fontFamily: "inherit" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Google Sans','Roboto',system-ui,sans-serif" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, background: "#202124", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>✈</div>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#202124" }}>bill<span style={{ color: "#1A73E8" }}>kill</span></span>
      </Link>

      <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: "#80868B", marginBottom: 24 }}>Sign in with your phone number</p>

        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#5F6368", marginBottom: 6 }}>Mobile number</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid #DADCE0", borderRadius: 12, padding: "12px 14px", fontSize: 15, color: "#202124", background: "#F8F9FA", fontWeight: 500, flexShrink: 0 }}>🇮🇳 +91</div>
          <input type="tel" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} style={{ ...s.input, flex: 1 }} autoFocus />
        </div>

        <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#5F6368", marginBottom: 6 }}>Password</label>
        <input type="password" placeholder="Your password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...s.input, marginBottom: 20 }} />

        {error && <p style={{ fontSize: 12, color: "#D93025", marginBottom: 12 }}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={phoneValid && password.length >= 4 ? s.btn : s.btnOff}>
          {loading ? "Signing in…" : "Sign in →"}
        </button>

        <p style={{ fontSize: 13, color: "#5F6368", textAlign: "center", marginTop: 20 }}>
          New to Billkill? <Link href="/signup" style={{ color: "#1A73E8", fontWeight: 500, textDecoration: "none" }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
