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
  function handlePointerUp() {
    dragRef.current = null;
  }

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
      if (blockSeats[blockKey]) {
        blockSeats[blockKey].push(seat);
      }
    }
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "70vh",
      overflow: "hidden",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,40,217,0.07) 0%, transparent 55%), #0B0F19",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 0 0 1px rgba(139,92,246,0.04), 0 24px 60px rgba(0,0,0,0.6)",
    }}>
      {/* Seat hover effect injected once */}
      <style>{`
        .seat-hover-group:hover {
          transform: scale(1.28);
          filter: brightness(1.3) drop-shadow(0 0 4px rgba(139,92,246,0.6));
        }
      `}</style>

      {/* Zoom Controls */}
      <div style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 10,
        display: "flex",
        gap: 6,
      }}>
        {[
          { label: "+", action: () => setScale(s => Math.min(2.5, s + 0.2)) },
          { label: "−", action: () => setScale(s => Math.max(0.4, s - 0.2)) },
          { label: "Reset", action: () => { setScale(1); setPan({ x: 0, y: 0 }); } },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              height: 32,
              minWidth: 32,
              padding: label === "Reset" ? "0 12px" : 0,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 8,
              color: "rgba(220,214,255,0.8)",
              fontSize: label === "Reset" ? 11 : 16,
              fontWeight: 500,
              fontFamily: "'Inter',system-ui,sans-serif",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "background 0.15s, border-color 0.15s",
              letterSpacing: label === "Reset" ? "0.04em" : 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(139,92,246,0.2)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
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
        {/* ── SVG defs: gradients & filters ───────────────────── */}
        <defs>
          {/* Stage gradient */}
          <radialGradient id="stageGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%"  stopColor="#fbbf24" stopOpacity="0.18" />
            <stop offset="40%" stopColor="#dc2626" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.9" />
          </radialGradient>
          {/* Stage glow filter */}
          <filter id="stageGlow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Sound control gradient */}
          <linearGradient id="soundCtrlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          {/* Ground floor bar */}
          <linearGradient id="groundBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#854d0e" />
            <stop offset="50%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          {/* Balcony bar */}
          <linearGradient id="balconyBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#3730a3" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
        </defs>

        <g transform={`translate(${pan.x} ${pan.y}) scale(${scale})`}>

          {/* ── Stage ───────────────────────────────────────────── */}
          {/* Outer glow halo */}
          <rect
            x={STAGE.x - 8} y={STAGE.y - 8}
            width={STAGE.width + 16} height={STAGE.height + 16}
            rx={10}
            fill="none"
            stroke="rgba(251,191,36,0.15)"
            strokeWidth={8}
            style={{ filter: "blur(6px)" }}
          />
          {/* Stage body */}
          <rect
            x={STAGE.x} y={STAGE.y}
            width={STAGE.width} height={STAGE.height}
            rx={6}
            fill="url(#stageGrad)"
            stroke="rgba(220,38,38,0.5)"
            strokeWidth={1}
            filter="url(#stageGlow)"
          />
          {/* Stage top highlight strip */}
          <rect
            x={STAGE.x + 2} y={STAGE.y + 1}
            width={STAGE.width - 4} height={3}
            rx={3}
            fill="rgba(251,191,36,0.25)"
          />
          {/* Stage label */}
          <text
            x={STAGE.x + STAGE.width / 2}
            y={STAGE.y + STAGE.height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fill="rgba(255,255,255,0.85)"
            fontWeight={600}
            fontFamily="'Inter',system-ui,sans-serif"
            style={{ letterSpacing: "0.05em" }}
          >
            ( Length 50 feet ) ✦ STAGE ✦ ( Width 29 feet )
          </text>

          {/* ── Sound Light Control Unit ────────────────────────── */}
          <g>
            <rect
              x={492} y={395} width={176} height={35}
              rx={4}
              fill="url(#soundCtrlGrad)"
              stroke="rgba(139,92,246,0.4)"
              strokeWidth={1}
            />
            <text
              x={492 + 176 / 2} y={395 + 35 / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize={10} fill="rgba(232,225,255,0.9)"
              fontWeight={500}
              fontFamily="'Inter',system-ui,sans-serif"
              style={{ letterSpacing: "0.03em" }}
            >
              Sound Light Control Unit
            </text>
          </g>

          {/* ── Seat count labels ───────────────────────────────── */}
          {[
            { x: 370, y: 452, text: "Seats 117" },
            { x: 571, y: 387, text: "Seats 112" },
            { x: 772, y: 452, text: "Seats 117" },
          ].map(({ x, y, text }) => (
            <text
              key={text + x}
              x={x} y={y}
              textAnchor="middle" dominantBaseline="central"
              fontSize={10} fill="rgba(167,139,250,0.65)"
              fontWeight={600}
              fontFamily="'Inter',system-ui,sans-serif"
            >
              {text}
            </text>
          ))}

          {/* ── Ground Floor Total Bar ──────────────────────────── */}
          <g>
            <rect x={293} y={465} width={566} height={20} fill="url(#groundBarGrad)" rx={4} />
            <text
              x={293 + 566 / 2} y={465 + 10}
              textAnchor="middle" dominantBaseline="central"
              fontSize={11} fill="rgba(254,243,199,0.9)" fontWeight={600}
              fontFamily="'Inter',system-ui,sans-serif"
            >
              Ground Floor Total Number Of Seats  346
            </text>
          </g>

          {/* ── Balcony Total Bar ───────────────────────────────── */}
          <g>
            <rect x={293} y={490} width={566} height={20} fill="url(#balconyBarGrad)" rx={4} />
            <text
              x={293 + 566 / 2} y={490 + 10}
              textAnchor="middle" dominantBaseline="central"
              fontSize={11} fill="rgba(224,231,255,0.9)" fontWeight={600}
              fontFamily="'Inter',system-ui,sans-serif"
            >
              Balcony Total Number Of Seats  299
            </text>
          </g>

          {/* ── Total Seats Text ────────────────────────────────── */}
          <text
            x={293 + 566 / 2} y={530}
            textAnchor="middle" dominantBaseline="central"
            fontSize={13} fill="rgba(248,113,113,0.9)" fontWeight={700}
            fontFamily="'Inter',system-ui,sans-serif"
            style={{ letterSpacing: "0.04em" }}
          >
            Total Seats  645
          </text>

          {/* ── Balcony Front Total Label ───────────────────────── */}
          <text
            x={571} y={735}
            textAnchor="middle" dominantBaseline="central"
            fontSize={11} fill="rgba(167,139,250,0.6)" fontWeight={600}
            fontFamily="'Inter',system-ui,sans-serif"
          >
            Balcony Front Side — Total Seats 222
          </text>

          {/* ── Side vertical labels ────────────────────────────── */}
          <text
            x={210} y={255}
            transform="rotate(-90 210 255)"
            textAnchor="middle" dominantBaseline="central"
            fontSize={11} fill="rgba(148,163,184,0.55)" fontWeight={600}
            fontFamily="'Inter',system-ui,sans-serif"
          >
            Balcony Left Side — Seats 38
          </text>
          <text
            x={895} y={255}
            transform="rotate(-90 895 255)"
            textAnchor="middle" dominantBaseline="central"
            fontSize={11} fill="rgba(148,163,184,0.55)" fontWeight={600}
            fontFamily="'Inter',system-ui,sans-serif"
          >
            Total Seats: 645
          </text>
          <text
            x={920} y={255}
            transform="rotate(-90 920 255)"
            textAnchor="middle" dominantBaseline="central"
            fontSize={11} fill="rgba(148,163,184,0.55)" fontWeight={600}
            fontFamily="'Inter',system-ui,sans-serif"
          >
            Usable Seats: 600
          </text>

          {/* ── Seat sections ───────────────────────────────────── */}
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
