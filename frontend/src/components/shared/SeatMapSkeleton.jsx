// src/components/shared/SeatMapSkeleton.jsx
import React from 'react';

export default function SeatMapSkeleton() {
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
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) scale(0.7)", // scale to fit the 1060x900 canvas nicely in 70vh
        width: 1060,
        height: 900,
        pointerEvents: "none"
      }}>
        {/* Stage */}
        <div className="skeleton-shimmer" style={{
          position: 'absolute',
          left: 250, top: 8, width: 590, height: 42,
          borderRadius: 8, opacity: 0.15
        }} />

        {/* Ground Floor Rows (Rows A-Q => 17 rows) */}
        {Array.from({ length: 17 }).map((_, i) => (
          <React.Fragment key={`gf-${i}`}>
            {/* Left Block (7 seats) */}
            <div className="skeleton-shimmer" style={{
              position: 'absolute', left: 280, top: 68 + i * 22, width: 150, height: 16,
              borderRadius: 4, opacity: 0.2
            }} />
            {/* Center Block (8 seats) */}
            <div className="skeleton-shimmer" style={{
              position: 'absolute', left: 470, top: 68 + i * 22, width: 172, height: 16,
              borderRadius: 4, opacity: 0.2
            }} />
            {/* Right Block (7 seats) */}
            <div className="skeleton-shimmer" style={{
              position: 'absolute', left: 682, top: 68 + i * 22, width: 150, height: 16,
              borderRadius: 4, opacity: 0.2
            }} />
          </React.Fragment>
        ))}

        {/* Balcony Left Side (Rows A-U => 21 rows) */}
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={`bl-${i}`} className="skeleton-shimmer" style={{
            position: 'absolute', left: 130, top: 68 + i * 22, width: 40, height: 16,
            borderRadius: 4, opacity: 0.2
          }} />
        ))}

        {/* Balcony Right Side (Rows A-U => 21 rows) */}
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={`br-${i}`} className="skeleton-shimmer" style={{
            position: 'absolute', left: 918, top: 68 + i * 22, width: 40, height: 16,
            borderRadius: 4, opacity: 0.2
          }} />
        ))}

        {/* Balcony Front Side (Rows UA-UE => 5 rows) */}
        {Array.from({ length: 5 }).map((_, i) => (
          <React.Fragment key={`bf-${i}`}>
            <div className="skeleton-shimmer" style={{
              position: 'absolute', left: 248, top: 600 + i * 22, width: 250, height: 16,
              borderRadius: 4, opacity: 0.2
            }} />
            <div className="skeleton-shimmer" style={{
              position: 'absolute', left: 592, top: 600 + i * 22, width: 250, height: 16,
              borderRadius: 4, opacity: 0.2
            }} />
          </React.Fragment>
        ))}

        {/* Balcony Bottom Side (Rows UF-UI => 4 rows) */}
        {Array.from({ length: 4 }).map((_, i) => (
          <React.Fragment key={`bb-${i}`}>
            <div className="skeleton-shimmer" style={{
              position: 'absolute', left: 194, top: 720 + i * 22, width: 320, height: 16,
              borderRadius: 4, opacity: 0.2
            }} />
            <div className="skeleton-shimmer" style={{
              position: 'absolute', left: 576, top: 720 + i * 22, width: 320, height: 16,
              borderRadius: 4, opacity: 0.2
            }} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
