// src/components/seat-map/TheatreMap.jsx
import { useRef, useState } from "react";
import SeatSection from "./SeatSection";
import { CANVAS_WIDTH, CANVAS_HEIGHT, SECTION_BLOCKS, STAGE } from "./sectionLayout";

// Function to map each seat to its correct visual block based on its section and row
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
  return "groundFloor"; // fallback
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

  // Group all seats across all sections by their visual block
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
    <div className="relative w-full h-[70vh] overflow-hidden bg-neutral-100 rounded-xl border border-neutral-200">
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        <button
          onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
          className="w-8 h-8 bg-white rounded-lg border border-neutral-300 text-sm font-medium shadow-sm"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.4, s - 0.2))}
          className="w-8 h-8 bg-white rounded-lg border border-neutral-300 text-sm font-medium shadow-sm"
        >
          −
        </button>
        <button
          onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
          className="px-2 h-8 bg-white rounded-lg border border-neutral-300 text-xs font-medium shadow-sm"
        >
          Reset
        </button>
      </div>

      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="w-full h-full touch-none"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <g transform={`translate(${pan.x} ${pan.y}) scale(${scale})`}>
          {/* Stage */}
          <rect
            x={STAGE.x} y={STAGE.y} width={STAGE.width} height={STAGE.height}
            rx={6} fill="#b91c1c" stroke="#991b1b" strokeWidth={1}
          />
          <text
            x={STAGE.x + STAGE.width / 2} y={STAGE.y + STAGE.height / 2}
            textAnchor="middle" dominantBaseline="central"
            fontSize={12} fill="#fff" fontWeight={600}
          >
            ( Length 50 feet ) - Stage - ( Width 29 feet )
          </text>

          {/* Sound Light Control Unit */}
          <g>
            <rect
              x={492} y={395} width={176} height={35}
              rx={2} fill="#7e22ce" stroke="#6b21a8" strokeWidth={1}
            />
            <text
              x={492 + 176 / 2} y={395 + 35 / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize={10} fill="#fff" fontWeight={500}
            >
              Sound Light Control Unit
            </text>
          </g>

          {/* Seats counts under ground floor blocks */}
          <text
            x={370} y={452}
            textAnchor="middle" dominantBaseline="central"
            fontSize={10} fill="#475569" fontWeight={600}
          >
            Seats 117
          </text>
          <text
            x={571} y={387}
            textAnchor="middle" dominantBaseline="central"
            fontSize={10} fill="#475569" fontWeight={600}
          >
            Seats 112
          </text>
          <text
            x={772} y={452}
            textAnchor="middle" dominantBaseline="central"
            fontSize={10} fill="#475569" fontWeight={600}
          >
            Seats 117
          </text>

          {/* Ground Floor Total Bar */}
          <g>
            <rect
              x={293} y={465} width={566} height={20}
              fill="#eab308" rx={2}
            />
            <text
              x={293 + 566 / 2} y={465 + 20 / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize={11} fill="#1e1b4b" fontWeight={600}
            >
              Ground Floor Total Number Of Seats            346
            </text>
          </g>

          {/* Balcony Total Bar */}
          <g>
            <rect
              x={293} y={490} width={566} height={20}
              fill="#6366f1" rx={2}
            />
            <text
              x={293 + 566 / 2} y={490 + 20 / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize={11} fill="#fff" fontWeight={600}
            >
              Balcony Total Number Of Seats            299
            </text>
          </g>

          {/* Total Seats Text */}
          <text
            x={293 + 566 / 2} y={530}
            textAnchor="middle" dominantBaseline="central"
            fontSize={13} fill="#dc2626" fontWeight={700}
          >
            Total Seats            645
          </text>

          {/* Balcony Front Side Total Bar */}
          <text
            x={571} y={735}
            textAnchor="middle" dominantBaseline="central"
            fontSize={11} fill="#1e293b" fontWeight={700}
          >
            Balcony Front Side Number Total Of Seats 222
          </text>

          {/* Side strip vertical labels */}
          <text
            x={210} y={255}
            transform="rotate(-90 210 255)"
            textAnchor="middle" dominantBaseline="central"
            fontSize={12} fill="#1e293b" fontWeight={700}
          >
            Balcony Left Side Number Of Seats 38
          </text>
          <text
            x={895} y={255}
            transform="rotate(-90 895 255)"
            textAnchor="middle" dominantBaseline="central"
            fontSize={12} fill="#1e293b" fontWeight={700}
          >
            Total Seats : 645
          </text>
          <text
            x={920} y={255}
            transform="rotate(-90 920 255)"
            textAnchor="middle" dominantBaseline="central"
            fontSize={12} fill="#1e293b" fontWeight={700}
          >
            Usable Seats : 600
          </text>

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
