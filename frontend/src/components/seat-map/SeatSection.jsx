// src/components/seat-map/SeatSection.jsx
import Seat from "./Seat";
import { SEAT_SIZE, SEAT_GAP } from "./sectionLayout";

// // ── Left Side Strips Coordinate Helper ─────────────────────────────
function getLeftStripCoords(row, number) {
  const isInner = row.endsWith("b");
  const step = SEAT_SIZE + SEAT_GAP;
  let col = isInner ? 1 : 0;
  
  let y = 0;
  if (row.startsWith("UL1")) {
    const idx = number >= 5 ? number - 5 : number - 1;
    y = 70 + idx * step;
  } else if (row.startsWith("UL9")) {
    const idx = number - 9; 
    y = 180 + idx * step;
  } else if (row.startsWith("UL13")) {
    let idx = 0;
    if (row === "UL13") {
      idx = number - 17; 
      if (number === 19 || number === 20) {
        col = -1;
      }
    } else { 
      const map = { 19: 0, 20: 1, 15: 2, 16: 3 };
      idx = map[number] !== undefined ? map[number] : 0;
    }
    y = 290 + idx * step;
  } else if (row.startsWith("UL31")) {
    let idx = 0;
    if (row === "UL31") {
      idx = number - 25; 
      if (number === 27 || number === 28) {
        col = -1;
      }
    } else { 
      const map = { 22: 0, 23: 1, 24: 2, 29: 3 };
      idx = map[number] !== undefined ? map[number] : 0;
    }
    y = 378 + idx * step;
  } else if (row.startsWith("UL29")) {
    let idx = 0;
    if (row === "UL29") {
      idx = number - 33; 
      if (number === 35 || number === 36) {
        col = -1;
      }
    } else { 
      const map = { 30: 0, 31: 1, 32: 2, 29: 3 };
      idx = map[number] !== undefined ? map[number] : 0;
    }
    y = 620 + idx * step;
  } else if (row.startsWith("UL37")) {
    const idx = number - 37; 
    y = 745 + idx * step;
  }
  return { col, y };
}

// ── Right Side Strips Coordinate Helper ────────────────────────────
function getRightStripCoords(row, number) {
  const isInner = row.endsWith("b");
  const step = SEAT_SIZE + SEAT_GAP;
  let col = isInner ? 1 : 0;
  
  let y = 0;
  if (row.startsWith("UR1")) {
    const idx = row === "UR1" ? number - 5 : number - 1;
    y = 70 + idx * step;
  } else if (row.startsWith("UR10")) {
    const idx = row === "UR10" ? number - 11 : 0;
    y = 202 + idx * step;
  } else if (row.startsWith("UR14")) {
    let idx = 0;
    if (row === "UR14") {
      idx = number - 15; 
      if (number === 17 || number === 18) {
        col = -1;
      }
    } else {
      const map = { 14: 0, 19: 1, 20: 2, 21: 3 };
      idx = map[number] !== undefined ? map[number] : 0;
    }
    y = 290 + idx * step;
  } else if (row.startsWith("UR22")) {
    let idx = 0;
    if (row === "UR22") {
      idx = number - 23; 
      if (number === 25 || number === 26) {
        col = -1;
      }
    } else {
      const map = { 22: 0, 27: 1, 28: 2, 29: 3 };
      idx = map[number] !== undefined ? map[number] : 0;
    }
    y = 378 + idx * step;
  } else if (row.startsWith("UR30")) {
    let idx = 0;
    if (row === "UR30") {
      idx = number - 31; 
      if (number === 33 || number === 34) {
        col = -1;
      }
    } else {
      const map = { 30: 0, 35: 1, 36: 2, 37: 3 };
      idx = map[number] !== undefined ? map[number] : 0;
    }
    y = 620 + idx * step;
  } else if (row.startsWith("UR37")) {
    const idx = number - 37; 
    y = 745 + idx * step;
  }
  return { col, y };
}

// ── Balcony Front Staggered Aisle Helper ───────────────────────────
function getFrontAisleOffset(row, number) {
  const aisle = 24;
  if (row.startsWith("UA")) {
    let offset = 0;
    if (number >= 6) offset += aisle;
    if (number >= 19) offset += aisle;
    return offset;
  }
  if (row.startsWith("UB")) {
    let offset = 0;
    if (number >= 7) offset += aisle;
    if (number >= 19) offset += aisle;
    return offset;
  }
  if (row.startsWith("UC")) {
    let offset = 0;
    if (number >= 8) offset += aisle;
    if (number >= 20) offset += aisle;
    return offset;
  }
  if (row.startsWith("UD")) {
    let offset = 0;
    if (number >= 7) offset += aisle;
    if (number >= 19) offset += aisle;
    return offset;
  }
  if (row.startsWith("UE")) {
    let offset = 0;
    if (number >= 8) offset += aisle;
    if (number >= 20) offset += aisle;
    return offset;
  }
  return 0;
}

// ── Balcony Bottom Staggered Aisle Helper ──────────────────────────
function getBottomAisleOffset(row, number) {
  const aisle = 24;
  if (row.startsWith("UF")) {
    if (number >= 6) return aisle;
  }
  if (row.startsWith("UG") || row === "UH22") {
    let offset = 0;
    if (number >= 11) offset += aisle;
    if (number >= 16) offset += aisle;
    if (number >= 22) offset += aisle;
    return offset;
  }
  if (row.startsWith("UH")) {
    let offset = 0;
    if (number >= 11) offset += aisle;
    if (number >= 22) offset += aisle;
    return offset;
  }
  if (row.startsWith("UI")) {
    let offset = 0;
    if (number >= 6) offset += aisle;
    if (number >= 25) offset += aisle;
    return offset;
  }
  return 0;
}

