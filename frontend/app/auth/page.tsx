"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#f0f0f0", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,69,0,0.03) 59px, rgba(255,69,0,0.03) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,69,0,0.03) 59px, rgba(255,69,0,0.03) 60px)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <Link href="/" style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "4px", textDecoration: "none", color: "#f0f0f0" }}>
            Stat<span style={{ color: "#ff4500" }}>Trak</span>™
          </Link>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#444", marginTop: "8px" }}>ACCESO AL SISTEMA</div>
        </div>

        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "40px" }}>
          <div style={{ display: "flex", marginBottom: "32px", borderBottom: "1px solid #1a1a1a" }}>
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, background: "none", border: "none",
                borderBottom: mode === m ? "2px solid #ff4500" : "2px solid transparent",
                color: mode === m ? "#ff4500" : "#444",
                padding: "12px", cursor: "pointer", fontSize: "11px",
                letterSpacing: "3px", fontFamily: "monospace"
              }}>
                {m === "login" ? "INGRESAR" : "REGISTRARSE"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {mode === "register" && (
              <div>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "8px" }}>USUARIO</div>
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="tu_usuario"
                  style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "12px 16px", fontSize: "13px", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "8px" }}>EMAIL</div>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="usuario@mail.com"
                style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "12px 16px", fontSize: "13px", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "8px" }}>CONTRASEÑA</div>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "12px 16px", fontSize: "13px", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }} />
            </div>

            {error && <div style={{ fontSize: "11px", color: "#ff4500", letterSpacing: "1px" }}>⚠ {error}</div>}

            <button onClick={handleSubmit} disabled={loading} style={{
              background: loading ? "#333" : "#ff4500", color: loading ? "#666" : "#000",
              border: "none", padding: "14px", fontSize: "12px", letterSpacing: "3px",
              fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontFamily: "monospace", marginTop: "8px"
            }}>
              {loading ? "CONECTANDO..." : mode === "login" ? "INGRESAR" : "CREAR CUENTA"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href="/" style={{ fontSize: "10px", letterSpacing: "3px", color: "#333", textDecoration: "none" }}>← VOLVER AL INICIO</Link>
        </div>
      </div>
    </main>
  );
}