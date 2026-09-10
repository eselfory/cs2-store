"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const SmokeBackground = dynamic(() => import("@/components/SmokeBackground"), { ssr: false });

const SECTIONS = [
  { id: "all", label: "TODO" },
  { id: "remeras", label: "REMERAS" },
  { id: "buzos", label: "BUZOS" },
  { id: "gorras", label: "GORRAS" },
  { id: "tazas", label: "TAZAS" },
  { id: "mousepads", label: "MOUSEPADS" },
];

const PRODUCTS = [
  { id: "r1", name: "Remera Overpass", slug: "remera-overpass", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "OVERPASS", color: "NEGRO", images: ["/assets/remera-overpass-frente.png", "/assets/remera-overpass-dorso.png"], extra: ["negro", "cyan"] },
  { id: "r2", name: "Remera Ancient", slug: "remera-ancient", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "ANCIENT", color: "BLANCO", images: ["/assets/remera-ancient-frente.png", "/assets/remera-ancient-dorso.png"], extra: ["blanco", "rojo-naranja"] },
  { id: "r3", name: "Remera Printstream", slug: "remera-printstream", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "BLANCO", images: ["/assets/remera-printstream-frente.png", "/assets/remera-printstream-dorso.png"], extra: ["blanco", "rosa"] },
  { id: "r4", name: "Remera Handle W/ Care", slug: "remera-handle", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "NUKE", color: "BLANCO", images: ["/assets/remera-handle-frente.png", "/assets/remera-handle-dorso.png"], extra: ["blanco", "negro"] },
  { id: "r5", name: "Remera Bingo Bango", slug: "remera-bingo", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "BLANCO", images: ["/assets/remera-bingo-frente.png", "/assets/remera-bingo-dorso.png"], extra: ["blanco", "negro", "rosa"] },
  { id: "r6", name: "Remera High ELO Stats", slug: "remera-highelo", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "FACEIT", color: "NEGRO", images: ["/assets/remera-highelo-frente.png", "/assets/remera-highelo-dorso.png"], extra: ["negro", "rojo"] },
  { id: "r7", name: "Remera Asimov", slug: "remera-asimov", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "NUKE", color: "BLANCO", images: [], extra: ["blanco", "naranja", "negro"] },
  { id: "r8", name: "Remera XXX Crosshair", slug: "remera-xxx", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "ANCIENT", color: "BLANCO", images: [], extra: ["blanco", "negro"] },
  { id: "b1", name: "Crewneck Mirage", slug: "crewneck-mirage", type: "buzos", price: 59900, old_price: 69900, in_stock: true, drop: "001", map_ref: "MIRAGE", color: "ARENA", images: [], extra: ["arena", "bordado"] },
  { id: "b2", name: "Crewneck Dust II", slug: "crewneck-dust2", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "DUST II", color: "NEGRO", images: [], extra: ["negro", "dorado"] },
  { id: "b3", name: "Crewneck Cobblestone", slug: "crewneck-cobble", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "COBBLESTONE", color: "NAVY", images: [], extra: ["navy", "bordado"] },
  { id: "b4", name: "Crewneck Remove Any Doubts Negro", slug: "crewneck-doubts-negro", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "CACHE", color: "NEGRO", images: [], extra: ["negro", "rojo", "dorado"] },
  { id: "b5", name: "Crewneck Remove Any Doubts Arena", slug: "crewneck-doubts-arena", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "MIRAGE", color: "ARENA", images: [], extra: ["arena", "bordado"] },
  { id: "b6", name: "Hoodie Inferno", slug: "hoodie-inferno", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "INFERNO", color: "NEGRO", images: [], extra: ["negro", "bordado"] },
  { id: "b7", name: "Hoodie Nuke", slug: "hoodie-nuke", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "NUKE", color: "NEGRO", images: [], extra: ["negro", "bordado"] },
  { id: "b8", name: "Hoodie Mirage", slug: "hoodie-mirage", type: "buzos", price: 69900, in_stock: false, drop: "001", map_ref: "MIRAGE", color: "NEGRO", images: [], extra: ["negro", "bordado"] },
  { id: "b9", name: "Hoodie Cache", slug: "hoodie-cache", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "CACHE", color: "NEGRO", images: [], extra: ["negro", "bordado"] },
  { id: "b10", name: "Hoodie Crimson Knife", slug: "hoodie-knife", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "KNIFE", color: "NEGRO", images: [], extra: ["negro", "rojo"] },
  { id: "g1", name: "Gorra StatTrak™ Drop 001", slug: "gorra-stattrak", type: "gorras", price: 19900, in_stock: true, drop: "001", map_ref: "STATTRAK™", color: "NEGRO", images: [], extra: ["negro", "bordado"] },
  { id: "t1", name: "Taza StatTrak™ Kill Counter", slug: "taza-stattrak", type: "tazas", price: 12900, in_stock: true, drop: "001", map_ref: "STATTRAK™", color: "NEGRO", images: [], extra: ["cerámica"] },
  { id: "t2", name: "Taza Dust II", slug: "taza-dust2", type: "tazas", price: 12900, in_stock: true, drop: "001", map_ref: "DUST II", color: "BLANCO", images: [], extra: ["cerámica"] },
  { id: "t3", name: "Taza Nuke", slug: "taza-nuke", type: "tazas", price: 12900, in_stock: true, drop: "001", map_ref: "NUKE", color: "NEGRO", images: [], extra: ["cerámica"] },
  { id: "m1", name: "Mousepad Printstream Negro", slug: "mousepad-print-negro", type: "mousepads", price: 24900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "NEGRO", images: [], extra: ["900x400mm"] },
  { id: "m2", name: "Mousepad Printstream Blanco", slug: "mousepad-print-blanco", type: "mousepads", price: 24900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "BLANCO", images: [], extra: ["900x400mm"] },
];

