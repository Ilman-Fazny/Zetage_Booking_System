// src/components/seat-map/Seat.jsx
export default function Seat({ seat, isSelected, onSelect, x, y, size }) {
  const isBooked = seat.status === "booked";

  const cx = x + size / 2;
  const cy = y + size / 2;

  return (
    <g
      onClick={() => !isBooked && onSelect(seat)}
      style={{
        cursor: isBooked ? "not-allowed" : "pointer",
        transformOrigin: `${cx}px ${cy}px`,
        transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), filter 0.18s ease",
      }}
      className={!isBooked && !isSelected ? "seat-hover-group" : ""}
    >
      {/* ── Selected: outer glow ring ───────────────────── */}
      {isSelected && (
        <>
          {/* Soft bloom behind seat */}
          <rect
            x={x - 5} y={y - 5}
            width={size + 10} height={size + 10}
            rx={7}
            fill="rgba(139,92,246,0.22)"
            style={{ filter: "blur(4px)" }}
          />
          {/* Crisp neon border ring */}
          <rect
            x={x - 2} y={y - 2}
            width={size + 4} height={size + 4}
            rx={5}
            fill="none"
            stroke="rgba(167,139,250,0.7)"
            strokeWidth={1}
          />
        </>
      )}

      {/* ── Seat body ───────────────────────────────────── */}
      <rect
        x={x} y={y}
        width={size} height={size}
        rx={3}
        fill={
          isBooked   ? "#27272A"            // charcoal — unavailable
          : isSelected ? "#8B5CF6"          // electric violet — selected
          : "transparent"                   // ghost — available
        }
        stroke={
          isBooked   ? "none"               // no border on booked
          : isSelected ? "#a78bfa"          // bright violet ring
          : "rgba(255,255,255,0.25)"        // crisp silver outline — available
        }
        strokeWidth={isSelected ? 1.2 : 0.75}
        style={
          isSelected
            ? { filter: "drop-shadow(0 0 6px rgba(139,92,246,1)) drop-shadow(0 0 12px rgba(109,40,217,0.7))" }
            : {}
        }
      />

      {/* ── Seat number ─────────────────────────────────── */}
      <text
        x={cx} y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.38}
        fontWeight={isSelected ? "700" : "400"}
        fill={
          isBooked   ? "rgba(255,255,255,0.12)"   // barely visible on charcoal
          : isSelected ? "#ffffff"                 // white on violet
          : "rgba(255,255,255,0.45)"               // dim silver on transparent
        }
        style={{ userSelect: "none", letterSpacing: "-0.3px" }}
      >
        {seat.number}
      </text>
    </g>
  );
}
