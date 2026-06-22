// src/components/seat-map/TheatreMap.jsx
import { useRef, useState } from "react";
import SeatSection from "./SeatSection";
import { CANVAS_WIDTH, CANVAS_HEIGHT, SECTION_BLOCKS, STAGE } from "./sectionLayout";

function getBlockForSeat(seat) {
  const { section, row } = seat;
  if (section === "Ground Floor Center" || section === "Ground Floor Right Side") {
    return "groundFloor";
  }
  if (section === "Balcony Left Side") {
    return "balconyLeftStrips";
  }
  if (section === "Balcony Right Side") {
    return "balconyRightStrips";
  }
  if (section === "Balcony Front Side") {
    if (
      row.startsWith("Uf") || row.startsWith("Ug") || row.startsWith("Uh") || row.startsWith("Ui") ||
      row.startsWith("UF") || row.startsWith("UG") || row.startsWith("UH") || row.startsWith("UI")
    ) {
      return "balconyBottom";
    } else {
      return "balconyFront";
    }
  }
  return "groundFloor";
}

export default function TheatreMap({ sections, selectedSeat, onSelect }) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  function handleWheel(e) {
    e.preventDefault();
    const next = Math.min(2.5, Math.max(0.4, scale - e.deltaY * 0.001));
    setScale(next);
  }
  function handlePointerDown(e) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  }
  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  }
  function handlePointerUp() { dragRef.current = null; }

  const blockSeats = {
    groundFloor: [],
    balconyLeftStrips: [],
    balconyRightStrips: [],
    balconyFront: [],
    balconyBottom: [],
  };

  for (const sectionGroup of sections) {
    for (const seat of sectionGroup.seats) {
      const blockKey = getBlockForSeat(seat);
      if (blockSeats[blockKey]) blockSeats[blockKey].push(seat);
    }
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "70vh",
      overflow: "hidden",
      background: "#0B0F19",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 0 0 1px rgba(139,92,246,0.04), 0 24px 60px rgba(0,0,0,0.6)",
    }}>
      {/* ── Seat hover CSS injected once ── */}
      <style>{`
        .seat-hover-group:hover {
          transform: scale(1.3);
          filter: brightness(1.4) drop-shadow(0 0 5px rgba(139,92,246,0.65));
        }
      `}</style>

      {/* ── Zoom controls ── */}
      <div style={{
        position: "absolute", top: 12, right: 12, zIndex: 10,
        display: "flex", gap: 6,
      }}>
        {[
          { label: "+",     action: () => setScale(s => Math.min(2.5, s + 0.2)) },
          { label: "−",     action: () => setScale(s => Math.max(0.4, s - 0.2)) },
          { label: "Reset", action: () => { setScale(1); setPan({ x: 0, y: 0 }); } },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              height: 30, minWidth: 30,
              padding: label === "Reset" ? "0 12px" : 0,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 8,
              color: "rgba(220,214,255,0.75)",
              fontSize: label === "Reset" ? 11 : 15,
              fontWeight: 500,
              fontFamily: "'Inter',system-ui,sans-serif",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "background 0.15s, border-color 0.15s",
              letterSpacing: label === "Reset" ? "0.04em" : 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(139,92,246,0.18)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* ── SVG Defs ── */}
        <defs>
          {/* Stage: horizontal neon sweep */}
          <linearGradient id="stageLinear" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#1e0a3c" stopOpacity="1" />
            <stop offset="25%"  stopColor="#4c1d95" stopOpacity="1" />
            <stop offset="50%"  stopColor="#7c3aed" stopOpacity="1" />
            <stop offset="75%"  stopColor="#4c1d95" stopOpacity="1" />
            <stop offset="100%" stopColor="#1e0a3c" stopOpacity="1" />
          </linearGradient>

          {/* Stage top highlight shimmer */}
          <linearGradient id="stageShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
            <stop offset="35%"  stopColor="rgba(196,181,253,0.35)" />
            <stop offset="65%"  stopColor="rgba(196,181,253,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Stage outer bloom filter */}
          <filter id="stageBloom" x="-15%" y="-80%" width="130%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Seat selected violet glow filter */}
          <filter id="seatGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${pan.x} ${pan.y}) scale(${scale})`}>

          {/* ════════════════════════════════════════════
              STAGE — Neon gradient bar, no text clutter
          ════════════════════════════════════════════ */}

          {/* Ambient bloom behind stage */}
          <rect
            x={STAGE.x - 4} y={STAGE.y - 4}
            width={STAGE.width + 8} height={STAGE.height + 8}
            rx={10}
            fill="none"
            stroke="rgba(139,92,246,0.25)"
            strokeWidth={10}
            style={{ filter: "blur(8px)" }}
          />

          {/* Stage body with neon gradient */}
          <rect
            x={STAGE.x} y={STAGE.y}
            width={STAGE.width} height={STAGE.height}
            rx={6}
            fill="url(#stageLinear)"
            stroke="rgba(139,92,246,0.55)"
            strokeWidth={0.75}
            filter="url(#stageBloom)"
          />

          {/* Top shimmer highlight strip */}
          <rect
            x={STAGE.x + 4} y={STAGE.y + 1}
            width={STAGE.width - 8} height={2.5}
            rx={2}
            fill="url(#stageShimmer)"
          />

          {/* Minimal "STAGE" label — clean, no dimensions */}
          <text
            x={STAGE.x + STAGE.width / 2}
            y={STAGE.y + STAGE.height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fill="rgba(196,181,253,0.7)"
            fontWeight={600}
            fontFamily="'Inter',system-ui,sans-serif"
            style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}
          >
            STAGE
          </text>

          {/* ════════════════════════════════════════════
              SEAT SECTIONS — all interactive, no metadata
          ════════════════════════════════════════════ */}
          {Object.entries(blockSeats).map(([blockKey, seats]) => {
            if (seats.length === 0) return null;
            const block = SECTION_BLOCKS[blockKey];
            return (
              <SeatSection
                key={blockKey}
                blockKey={blockKey}
                seats={seats}
                blockX={block.x}
                blockY={block.y}
                selectedSeat={selectedSeat}
                onSelect={onSelect}
              />
            );
          })}

        </g>
      </svg>
    </div>
  );
}