export default function Catalogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSection, setActiveSection] = useState("all");
  const [sort, setSort] = useState("newest");

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
        p.x += p.vx; p.y += p.vy;
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
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", handleResize); };
  }, []);

  const filtered = PRODUCTS
    .filter((p) => activeSection === "all" || p.type === activeSection)
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const counts: Record<string, number> = {};
  SECTIONS.forEach((s) => {
    counts[s.id] = s.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.type === s.id).length;
  });

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
      <nav style={{ position: "fixed", top: "24px", left: 0, width: "100%", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid rgba(255,69,0,0.2)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
        <Link href="/" style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "3px", textDecoration: "none", color: "#f0f0f0" }}>
          Stat<span style={{ color: "#ff4500" }}>Trak</span>™
        </Link>
        <div style={{ display: "flex", gap: "32px", fontSize: "12px", letterSpacing: "2px" }}>
          <Link href="/" style={{ color: "#f0f0f0", textDecoration: "none" }}>INICIO</Link>
          <Link href="/catalogo" style={{ color: "#ff4500", textDecoration: "none" }}>CATÁLOGO</Link>
          <Link href="/contacto" style={{ color: "#f0f0f0", textDecoration: "none" }}>CONTACTO</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
          <Link href="/auth" style={{ color: "#ff4500", textDecoration: "none", border: "1px solid #ff4500", padding: "6px 16px" }}>LOGIN</Link>
          <button style={{ background: "none", border: "1px solid #444", color: "#f0f0f0", padding: "6px 16px", cursor: "pointer", fontSize: "12px" }}>[ CARRITO: 0 ]</button>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ position: "relative", zIndex: 3, padding: "100px 40px 60px" }}>
        <div style={{ borderBottom: "1px solid rgba(255,69,0,0.2)", paddingBottom: "32px", marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#ff4500", marginBottom: "8px" }}>STATTRAK™ — DROP 001</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h2 style={{ fontSize: "40px", fontWeight: "900", letterSpacing: "4px", fontFamily: "sans-serif", margin: 0 }}>CATÁLOGO</h2>
              <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#666" }}>{filtered.length} ARTÍCULOS — DROP ACTIVO</span>
            </div>
            <select onChange={(e) => setSort(e.target.value)} value={sort} style={{ background: "#111", border: "1px solid #333", color: "#666", padding: "8px 16px", fontSize: "11px", fontFamily: "monospace", cursor: "pointer" }}>
              <option value="newest">NUEVO</option>
              <option value="price_asc">PRECIO ↑</option>
              <option value="price_desc">PRECIO ↓</option>
              <option value="name">NOMBRE</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "48px", flexWrap: "wrap" }}>
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              background: activeSection === s.id ? "#ff4500" : "rgba(255,69,0,0.1)",
              border: "1px solid " + (activeSection === s.id ? "#ff4500" : "rgba(255,69,0,0.4)"),
              color: activeSection === s.id ? "#000" : "#ff4500",
              padding: "8px 20px", cursor: "pointer", fontSize: "11px",
              letterSpacing: "2px", fontFamily: "monospace", fontWeight: "bold",
              transition: "all 0.2s"
            }}>
              {s.label} <span style={{ opacity: 0.6, fontSize: "10px" }}>({counts[s.id]})</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {activeSection === "all" ? (
          SECTIONS.slice(1).map((section) => {
            const items = filtered.filter((p) => p.type === section.id);
            if (items.length === 0) return null;
            return (
              <div key={section.id} style={{ marginBottom: "64px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "14px", letterSpacing: "4px", color: "#ff4500", margin: 0 }}>{section.label}</h3>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,69,0,0.2)" }} />
                  <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#444" }}>{items.length} ARTÍCULOS</span>
                </div>
                <ProductGrid items={items} />
              </div>
            );
          })
        ) : (
          <ProductGrid items={filtered} />
        )}
      </div>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </main>
  );
}

