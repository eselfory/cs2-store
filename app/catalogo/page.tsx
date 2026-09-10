{/* Pantalla de carga CS2 */}
      {loading && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "#000", zIndex: 100,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ fontSize: "11px", letterSpacing: "6px", color: "#ff4500", marginBottom: "48px" }}>
            STATTRAK™ APPAREL
          </div>

          {/* Cruz de carga CS2 */}
          <div style={{ position: "relative", width: "80px", height: "80px", marginBottom: "48px" }}>
            <div style={{
              position: "absolute", top: "50%", left: 0, width: "100%", height: "2px",
              background: "#ff4500", transform: "translateY(-50%)",
              animation: "pulse 0.8s ease-in-out infinite"
            }} />
            <div style={{
              position: "absolute", left: "50%", top: 0, height: "100%", width: "2px",
              background: "#ff4500", transform: "translateX(-50%)",
              animation: "pulse 0.8s ease-in-out infinite 0.4s"
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: "12px", height: "12px",
              background: "#ff4500",
              transform: "translate(-50%, -50%)",
              animation: "pulse 0.8s ease-in-out infinite"
            }} />
          </div>

          {/* Barra de progreso */}
          <div style={{ width: "300px", marginBottom: "16px" }}>
            <div style={{ height: "2px", background: "#111", width: "100%" }}>
              <div style={{
                height: "100%", background: "#ff4500",
                width: `${progress}%`,
                transition: "width 0.08s linear",
                boxShadow: "0 0 8px #ff4500"
              }} />
            </div>
          </div>

          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#444" }}>
            CARGANDO CATÁLOGO... {Math.round(progress)}%
          </div>

          <div style={{ marginTop: "24px", fontSize: "10px", letterSpacing: "2px", color: "#222" }}>
            CONNECTING TO SERVER
          </div>
        </div>
      )}

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>