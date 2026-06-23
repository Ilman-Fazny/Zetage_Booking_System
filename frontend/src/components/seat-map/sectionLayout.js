// src/components/seat-map/sectionLayout.js
// ─── Canvas ───────────────────────────────────────────────────────────────────
// Total visible area. The right strips at ~890+22+18 ≈ 930px → fits cleanly.
export const CANVAS_WIDTH  = 1060;
export const CANVAS_HEIGHT = 900;

// ─── Seat geometry ───────────────────────────────────────────────────────────
export const SEAT_SIZE = 18;   // square seat size in px
export const SEAT_GAP  = 4;    // gap between seats

// ─── Block anchor points ──────────────────────────────────────────────────────
// Ground floor (all three sub-blocks are rendered together):
//   Left   sub-block  (seats  1- 7): blockX + (num-1)*STEP
//   Center sub-block  (seats  8-15): blockX + 7*STEP + GF_AISLE + (num-8)*STEP
//   Right  sub-block  (seats 16-22): blockX + 7*STEP + GF_AISLE + 8*STEP + GF_AISLE + (num-16)*STEP
// Row A-Q: Y = blockY + rowIndex * STEP
//
// Ground floor right-edge ≈ 280 + 7*22 + 36 + 8*22 + 36 + 6*22 + 18 = 280+154+36+176+36+132+18 = 832 px
export const SECTION_BLOCKS = {
  groundFloor:        { x: 280, y: 68 },

  // Left side strips (2 columns: outer col=0 at blockX, inner col=1 at blockX+step)
  balconyLeftStrips:  { x: 130, y: 68 },

  // Right side strips (2 columns: outer col=0 at blockX, inner col=1 at blockX-step)
  balconyRightStrips: { x: 940, y: 68 },

  // Lower balcony front rows UA-UE
  balconyFront:       { x: 248, y: 600 },

  // Lower balcony bottom rows UF-UI
  balconyBottom:      { x: 194, y: 720 },
};

// ─── Stage ────────────────────────────────────────────────────────────────────
// Centered above the ground floor block.
// Ground floor spans approx x=280 to x=832 (552px wide).
// Stage: x=250 to x=840 → width=590, centered with slight margins on each side.
export const STAGE = { x: 250, y: 8, width: 590, height: 42 };