// ── Ground Floor Coordinate & Aisle Helpers ───────────────────────
function getGroundFloorColIndex(row, number) {
  const rowLetter = row[0];
  if (row.endsWith("1")) {
    return number - 1;
  }
  if (row.endsWith("8")) {
    if (rowLetter === "O") {
      return number - 8 + 15;
    } else {
      return number - 1;
    }
  }
  if (row.endsWith("16")) {
    return number - 1;
  }
  if (row.endsWith("7")) {
    return number - 7 + 16;
  }
  return number - 1;
}

function getGroundFloorAisleOffset(colIndex) {
  const aisle = 36;
  let offset = 0;
  if (colIndex >= 7) offset += aisle;
  if (colIndex >= 15) offset += aisle;
  return offset;
}


export default function SeatSection({ seats, blockKey, blockX, blockY, selectedSeat, onSelect }) {
  const step = SEAT_SIZE + SEAT_GAP;

  // 1. Position logic for Rotated Strips (Left / Right Balcony)
  if (blockKey === "balconyLeftStrips" || blockKey === "balconyRightStrips") {
    const isLeft = blockKey === "balconyLeftStrips";
    return (
      <g>
        {seats.map((seat) => {
          const { col, y } = isLeft
            ? getLeftStripCoords(seat.row, seat.number)
            : getRightStripCoords(seat.row, seat.number);
            
          const sx = isLeft
            ? blockX + col * step
            : blockX - col * step;
          
          return (
            <Seat
              key={seat.seat_code}
              seat={seat}
              x={sx}
              y={y}
              size={SEAT_SIZE}
              isSelected={selectedSeat?.seat_code === seat.seat_code}
              onSelect={onSelect}
            />
          );
        })}
      </g>
    );
  }

  // 2. Position logic for Balcony Front
  if (blockKey === "balconyFront") {
    const rowList = ["UA", "UB", "UC", "UD", "UE"];

    // Group seats by physical row
    const rows = {};
    for (const seat of seats) {
      const r = seat.row.substring(0, 2);
      if (!rows[r]) rows[r] = [];
      rows[r].push(seat);
    }

    return (
      <g>
        {rowList.map((rowLabel, rowIndex) => {
          const rowSeats = rows[rowLabel] || [];
          const rowY = blockY + rowIndex * step;

          return (
            <g key={rowLabel}>
              {/* Row Label */}
              <text
                x={blockX - 10}
                y={rowY + SEAT_SIZE / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={10}
                fill="rgba(148,163,184,0.45)"
              >
                {rowLabel}
              </text>
              {rowSeats.map((seat) => {
                const sx = blockX + (seat.number - 1) * step + getFrontAisleOffset(seat.row, seat.number);
                return (
                  <Seat
                    key={seat.seat_code}
                    seat={seat}
                    x={sx}
                    y={rowY}
                    size={SEAT_SIZE}
                    isSelected={selectedSeat?.seat_code === seat.seat_code}
                    onSelect={onSelect}
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    );
  }

  // 3. Position logic for Balcony Bottom
  if (blockKey === "balconyBottom") {
    const rowList = ["UF", "UG", "UH", "UI"];

    // Group seats by physical row
    const rows = {};
    for (const seat of seats) {
      let r = seat.row.substring(0, 2);
      if (seat.row === "UH22") r = "UG"; // UH22 belongs to Row G (UG)
      if (seat.row === "UH22b") r = "UH"; // UH22b belongs to Row H (UH)
      if (!rows[r]) rows[r] = [];
      rows[r].push(seat);
    }

    return (
      <g>
        {rowList.map((rowLabel, rowIndex) => {
          const rowSeats = rows[rowLabel] || [];
          const rowY = blockY + rowIndex * step;

          return (
            <g key={rowLabel}>
              {/* Row Label */}
              <text
                x={blockX - 10}
                y={rowY + SEAT_SIZE / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={10}
                fill="rgba(148,163,184,0.45)"
              >
                {rowLabel}
              </text>
              {rowSeats.map((seat) => {
                const sx = blockX + (seat.number - 1) * step + getBottomAisleOffset(seat.row, seat.number);
                return (
                  <Seat
                    key={seat.seat_code}
                    seat={seat}
                    x={sx}
                    y={rowY}
                    size={SEAT_SIZE}
                    isSelected={selectedSeat?.seat_code === seat.seat_code}
                    onSelect={onSelect}
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    );
  }

  // 4. Position logic for Ground Floor (All Blocks Unified)
  const rowList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"];
  
  // Group seats by row letter
  const rows = {};
  for (const seat of seats) {
    const r = seat.row[0]; // first letter (A-Q)
    if (!rows[r]) rows[r] = [];
    rows[r].push(seat);
  }

  return (
    <g>
      {rowList.map((rowLabel, rowIndex) => {
        const rowSeats = rows[rowLabel] || [];
        if (rowSeats.length === 0) return null;
        
        const rowY = blockY + rowIndex * step;

        return (
          <g key={rowLabel}>
            {/* Row Label */}
            <text
              x={blockX - 10}
              y={rowY + SEAT_SIZE / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={10}
              fill="rgba(148,163,184,0.45)"
            >
              {rowLabel}
            </text>
            {rowSeats.map((seat) => {
              const colIndex = getGroundFloorColIndex(seat.row, seat.number);
              const sx = blockX + colIndex * step + getGroundFloorAisleOffset(colIndex);
              return (
                <Seat
                  key={seat.seat_code}
                  seat={seat}
                  x={sx}
                  y={rowY}
                  size={SEAT_SIZE}
                  isSelected={selectedSeat?.seat_code === seat.seat_code}
                  onSelect={onSelect}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
