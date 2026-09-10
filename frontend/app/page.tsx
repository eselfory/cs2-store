"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const SmokeBackground = dynamic(() => import("@/components/SmokeBackground"), { ssr: false });

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleCatalogo = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => router.push("/catalogo"), 300);
      }
      setProgress(Math.min(p, 100));
    }, 80);
  }, [loading, router]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") handleCatalogo();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleCatalogo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6 + 0.1,
      });
    }

    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,120,50,${p.alpha})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,69,0,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#000", color: "#f0f0f0", fontFamily: "monospace", overflow: "hidden" }}>

      <SmokeBackground />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", zIndex: 2, pointerEvents: "none" }} />

      {/* Ticker */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10, background: "rgba(255,69,0,0.9)", color: "#000", fontSize: "11px", fontWeight: "bold", letterSpacing: "2px", overflow: "hidden", height: "24px", display: "flex", alignItems: "center" }}>
        <div style={{ whiteSpace: "nowrap", animation: "ticker 30s linear infinite" }}>
          &nbsp;&nbsp;ROUND STARTS IN&nbsp;&nbsp;-&nbsp;&nbsp;ENVÍOS A TODO ARG&nbsp;&nbsp;-&nbsp;&nbsp;IT'S US OR THEM&nbsp;&nbsp;-&nbsp;&nbsp;STATTRAK™ DROP 001&nbsp;&nbsp;-&nbsp;&nbsp;OFERTA EN TODO EL CATÁLOGO&nbsp;&nbsp;-&nbsp;&nbsp;ROUND STARTS IN&nbsp;&nbsp;-&nbsp;&nbsp;ENVÍOS A TODO ARG&nbsp;&nbsp;
        </div>
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: "24px", left: 0, width: "100%", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid rgba(255,69,0,0.2)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
        <span style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "3px" }}>
          Stat<span style={{ color: "#ff4500" }}>Trak</span>™
        </span>
        <div style={{ display: "flex", gap: "32px", fontSize: "12px", letterSpacing: "2px" }}>
          <Link href="/" style={{ color: "#f0f0f0", textDecoration: "none" }}>INICIO</Link>
          <Link href="/catalogo" style={{ color: "#f0f0f0", textDecoration: "none" }}>CATÁLOGO</Link>
          <Link href="/contacto" style={{ color: "#f0f0f0", textDecoration: "none" }}>CONTACTO</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
          <Link href="/auth" style={{ color: "#ff4500", textDecoration: "none", border: "1px solid #ff4500", padding: "6px 16px" }}>LOGIN</Link>
          <button style={{ background: "none", border: "1px solid #444", color: "#f0f0f0", padding: "6px 16px", cursor: "pointer", fontSize: "12px", letterSpacing: "1px" }}>
            [ CARRITO: 0 ]
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 3, minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 40px 60px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#ff4500", marginBottom: "24px" }}>
            StatTrak™ Apparel — Collection 001
          </div>
          <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "900", lineHeight: 1, marginBottom: "32px", fontFamily: "sans-serif" }}>
            <span style={{ display: "block" }}>"ERASE</span>
            <span style={{ display: "block" }}>ANY DOUBT</span>
            <span style={{ display: "block" }}>IN YOUR</span>
            <span style={{ display: "block", color: "#ff4500" }}>HEAD"</span>
            <span style={{ display: "block", fontSize: "0.5em", color: "#888", marginTop: "8px" }}>"IT'S US OR THEM."</span>
          </h1>
          <div style={{ display: "flex", gap: "16px", marginBottom: "40px", fontSize: "11px", letterSpacing: "3px" }}>
            <span style={{ background: "#ff4500", color: "#000", padding: "4px 12px", fontWeight: "bold" }}>DROP 001</span>
            <span style={{ border: "1px solid #ff4500", color: "#ff4500", padding: "4px 12px" }}>DISPONIBLE</span>
          </div>
          <button
            onClick={handleCatalogo}
            style={{ display: "inline-block", background: "#ff4500", color: "#000", padding: "16px 40px", fontWeight: "bold", letterSpacing: "3px", border: "none", fontSize: "13px", cursor: "pointer", fontFamily: "monospace", minWidth: "260px" }}
          >
            VER CATÁLOGO &nbsp;[E]
          </button>
          <div style={{ marginTop: "12px", fontSize: "10px", letterSpacing: "2px", color: "#444" }}>
            PRESIONÁ E PARA ENTRAR
          </div>
        </div>

        <div style={{ position: "absolute", right: "40px", bottom: "60px", textAlign: "right", fontSize: "11px", letterSpacing: "2px" }}>
          <div style={{ color: "#ff4500", marginBottom: "4px" }}>StatTrak™</div>
          <div style={{ color: "#666", marginBottom: "8px" }}>PRENDAS VENDIDAS</div>
          <div style={{ fontSize: "64px", fontWeight: "900", lineHeight: 1, fontFamily: "sans-serif" }}>247</div>
          <div style={{ color: "#444", fontSize: "10px" }}>BAJAS CONFIRMADAS</div>
        </div>
      </section>

      {/* Features */}
      <section style={{ position: "relative", zIndex: 3, padding: "80px 40px", borderTop: "1px solid rgba(255,69,0,0.2)", background: "rgba(0,0,0,0.6)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", maxWidth: "1200px", margin: "0 auto" }}>
          {[
            { key: "MATERIAL", val: "380GSM", w: 90 },
            { key: "PESO", val: "OVERSIZE", w: 75 },
            { key: "BORDADO", val: "FULL", w: 100 },
            { key: "WASHED", val: "VINTAGE", w: 85 },
            { key: "CS2 REF", val: "CONFIRMED", w: 100 },
          ].map((item) => (
            <div key={item.key}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", letterSpacing: "2px", marginBottom: "8px" }}>
                <span style={{ color: "#ff4500" }}>{item.key}</span>
                <span style={{ color: "#f0f0f0" }}>{item.val}</span>
              </div>
              <div style={{ height: "2px", background: "#111", width: "100%" }}>
                <div style={{ height: "100%", background: "#ff4500", width: `${item.w}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pantalla de carga */}
      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#000", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: "11px", letterSpacing: "6px", color: "#ff4500", marginBottom: "48px" }}>STATTRAK™ APPAREL</div>
          <div style={{ position: "relative", width: "80px", height: "80px", marginBottom: "48px" }}>
            <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "2px", background: "#ff4500", transform: "translateY(-50%)", animation: "pulse 0.8s ease-in-out infinite" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, height: "100%", width: "2px", background: "#ff4500", transform: "translateX(-50%)", animation: "pulse 0.8s ease-in-out infinite 0.4s" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "12px", height: "12px", background: "#ff4500", transform: "translate(-50%, -50%)", animation: "pulse 0.8s ease-in-out infinite" }} />
          </div>
          <div style={{ width: "300px", marginBottom: "16px" }}>
            <div style={{ height: "2px", background: "#111", width: "100%" }}>
              <div style={{ height: "100%", background: "#ff4500", width: `${progress}%`, transition: "width 0.08s linear", boxShadow: "0 0 8px #ff4500" }} />
            </div>
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#444" }}>CARGANDO... {Math.round(progress)}%</div>
          <div style={{ marginTop: "24px", fontSize: "10px", letterSpacing: "2px", color: "#222" }}>CONNECTING TO SERVER</div>
        </div>
      )}

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </main>
  );
}