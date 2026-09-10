"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const SmokeBackground = dynamic(() => import("@/components/SmokeBackground"), { ssr: false });

export default function Contacto() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 1.5 + 0.3, alpha: Math.random() * 0.5 + 0.1 });
    }
    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,120,50,${p.alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", handleResize); };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#f0f0f0", fontFamily: "monospace", overflow: "hidden" }}>
      <SmokeBackground />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", zIndex: 2, pointerEvents: "none" }} />

      {/* Ticker */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10, background: "rgba(255,69,0,0.9)", color: "#000", fontSize: "11px", fontWeight: "bold", letterSpacing: "2px", overflow: "hidden", height: "24px", display: "flex", alignItems: "center" }}>
        <div style={{ whiteSpace: "nowrap", animation: "ticker 30s linear infinite" }}>
          &nbsp;&nbsp;ROUND STARTS IN&nbsp;&nbsp;-&nbsp;&nbsp;ENVÍOS A TODO ARG&nbsp;&nbsp;-&nbsp;&nbsp;IT'S US OR THEM&nbsp;&nbsp;-&nbsp;&nbsp;STATTRAK™ DROP 001&nbsp;&nbsp;-&nbsp;&nbsp;OFERTA EN TODO EL CATÁLOGO&nbsp;&nbsp;-&nbsp;&nbsp;ROUND STARTS IN&nbsp;&nbsp;
        </div>
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: "24px", left: 0, width: "100%", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid rgba(255,69,0,0.2)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
        <Link href="/" style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "3px", textDecoration: "none", color: "#f0f0f0" }}>
          Stat<span style={{ color: "#ff4500" }}>Trak</span>™
        </Link>
        <div style={{ display: "flex", gap: "32px", fontSize: "12px", letterSpacing: "2px" }}>
          <Link href="/" style={{ color: "#f0f0f0", textDecoration: "none" }}>INICIO</Link>
          <Link href="/catalogo" style={{ color: "#f0f0f0", textDecoration: "none" }}>CATÁLOGO</Link>
          <Link href="/contacto" style={{ color: "#ff4500", textDecoration: "none" }}>CONTACTO</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
          <Link href="/auth" style={{ color: "#ff4500", textDecoration: "none", border: "1px solid #ff4500", padding: "6px 16px" }}>LOGIN</Link>
          <button style={{ background: "none", border: "1px solid #444", color: "#f0f0f0", padding: "6px 16px", cursor: "pointer", fontSize: "12px" }}>[ CARRITO: 0 ]</button>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ position: "relative", zIndex: 3, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 40px 60px" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>

          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#ff4500", marginBottom: "12px" }}>STATTRAK™ — SOPORTE</div>
            <h2 style={{ fontSize: "40px", fontWeight: "900", letterSpacing: "4px", fontFamily: "sans-serif", marginBottom: "8px" }}>CONTACTO</h2>
            <p style={{ fontSize: "11px", letterSpacing: "2px", color: "#666" }}>RESPONDEMOS POR REDES O MAIL</p>
          </div>

          {sent ? (
            <div style={{ background: "#0a0a0a", border: "1px solid #ff4500", padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px", color: "#ff4500" }}>✓</div>
              <div style={{ fontSize: "12px", letterSpacing: "4px", color: "#ff4500", marginBottom: "8px" }}>MENSAJE ENVIADO</div>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "24px" }}>Te respondemos a la brevedad.</div>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }} style={{ background: "none", border: "1px solid #333", color: "#666", padding: "10px 24px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace" }}>
                NUEVO MENSAJE
              </button>
            </div>
          ) : (
            <div style={{ background: "rgba(10,10,10,0.9)", border: "1px solid #1a1a1a", padding: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { label: "NOMBRE", key: "name", type: "text", placeholder: "Tu nombre" },
                  { label: "EMAIL", key: "email", type: "email", placeholder: "tu@mail.com" },
                  { label: "TELÉFONO", key: "phone", type: "tel", placeholder: "+54 11 1234-5678" },
                ].map((field) => (
                  <div key={field.key}>
                    <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "8px" }}>{field.label}</div>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "12px 16px", fontSize: "13px", fontFamily: "monospace", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}

                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "8px" }}>COMENTARIO</div>
                  <textarea
                    placeholder="Tu mensaje..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0f0f0", padding: "12px 16px", fontSize: "13px", fontFamily: "monospace", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ background: loading ? "#333" : "#ff4500", color: loading ? "#666" : "#000", border: "none", padding: "16px", fontSize: "12px", letterSpacing: "3px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontFamily: "monospace" }}
                >
                  {loading ? "ENVIANDO..." : "ENVIAR"}
                </button>

                <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="https://www.instagram.com/stattrak.arg/" target="_blank" rel="noopener" style={{ fontSize: "11px", letterSpacing: "2px", color: "#ff4500", textDecoration: "none", border: "1px solid rgba(255,69,0,0.4)", padding: "8px 16px" }}>INSTAGRAM</a>
                  <a href="https://www.tiktok.com/@stattrak.arg6" target="_blank" rel="noopener" style={{ fontSize: "11px", letterSpacing: "2px", color: "#ff4500", textDecoration: "none", border: "1px solid rgba(255,69,0,0.4)", padding: "8px 16px" }}>TIKTOK</a>
                  <a href="mailto:stattrak.arg@gmail.com" style={{ fontSize: "11px", letterSpacing: "2px", color: "#ff4500", textDecoration: "none", border: "1px solid rgba(255,69,0,0.4)", padding: "8px 16px" }}>GMAIL</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </main>
  );
}