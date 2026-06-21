// src/components/seat-map/sectionLayout.js
export const CANVAS_WIDTH = 1120;
export const CANVAS_HEIGHT = 900;

export const SEAT_SIZE = 18;
export const SEAT_GAP = 4;

export const SECTION_BLOCKS = {
  groundFloor:        { x: 293, y: 70,  rotate: false },
  balconyLeftStrips:  { x: 120, y: 70,  rotate: true  },
  balconyRightStrips: { x: 1000, y: 70, rotate: true  },
  balconyFront:       { x: 261, y: 620, rotate: false },
  balconyBottom:      { x: 206, y: 745, rotate: false },
};

export const STAGE = { x: 210, y: 10, width: 700, height: 45 };
