"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

const ADMIN_KEY = "billkill-admin-2026";

export default function AdminPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [activeTable, setActiveTable] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin?key=" + ADMIN_KEY);
      const data = await res.json();
      const filtered = (data.tables || []).filter((t: string) => !t.startsWith("_"));
      setTables(filtered);
      if (filtered.length > 0) { setActiveTable(filtered[0]); await fetchTable(filtered[0]); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const fetchTable = async (name: string) => {
    setLoading(true);
    setActiveTable(name);
    try {
      const res = await fetch("/api/admin?key=" + ADMIN_KEY + "&table=" + name);
      const data = await res.json();
      setRows(data.rows || []);
      setTotal(data.total || 0);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const statusColor = (val: string) => {
    const colors: Record<string, { color: string; bg: string }> = {
      open: { color: "#F9AB00", bg: "#FEF7E0" },
      proposed: { color: "#1A73E8", bg: "#E8F0FE" },
      matched: { color: "#1E8E3E", bg: "#E6F4EA" },
      confirmed: { color: "#1E8E3E", bg: "#E6F4EA" },
      expired: { color: "#80868B", bg: "#F1F3F4" },
      cancelled: { color: "#D93025", bg: "#FCE8E6" },
      rejected: { color: "#D93025", bg: "#FCE8E6" },
      pending: { color: "#F9AB00", bg: "#FEF7E0" },
      accepted: { color: "#1E8E3E", bg: "#E6F4EA" },
    };
    return colors[val] || null;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px 64px" }}>
        <div style={{ paddingTop: 16, marginBottom: 24, animation: "fadeUp 0.3s ease" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#202124", marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 14, color: "#80868B" }}>View and inspect your database tables</p>
        </div>

        {error && <p style={{ color: "#D93025", marginBottom: 16 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", animation: "fadeUp 0.35s ease" }}>
          {tables.map(t => (
            <button key={t} onClick={() => fetchTable(t)} style={{
              padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              border: activeTable === t ? "2px solid #202124" : "1px solid #DADCE0",
              background: activeTable === t ? "#202124" : "#fff",
              color: activeTable === t ? "#fff" : "#5F6368",
              cursor: "pointer", fontFamily: "inherit",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#80868B" }}>
            <strong style={{ color: "#202124" }}>{total}</strong> rows in <strong style={{ color: "#202124" }}>{activeTable}</strong>
          </span>
          <button onClick={() => fetchTable(activeTable)} style={{ fontSize: 12, color: "#1A73E8", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E8EAED", borderTopColor: "#1A73E8", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 16, color: "#80868B" }}>No data in this table yet</p>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid #E8EAED", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8F9FA" }}>
                    {columns.map(col => (
                      <th key={col} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#5F6368", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #E8EAED", whiteSpace: "nowrap" }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F1F3F4" }}>
                      {columns.map(col => {
                        const val = row[col];
                        const sc = typeof val === "string" ? statusColor(val) : null;
                        return (
                          <td key={col} style={{ padding: "10px 16px", color: "#202124", whiteSpace: "nowrap", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis" }}>
                            {sc ? (
                              <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, borderRadius: 6, padding: "3px 10px" }}>{val}</span>
                            ) : col === "password_hash" ? (
                              <span style={{ color: "#BDC1C6" }}>******</span>
                            ) : String(val ?? "—")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
