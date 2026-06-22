// src/components/seat-map/SeatLegend.jsx
export default function SeatLegend() {
  return (
    <div style={{
      display: "flex",
      gap: "20px",
      alignItems: "center",
      padding: "8px 14px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "10px",
      backdropFilter: "blur(8px)",
      width: "fit-content",
    }}>
      {/* Available */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: "rgba(255,255,255,0.04)",
          border: "0.8px solid rgba(255,255,255,0.2)",
          display: "inline-block",
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 12, color: "rgba(200,196,220,0.7)", fontWeight: 400, userSelect: "none" }}>
          Available
        </span>
      </div>

      {/* Selected */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: "rgba(109,40,217,0.85)",
          border: "1.2px solid #a78bfa",
          boxShadow: "0 0 6px rgba(139,92,246,0.8), 0 0 12px rgba(109,40,217,0.5)",
          display: "inline-block",
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 12, color: "rgba(200,196,220,0.7)", fontWeight: 400, userSelect: "none" }}>
          Selected
        </span>
      </div>

      {/* Booked */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: "rgba(255,255,255,0.03)",
          border: "0.8px solid rgba(255,255,255,0.07)",
          display: "inline-block",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}>
          <svg viewBox="0 0 14 14" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <line x1="2" y1="2" x2="12" y2="12" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          </svg>
        </span>
        <span style={{ fontSize: 12, color: "rgba(200,196,220,0.7)", fontWeight: 400, userSelect: "none" }}>
          Booked
        </span>
      </div>
    </div>
  );
}