function ProductGrid({ items }: { items: typeof PRODUCTS }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
      {items.map((product) => (
        <Link key={product.id} href={`/producto/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div
            onMouseEnter={() => setHovered(product.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ background: "#0a0a0a", border: "1px solid " + (hovered === product.id ? "#ff4500" : "#1a1a1a"), cursor: "pointer", transition: "border-color 0.2s", position: "relative", overflow: "hidden" }}
          >
            <div style={{ aspectRatio: "1", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              {product.images && product.images[0] ? (
                <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "32px", opacity: 0.15 }}>
                    {product.type === "remeras" ? "👕" : product.type === "buzos" ? "🧥" : product.type === "gorras" ? "🧢" : product.type === "tazas" ? "☕" : "🖱️"}
                  </div>
                  <span style={{ fontSize: "10px", letterSpacing: "3px", color: "#333" }}>{product.map_ref}</span>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", padding: "0 16px" }}>
                    {product.extra?.map((tag) => (
                      <span key={tag} style={{ fontSize: "9px", letterSpacing: "1px", color: "#444", border: "1px solid #222", padding: "2px 6px" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              {!product.in_stock && (
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                  <span style={{ fontSize: "11px", letterSpacing: "4px", color: "#555" }}>SIN STOCK</span>
                </div>
              )}
              <div style={{ position: "absolute", top: "12px", left: "12px", background: "#ff4500", color: "#000", fontSize: "10px", padding: "2px 8px", fontWeight: "bold", letterSpacing: "2px", zIndex: 3 }}>
                DROP {product.drop}
              </div>
              <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.8)", color: "#555", fontSize: "9px", padding: "2px 8px", letterSpacing: "1px", zIndex: 3 }}>
                {product.color}
              </div>
            </div>
            <div style={{ padding: "16px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#555", marginBottom: "6px" }}>{product.map_ref}</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "1px", marginBottom: "12px", fontFamily: "sans-serif" }}>{product.name}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#ff4500" }}>
                    ${product.price.toLocaleString("es-AR")}
                  </span>
                  {"old_price" in product && (product as any).old_price && (
                    <span style={{ fontSize: "12px", color: "#333", textDecoration: "line-through", marginLeft: "8px" }}>
                      ${(product as any).old_price.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "10px", letterSpacing: "2px", color: product.in_stock ? "#ff4500" : "#444" }}>
                  {product.in_stock ? "DISPONIBLE" : "AGOTADO"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}