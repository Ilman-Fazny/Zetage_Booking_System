// src/components/seat-map/SeatSummaryBar.jsx
export default function SeatSummaryBar({ selectedSeat, price, onContinue }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: "0 24px",
      background: "rgba(11,15,25,0.75)",
      backdropFilter: "blur(20px) saturate(1.5)",
      WebkitBackdropFilter: "blur(20px) saturate(1.5)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "0 -4px 40px rgba(0,0,0,0.5), 0 -1px 0 rgba(139,92,246,0.1)",
    }}>
      {/* Top glow edge */}
      <div style={{
        position: "absolute",
        top: 0, left: "20%", right: "20%", height: 1,
        background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.4),transparent)",
      }} />

      <div style={{
        maxWidth: 768,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
      }}>
        {!selectedSeat ? (
          <p style={{
            width: "100%",
            textAlign: "center",
            fontSize: 13,
            color: "rgba(156,163,175,0.6)",
            fontFamily: "'Inter',system-ui,sans-serif",
            letterSpacing: "0.02em",
            margin: 0,
          }}>
            ✦ Tap a seat to select it
          </p>
        ) : (
          <>
            <div>
              <p style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                color: "#e2d9ff",
                fontFamily: "'Inter',system-ui,sans-serif",
                letterSpacing: "0.02em",
              }}>
                {selectedSeat.seat_code}
              </p>
              <p style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: "rgba(167,139,250,0.7)",
                fontFamily: "'Inter',system-ui,sans-serif",
              }}>
                {selectedSeat.section}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <p style={{
                  margin: 0,
                  fontSize: 11,
                  color: "rgba(156,163,175,0.5)",
                  fontFamily: "'Inter',system-ui,sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>
                  Total
                </p>
                <p style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#f5f3ff",
                  fontFamily: "'Inter',system-ui,sans-serif",
                  letterSpacing: "-0.01em",
                }}>
                  LKR {price.toLocaleString()}
                </p>
              </div>

              <button
                id="btn-continue"
                onClick={onContinue}
                style={{
                  padding: "11px 28px",
                  background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 50%,#5b21b6 100%)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Inter',system-ui,sans-serif",
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(109,40,217,0.5), 0 4px 12px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(109,40,217,0.7), 0 6px 18px rgba(109,40,217,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(109,40,217,0.5), 0 4px 12px rgba(109,40,217,0.35), inset 0 1px 0 rgba(255,255,255,0.12)";
                }}
              >
                Continue →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
