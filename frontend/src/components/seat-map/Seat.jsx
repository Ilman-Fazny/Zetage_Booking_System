// src/components/seat-map/Seat.jsx
import { motion } from "framer-motion";
import { microSpring } from "../../lib/motionVariants";
import { getTierConfig } from "../../lib/pricing";

export default function Seat({ seat, isSelected, onSelect, x, y, size }) {
  const isBooked = seat.status === "booked" || seat.status === "held";
  const tierCfg = getTierConfig(seat);

  const cx = x + size / 2;
  const cy = y + size / 2;

  return (
    <motion.g
      onClick={() => !isBooked && onSelect(seat)}
      style={{
        cursor: isBooked ? "not-allowed" : "pointer",
        transformOrigin: `${cx}px ${cy}px`,
      }}
      // ── Entry animation: staggered wave on seat-map load ───────────────
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1   }}
      transition={{
        opacity: {
          duration: 0.28,
          delay: (seat.number % 20) * 0.012,
          ease: "easeOut",
        },
        scale: {
          type: "spring",
          stiffness: 420,
          damping: 22,
          delay: (seat.number % 20) * 0.012,
        },
      }}
      // ── Micro-interactions ─────────────────────────────────────────────
      whileHover={!isBooked ? { scale: 1.12, transition: microSpring } : {}}
      whileTap={!isBooked   ? { scale: 0.92, transition: microSpring } : {}}
      className={!isBooked && !isSelected ? "seat-hover-group" : ""}
    >
      {/* ── Selected: outer glow ring ───────────────────────────────────── */}
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

      {/* ── Tier tint glow for available seats ────────────────────────── */}
      {!isBooked && !isSelected && seat.tier !== "normal" && (
        <rect
          x={x - 1} y={y - 1}
          width={size + 2} height={size + 2}
          rx={4}
          fill="none"
          stroke={tierCfg.glowColor}
          strokeWidth={0.6}
          style={{ filter: `drop-shadow(0 0 3px ${tierCfg.glowColor})` }}
        />
      )}

      {/* ── Seat body ───────────────────────────────────────────────────── */}
      <rect
        x={x} y={y}
        width={size} height={size}
        rx={3}
        fill={
          isBooked    ? "#27272A"           // charcoal — unavailable
          : isSelected ? "#8B5CF6"         // electric violet — selected
          : tierCfg.bgHint               // subtle tier background tint
        }
        stroke={
          isBooked    ? "none"
          : isSelected ? "#a78bfa"         // bright violet ring
          : tierCfg.borderColor            // tier-specific border color
        }
        strokeWidth={isSelected ? 1.2 : 0.75}
        style={
          isSelected
            ? { filter: "drop-shadow(0 0 6px rgba(139,92,246,1)) drop-shadow(0 0 12px rgba(109,40,217,0.7))" }
            : {}
        }
      />

      {/* ── Seat number ─────────────────────────────────────────────────── */}
      <text
        x={cx} y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.38}
        fontWeight={isSelected ? "700" : "400"}
        fill={
          isBooked    ? "rgba(255,255,255,0.12)"  // barely visible on charcoal
          : isSelected ? "#ffffff"                // white on violet
          : "rgba(255,255,255,0.45)"              // dim silver on transparent
        }
        style={{ userSelect: "none", letterSpacing: "-0.3px" }}
      >
        {seat.number}
      </text>
    </motion.g>
  );
}

