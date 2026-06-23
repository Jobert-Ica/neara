export default function Loading() {
  return (
    <div style={{ padding: "32px 32px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ width: 250, height: 32, background: "rgba(255,255,255,0.05)", borderRadius: 8, marginBottom: 8, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
          <div style={{ width: 150, height: 20, background: "rgba(255,255,255,0.03)", borderRadius: 6, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, marginBottom: 40 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 20, padding: 24, height: 120 }}>
            <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.05)", borderRadius: "50%", marginBottom: 16, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            <div style={{ width: 100, height: 24, background: "rgba(255,255,255,0.05)", borderRadius: 6, marginBottom: 8, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            <div style={{ width: 60, height: 16, background: "rgba(255,255,255,0.03)", borderRadius: 4, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
          </div>
        ))}
      </div>

      <div style={{ width: 200, height: 28, background: "rgba(255,255,255,0.05)", borderRadius: 6, marginBottom: 20, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
      
      <div style={{ display: "grid", gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 24, height: 100, display: "flex", gap: 20 }}>
            <div style={{ width: 60, height: 60, background: "rgba(255,255,255,0.05)", borderRadius: 12, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "40%", height: 20, background: "rgba(255,255,255,0.05)", borderRadius: 6, marginBottom: 12, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
              <div style={{ width: "80%", height: 14, background: "rgba(255,255,255,0.03)", borderRadius: 4, marginBottom: 8, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
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
