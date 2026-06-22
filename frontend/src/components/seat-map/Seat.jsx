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
      {/* Selected glow ring */}
      {isSelected && (
        <rect
          x={x - 3}
          y={y - 3}
          width={size + 6}
          height={size + 6}
          rx={6}
          fill="none"
          stroke="rgba(139,92,246,0.45)"
          strokeWidth={2.5}
          style={{ filter: "blur(1.5px)" }}
        />
      )}

      {/* Seat body */}
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={4}
        fill={
          isBooked
            ? "rgba(255,255,255,0.03)"
            : isSelected
            ? "rgba(109,40,217,0.85)"
            : "rgba(255,255,255,0.04)"
        }
        stroke={
          isBooked
            ? "rgba(255,255,255,0.07)"
            : isSelected
            ? "#a78bfa"
            : "rgba(255,255,255,0.18)"
        }
        strokeWidth={isSelected ? 1.2 : 0.8}
        style={
          isSelected
            ? { filter: "drop-shadow(0 0 5px rgba(139,92,246,0.9)) drop-shadow(0 0 10px rgba(109,40,217,0.6))" }
            : {}
        }
      />

      {/* Booked cross-slash */}
      {isBooked && (
        <line
          x1={x + 3}
          y1={y + 3}
          x2={x + size - 3}
          y2={y + size - 3}
          stroke="rgba(255,255,255,0.09)"
          strokeWidth={0.8}
        />
      )}

      {/* Seat number label */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.38}
        fontWeight={isSelected ? "700" : "400"}
        fill={
          isBooked
            ? "rgba(255,255,255,0.15)"
            : isSelected
            ? "#f5f3ff"
            : "rgba(255,255,255,0.5)"
        }
        style={{ userSelect: "none", letterSpacing: "-0.3px" }}
      >
        {seat.number}
      </text>
    </g>
  );
}
