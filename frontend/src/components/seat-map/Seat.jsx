// src/components/seat-map/Seat.jsx
export default function Seat({ seat, isSelected, onSelect, x, y, size }) {
  const isBooked = seat.status === "booked";

  let fill = "#f8fafc";       // available — slate-50
  let stroke = "#cbd5e1";     // slate-300
  let textColor = "#475569";  // slate-600
  
  if (isSelected) {
    fill = "#4f46e5";          // selected — indigo-600
    stroke = "#4338ca";        // indigo-700
    textColor = "#ffffff";     // white
  } else if (isBooked) {
    fill = "#f3f4f6";          // booked — slate-100
    stroke = "#e2e8f0";        // slate-200
    textColor = "#94a3b8";     // slate-400 (faded)
  }

  const style = {
    cursor: isBooked ? "not-allowed" : "pointer",
    transition: "all 0.15s ease-in-out",
    transformOrigin: `${x + size / 2}px ${y + size / 2}px`,
  };

  return (
    <g
      onClick={() => onSelect(seat)}
      style={style}
      className={`group ${isBooked ? "opacity-50" : "hover:scale-[1.22] hover:brightness-[0.98]"}`}
    >
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.75}
        className="transition-all duration-150"
      />
      {isBooked && (
        <line
          x1={x}
          y1={y}
          x2={x + size}
          y2={y + size}
          stroke="#cbd5e1"
          strokeWidth={0.75}
        />
      )}
      <text
        x={x + size / 2}
        y={y + size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.4}
        fontWeight={isSelected ? "600" : "500"}
        fill={textColor}
        className="select-none transition-all duration-150"
      >
        {seat.number}
      </text>
    </g>
  );
}
