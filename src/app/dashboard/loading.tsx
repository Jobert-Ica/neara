export default function Loading() {
  return (
    <div style={{ padding: "32px 32px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ width: 200, height: 32, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 8, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
          <div style={{ width: 120, height: 20, background: "rgba(255,255,255,0.03)", borderRadius: 6, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        </div>
        <div style={{ width: 140, height: 40, background: "rgba(37,99,235,0.2)", borderRadius: 8, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.03)",
              borderRadius: 16,
              padding: "20px",
              height: 180,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 80, height: 24, background: "rgba(255,255,255,0.05)", borderRadius: 12, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            </div>
            <div style={{ width: "80%", height: 20, background: "rgba(255,255,255,0.05)", borderRadius: 6, marginBottom: 12, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            <div style={{ width: "100%", height: 14, background: "rgba(255,255,255,0.03)", borderRadius: 4, marginBottom: 8, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            <div style={{ width: "60%", height: 14, background: "rgba(255,255,255,0.03)", borderRadius: 4, marginBottom: "auto", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            <div style={{ display: "flex", gap: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.02)" }}>
              <div style={{ width: 40, height: 24, background: "rgba(255,255,255,0.05)", borderRadius: 6, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              <div style={{ width: 40, height: 24, background: "rgba(255,255,255,0.05)", borderRadius: 6, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
