// src/components/seat-map/SeatSummaryBar.jsx
import { motion, AnimatePresence } from "framer-motion";
import { microSpring } from "../../lib/motionVariants";
import { calculateTotal, getTierBreakdown } from "../../lib/pricing";

export default function SeatSummaryBar({ selectedSeats, onContinue }) {
  const count = selectedSeats.length;
  const total = calculateTotal(selectedSeats);
  const breakdown = getTierBreakdown(selectedSeats);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="summary-bar"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
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
          {count === 0 ? (
            <p style={{
              width: "100%",
              textAlign: "center",
              fontSize: 13,
              color: "rgba(156,163,175,0.6)",
              fontFamily: "'Inter',system-ui,sans-serif",
              letterSpacing: "0.02em",
              margin: 0,
            }}>
              ✦ Tap seats to select them
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
                  {count} seat{count > 1 ? "s" : ""} selected
                </p>
                {/* Tier breakdown */}
                <p style={{
                  margin: "2px 0 0",
                  fontSize: 11,
                  color: "rgba(167,139,250,0.6)",
                  fontFamily: "'Inter',system-ui,sans-serif",
                  maxWidth: 400,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {breakdown.map(b =>
                    `${b.count}× ${b.label} (${b.unitPrice})`
                  ).join("  ·  ")}
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
                    LKR {total.toLocaleString()}
                  </p>
                </div>

                <motion.button
                  id="btn-continue"
                  onClick={onContinue}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96, y: 0 }}
                  transition={microSpring}
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
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  Continue →
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

