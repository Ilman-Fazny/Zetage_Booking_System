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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  
  useEffect(() => {
    const hasChosen = sessionStorage.getItem("hasChosenBookingType");
    if (user && hasChosen !== "true") {
      setShowChoiceModal(true);
    } else {
      setShowChoiceModal(false);
    }
  }, [user]);

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
          {user && (
            <button
              onClick={logout}
              style={{
                fontSize: 11,
                color: "rgba(239, 68, 68, 0.75)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                fontWeight: 600,
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(239, 68, 68, 0.3)",
                padding: 0,
                paddingBottom: 1,
                cursor: "pointer",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(239, 68, 68, 1)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(239, 68, 68, 0.75)"}
            >
              Log Out
            </button>
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
            padding: 16
          }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)"
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "linear-gradient(165deg, #1e1b4b 0%, #0f0a2e 100%)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: 20,
                padding: "28px 24px",
                width: "100%",
                maxWidth: 380,
                position: "relative",
                zIndex: 10000,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.1)",
                textAlign: "center",
                boxSizing: "border-box"
              }}
            >
              {/* Welcome text */}
              <p style={{ margin: "0 0 4px", color: "rgba(167, 139, 250, 0.7)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Welcome back
              </p>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, color: "#fff", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                Ready to pick your seats?
              </h2>
              <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>
                Browse the interactive seat map and choose your exact seats for Zentage.
              </p>

              {/* Primary CTA */}
              <motion.button
                onClick={() => {
                  sessionStorage.setItem("hasChosenBookingType", "true");
                  setShowChoiceModal(false);
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(245, 158, 11, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  border: "none",
                  borderRadius: 12,
                  color: "#000",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxSizing: "border-box",
                  transition: "box-shadow 0.2s ease"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                </svg>
                Open Seat Map
              </motion.button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Secondary link */}
              <a
                href="https://www.ticketsministry.com/theatre/zentage/018d5fdb-7c2b-4c56-b070-fb58ce53443f"
                target="_blank"
                rel="noreferrer"
                onClick={() => sessionStorage.setItem("hasChosenBookingType", "true")}
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 13,
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.15s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4
                }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              >
                Buy via TicketsMinistry instead
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
              </a>
              <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.3)", fontSize: 11, lineHeight: 1.4 }}>
                Seat numbers are randomly assigned on TicketsMinistry
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
