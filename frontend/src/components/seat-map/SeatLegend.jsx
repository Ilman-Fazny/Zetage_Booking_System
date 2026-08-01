// src/components/seat-map/SeatLegend.jsx
import { TIER_CONFIG } from "../../lib/pricing";

export default function SeatLegend() {
  const tierItems = [
    {
      label: `Premium — LKR ${TIER_CONFIG.premium.price}`,
      swatch: (
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: TIER_CONFIG.premium.bgHint,
          border: `1px solid ${TIER_CONFIG.premium.borderColor}`,
          boxShadow: `0 0 5px ${TIER_CONFIG.premium.glowColor}`,
          display: "inline-block",
          flexShrink: 0,
        }} />
      ),
    },
    {
      label: `Standard — LKR ${TIER_CONFIG.standard.price}`,
      swatch: (
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: TIER_CONFIG.standard.bgHint,
          border: `1px solid ${TIER_CONFIG.standard.borderColor}`,
          boxShadow: `0 0 5px ${TIER_CONFIG.standard.glowColor}`,
          display: "inline-block",
          flexShrink: 0,
        }} />
      ),
    },
    {
      label: `Normal — LKR ${TIER_CONFIG.normal.price}`,
      swatch: (
        <span style={{
          width: 14, height: 14,
          borderRadius: 3,
          background: "transparent",
          border: `0.75px solid ${TIER_CONFIG.normal.borderColor}`,
          display: "inline-block",
          flexShrink: 0,
        }} />
      ),
    },
  ];

  const statusItems = [
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

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 7,
  };
  const labelStyle = {
    fontSize: 11,
    color: "rgba(200,196,220,0.6)",
    fontWeight: 500,
    userSelect: "none",
    letterSpacing: "0.01em",
    fontFamily: "'Inter', system-ui, sans-serif",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      {/* Price tiers row */}
      <div style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        alignItems: "center",
        padding: "7px 14px",
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        backdropFilter: "blur(8px)",
        width: "fit-content",
      }}>
        {tierItems.map(({ label, swatch }) => (
          <div key={label} style={itemStyle}>
            {swatch}
            <span style={labelStyle}>{label}</span>
          </div>
        ))}
      </div>
      {/* Status indicators row */}
      <div style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: "7px 14px",
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        backdropFilter: "blur(8px)",
        width: "fit-content",
      }}>
        {statusItems.map(({ label, swatch }) => (
          <div key={label} style={itemStyle}>
            {swatch}
            <span style={labelStyle}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

