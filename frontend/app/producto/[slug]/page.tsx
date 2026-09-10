"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const SmokeBackground = dynamic(() => import("@/components/SmokeBackground"), { ssr: false });

const PRODUCTS = [
  { id: "r1", name: "Remera Overpass", slug: "remera-overpass", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "OVERPASS", color: "NEGRO", images: ["/assets/remera-overpass-frente.png", "/assets/remera-overpass-dorso.png"], extra: ["negro", "cyan"], description: "Remera oversize washed con diseño inspirado en el mapa Overpass de CS2. Bordado en pecho izquierdo.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "r2", name: "Remera Ancient", slug: "remera-ancient", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "ANCIENT", color: "BLANCO", images: ["/assets/remera-ancient-frente.png", "/assets/remera-ancient-dorso.png"], extra: ["blanco", "rojo-naranja"], description: "Remera oversize washed con diseño inspirado en el mapa Ancient de CS2.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "r3", name: "Remera Printstream", slug: "remera-printstream", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "BLANCO", images: ["/assets/remera-printstream-frente.png", "/assets/remera-printstream-dorso.png"], extra: ["blanco", "rosa"], description: "Remera oversize con diseño Printstream. Estampado full en dorso.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "r4", name: "Remera Handle W/ Care", slug: "remera-handle", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "NUKE", color: "BLANCO", images: ["/assets/remera-handle-frente.png", "/assets/remera-handle-dorso.png"], extra: ["blanco", "negro"], description: "Remera minimalista con bordado handle w/ care.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "r5", name: "Remera Bingo Bango", slug: "remera-bingo", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "BLANCO", images: ["/assets/remera-bingo-frente.png", "/assets/remera-bingo-dorso.png"], extra: ["blanco", "negro", "rosa"], description: "Remera oversize con estampado Bingo Bango Bongo en dorso.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "r6", name: "Remera High ELO Stats", slug: "remera-highelo", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "FACEIT", color: "NEGRO", images: ["/assets/remera-highelo-frente.png", "/assets/remera-highelo-dorso.png"], extra: ["negro", "rojo"], description: "Remera con estadísticas High ELO en dorso.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "r7", name: "Remera Asimov", slug: "remera-asimov", type: "remeras", price: 32900, in_stock: true, drop: "001", map_ref: "NUKE", color: "BLANCO", images: [], extra: ["blanco", "naranja", "negro"], description: "Remera con diseño abstracto geométrico inspirado en el skin Asiimov.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "r8", name: "Remera XXX Crosshair", slug: "remera-xxx", type: "remeras", price: 29900, in_stock: true, drop: "001", map_ref: "ANCIENT", color: "BLANCO", images: [], extra: ["blanco", "negro"], description: "Remera con crosshair XXX en dorso.", material: "380GSM algodón", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b1", name: "Crewneck Mirage", slug: "crewneck-mirage", type: "buzos", price: 59900, old_price: 69900, in_stock: true, drop: "001", map_ref: "MIRAGE", color: "ARENA", images: [], extra: ["arena", "bordado"], description: "Crewneck washed color arena con bordado del mapa Mirage.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b2", name: "Crewneck Dust II", slug: "crewneck-dust2", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "DUST II", color: "NEGRO", images: [], extra: ["negro", "dorado"], description: "Crewneck negro con bordado dorado del mapa Dust II.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b3", name: "Crewneck Cobblestone", slug: "crewneck-cobble", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "COBBLESTONE", color: "NAVY", images: [], extra: ["navy", "bordado"], description: "Crewneck navy con bordado del mapa Cobblestone.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b4", name: "Crewneck Remove Any Doubts Negro", slug: "crewneck-doubts-negro", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "CACHE", color: "NEGRO", images: [], extra: ["negro", "rojo", "dorado"], description: "Crewneck negro con la frase icónica del juego en dorso.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b5", name: "Crewneck Remove Any Doubts Arena", slug: "crewneck-doubts-arena", type: "buzos", price: 59900, in_stock: true, drop: "001", map_ref: "MIRAGE", color: "ARENA", images: [], extra: ["arena", "bordado"], description: "Crewneck arena con la frase icónica del juego en dorso.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b6", name: "Hoodie Inferno", slug: "hoodie-inferno", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "INFERNO", color: "NEGRO", images: [], extra: ["negro", "bordado"], description: "Hoodie negro con bordado del mapa Inferno.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b7", name: "Hoodie Nuke", slug: "hoodie-nuke", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "NUKE", color: "NEGRO", images: [], extra: ["negro", "bordado"], description: "Hoodie negro con bordado del mapa Nuke.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b8", name: "Hoodie Mirage", slug: "hoodie-mirage", type: "buzos", price: 69900, in_stock: false, drop: "001", map_ref: "MIRAGE", color: "NEGRO", images: [], extra: ["negro", "bordado"], description: "Hoodie negro con bordado del mapa Mirage.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b9", name: "Hoodie Cache", slug: "hoodie-cache", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "CACHE", color: "NEGRO", images: [], extra: ["negro", "bordado"], description: "Hoodie negro con bordado del mapa Cache.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "b10", name: "Hoodie Crimson Knife", slug: "hoodie-knife", type: "buzos", price: 69900, in_stock: true, drop: "001", map_ref: "KNIFE", color: "NEGRO", images: [], extra: ["negro", "rojo"], description: "Hoodie negro con cuchillo crimson bordado en pecho.", material: "380GSM fleece", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "g1", name: "Gorra StatTrak™ Drop 001", slug: "gorra-stattrak", type: "gorras", price: 19900, in_stock: true, drop: "001", map_ref: "STATTRAK™", color: "NEGRO", images: [], extra: ["negro", "bordado"], description: "Gorra snapback negra con bordado StatTrak™.", material: "100% algodón", sizes: ["Talle único"] },
  { id: "t1", name: "Taza StatTrak™ Kill Counter", slug: "taza-stattrak", type: "tazas", price: 12900, in_stock: true, drop: "001", map_ref: "STATTRAK™", color: "NEGRO", images: [], extra: ["cerámica"], description: "Taza cerámica negra con diseño Kill Counter.", material: "Cerámica 350ml", sizes: ["Talle único"] },
  { id: "t2", name: "Taza Dust II", slug: "taza-dust2", type: "tazas", price: 12900, in_stock: true, drop: "001", map_ref: "DUST II", color: "BLANCO", images: [], extra: ["cerámica"], description: "Taza cerámica blanca con diseño del mapa Dust II.", material: "Cerámica 350ml", sizes: ["Talle único"] },
  { id: "t3", name: "Taza Nuke", slug: "taza-nuke", type: "tazas", price: 12900, in_stock: true, drop: "001", map_ref: "NUKE", color: "NEGRO", images: [], extra: ["cerámica"], description: "Taza cerámica con diseño del mapa Nuke.", material: "Cerámica 350ml", sizes: ["Talle único"] },
  { id: "m1", name: "Mousepad Printstream Negro", slug: "mousepad-print-negro", type: "mousepads", price: 24900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "NEGRO", images: [], extra: ["900x400mm"], description: "Mousepad XL negro con diseño Printstream.", material: "Microfibra 900x400mm", sizes: ["Talle único"] },
  { id: "m2", name: "Mousepad Printstream Blanco", slug: "mousepad-print-blanco", type: "mousepads", price: 24900, in_stock: true, drop: "001", map_ref: "PRINTSTREAM", color: "BLANCO", images: [], extra: ["900x400mm"], description: "Mousepad XL blanco con diseño Printstream.", material: "Microfibra 900x400mm", sizes: ["Talle único"] },
];

export default function ProductoPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = PRODUCTS.find((p) => p.slug === slug);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);

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

  const handleAddToCart = () => {
    if (!product?.in_stock) return;
    if (product.sizes.length > 1 && !selectedSize) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <main style={{ minHeight: "100vh", background: "#000", color: "#f0f0f0", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#ff4500", marginBottom: "16px" }}>404</div>
          <div style={{ fontSize: "14px", letterSpacing: "2px", marginBottom: "24px" }}>PRODUCTO NO ENCONTRADO</div>
          <Link href="/catalogo" style={{ color: "#ff4500", textDecoration: "none", border: "1px solid #ff4500", padding: "10px 24px", fontSize: "11px", letterSpacing: "2px" }}>← VOLVER AL CATÁLOGO</Link>
        </div>
      </main>
    );
  }

  const related = PRODUCTS.filter((p) => p.type === product.type && p.id !== product.id).slice(0, 4);

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#f0f0f0", fontFamily: "monospace", overflow: "hidden" }}>
      <SmokeBackground />
      <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", zIndex: 2, pointerEvents: "none" }} />

      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 10, background: "rgba(255,69,0,0.9)", color: "#000", fontSize: "11px", fontWeight: "bold", letterSpacing: "2px", overflow: "hidden", height: "24px", display: "flex", alignItems: "center" }}>
        <div style={{ whiteSpace: "nowrap", animation: "ticker 30s linear infinite" }}>
          &nbsp;&nbsp;ROUND STARTS IN&nbsp;&nbsp;-&nbsp;&nbsp;ENVÍOS A TODO ARG&nbsp;&nbsp;-&nbsp;&nbsp;IT'S US OR THEM&nbsp;&nbsp;-&nbsp;&nbsp;STATTRAK™ DROP 001&nbsp;&nbsp;-&nbsp;&nbsp;OFERTA EN TODO EL CATÁLOGO&nbsp;&nbsp;-&nbsp;&nbsp;ROUND STARTS IN&nbsp;&nbsp;
        </div>
      </div>

      <nav style={{ position: "fixed", top: "24px", left: 0, width: "100%", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid rgba(255,69,0,0.2)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
        <Link href="/" style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "3px", textDecoration: "none", color: "#f0f0f0" }}>
          Stat<span style={{ color: "#ff4500" }}>Trak</span>™
        </Link>
        <div style={{ display: "flex", gap: "32px", fontSize: "12px", letterSpacing: "2px" }}>
          <Link href="/" style={{ color: "#f0f0f0", textDecoration: "none" }}>INICIO</Link>
          <Link href="/catalogo" style={{ color: "#f0f0f0", textDecoration: "none" }}>CATÁLOGO</Link>
          <Link href="/contacto" style={{ color: "#f0f0f0", textDecoration: "none" }}>CONTACTO</Link>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
          <Link href="/auth" style={{ color: "#ff4500", textDecoration: "none", border: "1px solid #ff4500", padding: "6px 16px" }}>LOGIN</Link>
          <button style={{ background: "none", border: "1px solid #444", color: "#f0f0f0", padding: "6px 16px", cursor: "pointer", fontSize: "12px" }}>[ CARRITO: 0 ]</button>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 3, padding: "100px 40px 60px" }}>

        <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "40px" }}>
          <Link href="/" style={{ color: "#444", textDecoration: "none" }}>INICIO</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/catalogo" style={{ color: "#444", textDecoration: "none" }}>CATÁLOGO</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#ff4500" }}>{product.name.toUpperCase()}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", maxWidth: "1200px", marginBottom: "80px" }}>

          {/* Galería */}
          <div>
            <div style={{ aspectRatio: "1", background: "#0a0a0a", border: "1px solid #1a1a1a", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {product.images && product.images[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "64px", opacity: 0.1 }}>
                    {product.type === "remeras" ? "👕" : product.type === "buzos" ? "🧥" : product.type === "gorras" ? "🧢" : product.type === "tazas" ? "☕" : "🖱️"}
                  </div>
                  <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#333" }}>{product.map_ref}</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImage(i)} style={{ width: "80px", height: "80px", background: "#0a0a0a", border: "1px solid " + (selectedImage === i ? "#ff4500" : "#1a1a1a"), cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#ff4500", marginBottom: "8px" }}>{product.map_ref} — DROP {product.drop}</div>
            <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "2px", fontFamily: "sans-serif", marginBottom: "24px" }}>{product.name}</h1>

            <div style={{ marginBottom: "32px" }}>
              <span style={{ fontSize: "36px", fontWeight: "bold", color: "#ff4500" }}>
                ${product.price.toLocaleString("es-AR")}
              </span>
              {"old_price" in product && (product as any).old_price && (
                <span style={{ fontSize: "18px", color: "#333", textDecoration: "line-through", marginLeft: "12px" }}>
                  ${(product as any).old_price.toLocaleString("es-AR")}
                </span>
              )}
            </div>

            <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#888", marginBottom: "32px", letterSpacing: "1px" }}>{product.description}</p>

            <div style={{ marginBottom: "32px", padding: "16px", background: "#0a0a0a", border: "1px solid #1a1a1a" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "8px" }}>MATERIAL</div>
              <div style={{ fontSize: "13px", color: "#888" }}>{product.material}</div>
            </div>

            {product.sizes && product.sizes.length > 1 && (
              <div style={{ marginBottom: "32px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#444", marginBottom: "12px" }}>
                  TALLE — <span style={{ color: selectedSize ? "#ff4500" : "#333" }}>{selectedSize || "SELECCIONÁ UN TALLE"}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} style={{
                      background: selectedSize === size ? "#ff4500" : "none",
                      border: "1px solid " + (selectedSize === size ? "#ff4500" : "#333"),
                      color: selectedSize === size ? "#000" : "#666",
                      padding: "10px 16px", cursor: "pointer", fontSize: "12px",
                      letterSpacing: "2px", fontFamily: "monospace", fontWeight: "bold",
                      minWidth: "56px", transition: "all 0.15s"
                    }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAddToCart} disabled={!product.in_stock || (product.sizes.length > 1 && !selectedSize)} style={{
              width: "100%", padding: "18px", fontSize: "13px", letterSpacing: "3px",
              fontWeight: "bold", fontFamily: "monospace",
              cursor: product.in_stock ? "pointer" : "not-allowed",
              background: added ? "#00ff88" : !product.in_stock ? "#1a1a1a" : "#ff4500",
              color: added ? "#000" : !product.in_stock ? "#444" : "#000",
              border: "none", transition: "all 0.2s", marginBottom: "16px"
            }}>
              {added ? "✓ AGREGADO AL CARRITO" : !product.in_stock ? "SIN STOCK" : product.sizes.length > 1 && !selectedSize ? "SELECCIONÁ UN TALLE" : "AGREGAR AL CARRITO"}
            </button>

            <a href="https://www.instagram.com/stattrak.arg/" target="_blank" rel="noopener" style={{ display: "block", textAlign: "center", padding: "14px", border: "1px solid #333", color: "#666", textDecoration: "none", fontSize: "11px", letterSpacing: "3px" }}>
              CONSULTAR POR INSTAGRAM
            </a>

            <div style={{ marginTop: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {product.extra?.map((tag) => (
                <span key={tag} style={{ fontSize: "10px", letterSpacing: "2px", color: "#444", border: "1px solid #222", padding: "4px 10px" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <h3 style={{ fontSize: "14px", letterSpacing: "4px", color: "#ff4500", margin: 0 }}>TE PUEDE INTERESAR</h3>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,69,0,0.2)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {related.map((p) => (
                <Link key={p.id} href={`/producto/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", transition: "border-color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ff4500")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
                  >
                    <div style={{ aspectRatio: "1", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#333" }}>{p.map_ref}</span>
                      )}
                    </div>
                    <div style={{ padding: "12px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>{p.name}</div>
                      <div style={{ fontSize: "14px", color: "#ff4500", fontWeight: "bold" }}>${p.price.toLocaleString("es-AR")}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </main>
  );
}