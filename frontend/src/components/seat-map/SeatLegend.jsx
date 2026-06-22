// src/components/seat-map/SeatLegend.jsx
export default function SeatLegend() {
  const items = [
    {
      label: "Available",
      swatch: (
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: "transparent",
          border: "0.75px solid rgba(255,255,255,0.3)",
          display: "inline-block",
          flexShrink: 0,
        }} />
      ),
    },
    {
      label: "Selected",
      swatch: (
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: "#8B5CF6",
          border: "1px solid #a78bfa",
          boxShadow: "0 0 7px rgba(139,92,246,0.9), 0 0 14px rgba(109,40,217,0.5)",
          display: "inline-block",
          flexShrink: 0,
        }} />
      ),
    },
    {
      label: "Unavailable",
      swatch: (
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: "#27272A",
          border: "none",
          display: "inline-block",
          flexShrink: 0,
        }} />
      ),
    },
  ];

  return (
    <div style={{
      display: "flex",
      gap: "18px",
      alignItems: "center",
      padding: "7px 14px",
      background: "rgba(255,255,255,0.035)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 10,
      backdropFilter: "blur(8px)",
      width: "fit-content",
    }}>
      {items.map(({ label, swatch }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {swatch}
          <span style={{
            fontSize: 11.5,
            color: "rgba(200,196,220,0.6)",
            fontWeight: 500,
            userSelect: "none",
            letterSpacing: "0.01em",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
