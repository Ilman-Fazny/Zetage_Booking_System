// src/pages/SeatSelectionPage.jsx
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import { useSeatMap } from "../lib/useSeatMap";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import TheatreMap from "../components/seat-map/TheatreMap";
import SeatLegend from "../components/seat-map/SeatLegend";
import SeatSummaryBar from "../components/seat-map/SeatSummaryBar";
import logo from "../assets/zentage-TS.png";
import SeatMapSkeleton from "../components/shared/SeatMapSkeleton";
import { motion, AnimatePresence } from "framer-motion";


/* Scoped styles injected once */




export default function SeatSelectionPage() {
  useDocumentTitle("Select Your Seat");

  const { sections, selectedSeats, selectSeat, loading, error } = useSeatMap();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showChoiceModal, setShowChoiceModal] = useState(true);

  function handleContinue() {
    if (!selectedSeats.length) return;
    navigate("/details", { state: { seats: selectedSeats } });
  }

  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight || 0;
      
      // If we are within 180px of the bottom, hide the arrow
      if (scrollTop + clientHeight >= scrollHeight - 180) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollClick = () => {
    if (isAtBottom) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight || document.body.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="ssp-root">
      <div className="ssp-inner">

        {/* ── Top Bar Links ──────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: 8 }}>
          <Link
            to="/my-ticket"
            style={{
              fontSize: 11,
              color: "rgba(251, 191, 36, 0.75)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              fontWeight: 600,
              borderBottom: "1px solid rgba(251, 191, 36, 0.3)",
              paddingBottom: 1,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(251, 191, 36, 1)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(251, 191, 36, 0.75)"}
          >
            My Ticket →
          </Link>
          {user?.is_admin && (
            <Link
              to="/admin"
              style={{
                fontSize: 11,
                color: "rgba(167, 139, 250, 0.6)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                fontWeight: 500,
                borderBottom: "1px solid rgba(167, 139, 250, 0.25)",
                paddingBottom: 1,
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(167, 139, 250, 0.9)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(167, 139, 250, 0.6)"}
            >
              Admin panel →
            </Link>
          )}
        </div>

        {/* ── Header: Logo + Title ─────────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 24,
          gap: 8,
        }}>
          {/* Logo */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{
              position: "absolute", inset: -10,
              background: "radial-gradient(ellipse, rgba(139,92,246,0.2) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(12px)",
              pointerEvents: "none",
            }} />
            <img
              src={logo}
              alt="Zentage Talent Show"
              style={{
                height: 60,
                width: "auto",
                objectFit: "contain",
                position: "relative",
                filter: "drop-shadow(0 0 18px rgba(139,92,246,0.55))",
              }}
            />
          </div>

          {/* Title */}
          <div>
            <h1 style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#e2d9ff",
              letterSpacing: "-0.02em",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              Select Your Seat
            </h1>
            <p style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "rgba(167,139,250,0.65)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}>
              Zentage Talent Show - September 6, 2026 - Elphinstone Theatre
            </p>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────── */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)",
          marginBottom: 20,
        }} />

        {/* ── Legend ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <SeatLegend />
        </div>

        {/* ── Theatre Map or Loading State ──────────────────────── */}
        {loading ? (
          <SeatMapSkeleton />
        ) : error ? (
          <div className="ssp-error">{error}</div>
        ) : (
          <>
            <TheatreMap
              sections={sections}
              selectedSeats={selectedSeats}
              onSelect={selectSeat}
            />

            {/* ── Floating Summary Drawer ──────────────────────────── */}
            <SeatSummaryBar
              selectedSeats={selectedSeats}
              onContinue={handleContinue}
            />
          </>
        )}

        {/* ── Emergency Support Contact ─────────────── */}
        <div style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "11px",
          color: "rgba(156, 163, 175, 0.4)",
          letterSpacing: "0.02em"
        }}>
          Emergency support: <a href="tel:+94776702154" style={{ color: "rgba(248, 113, 113, 0.6)", textDecoration: "none", fontWeight: "500" }}>0776 702 154</a> (Ilman Fazny - Talent Show Co.)
        </div>
      </div>

      {/* Floating Scroll Arrow Button (fixed in user viewport) */}
      {createPortal(
        <AnimatePresence>
          {selectedSeats.length > 0 && (
            <motion.button
              onClick={handleScrollClick}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                position: "fixed",
                right: "24px",
                bottom: "12vh",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(124, 58, 237, 0.4)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(139, 92, 246, 0.6)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 1000,
                boxShadow: "0 8px 32px rgba(109, 40, 217, 0.35), 0 0 15px rgba(139, 92, 246, 0.25)",
                outline: "none"
              }}
              whileHover={{ scale: 1.1, background: "rgba(124, 58, 237, 0.65)" }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isAtBottom ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  marginTop: isAtBottom ? "-2px" : "2px"
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Booking Choice Modal */}
      <AnimatePresence>
        {showChoiceModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20
          }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "#1e1b4b", // deep rich purple/indigo
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: 24,
                padding: "32px 24px",
                width: "100%",
                maxWidth: 440,
                position: "relative",
                zIndex: 10000,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.15)",
                display: "flex",
                flexDirection: "column",
                gap: 24
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h2 style={{ margin: "0 0 8px", fontSize: 24, color: "#fff", fontWeight: 700, letterSpacing: "-0.02em" }}>Choose Booking Type</h2>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.5 }}>
                  Please select how you want to book your seats.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* TicketsMinistry Card */}
                <motion.a 
                  href="https://www.ticketsministry.com/theatre/zentage/018d5fdb-7c2b-4c56-b070-fb58ce53443f"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02, y: -3, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "20px 24px",
                    textAlign: "left",
                    transition: "border-color 0.2s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.4)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#06b6d4",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background: "rgba(6, 182, 212, 0.1)",
                        padding: "2px 8px",
                        borderRadius: 99,
                        display: "inline-block",
                        marginBottom: 6
                      }}>
                        Partner Portal
                      </span>
                      <h3 style={{ margin: 0, color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>
                        Standard Booking
                      </h3>
                    </div>
                    {/* TicketsMinistry SVG logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", padding: "4px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                        <path d="M9 9h.01M9 15h.01M15 9h.01M15 15h.01"/>
                      </svg>
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>TICKETS<span style={{ color: "#06b6d4" }}>MINISTRY</span></span>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.4, fontWeight: 500 }}>
                    Buy standard tickets for any tier:
                  </p>
                  <div style={{
                    margin: "8px 0 10px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", padding: "2px 8px", borderRadius: 4 }}>Normal: 500</span>
                    <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", padding: "2px 8px", borderRadius: 4 }}>Standard: 600</span>
                    <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(245, 158, 11, 0.85)", padding: "2px 8px", borderRadius: 4 }}>Premium: 800</span>
                  </div>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 12, fontStyle: "italic", lineHeight: 1.3 }}>
                    *Note: You cannot choose exact seat numbers on TicketsMinistry.
                  </p>
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, color: "#06b6d4", fontSize: 12.5, fontWeight: 700 }}>
                    Book via TicketMinistry <span>→</span>
                  </div>
                </motion.a>

                {/* Select by Seat Number Card */}
                <motion.button
                  onClick={() => setShowChoiceModal(false)}
                  whileHover={{ scale: 1.02, y: -3, borderColor: "rgba(245, 158, 11, 0.5)", boxShadow: "0 12px 30px rgba(245, 158, 11, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: "linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 10, 50, 0.9) 100%)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    borderRadius: 16,
                    padding: "20px 24px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Subtle golden ambient background glow */}
                  <div style={{
                    position: "absolute",
                    top: "-50%",
                    right: "-20%",
                    width: 140,
                    height: 140,
                    background: "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)",
                    pointerEvents: "none"
                  }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      {/* Pulsing Gold Badge */}
                      <motion.span 
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#f59e0b",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          background: "rgba(245, 158, 11, 0.12)",
                          padding: "2px 8px",
                          borderRadius: 99,
                          display: "inline-block",
                          marginBottom: 6,
                          border: "1px solid rgba(245, 158, 11, 0.2)"
                        }}
                      >
                        Early Bird Special (Closes Soon)
                      </motion.span>
                      <h3 style={{ margin: 0, color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>
                        Choose specific seats on our interactive map.
                      </h3>
                    </div>
                    {/* Gold Star / Seat grid SVG logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245, 158, 11, 0.05)", padding: "4px 8px", borderRadius: 8, border: "1px solid rgba(245, 158, 11, 0.15)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                      </svg>
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.05em" }}>SEAT MAP</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 12.5, lineHeight: 1.4 }}>
                    Choose exact rows/numbers from the interactive layout. Requires bank slip upload.
                  </p>
                  <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.3 }}>
                    *Book by making a direct payment OR by uploading your pre-purchased TicketsMinistry ticket/screenshot to claim your specific seat code.
                  </p>
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", fontSize: 12.5, fontWeight: 700 }}>
                    Proceed to Interactive Map <span>→</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
