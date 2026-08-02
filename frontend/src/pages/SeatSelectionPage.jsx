// src/pages/SeatSelectionPage.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSeatMap } from "../lib/useSeatMap";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import TheatreMap from "../components/seat-map/TheatreMap";
import SeatLegend from "../components/seat-map/SeatLegend";
import SeatSummaryBar from "../components/seat-map/SeatSummaryBar";
import logo from "../assets/zentage-TS.png";
import SeatMapSkeleton from "../components/shared/SeatMapSkeleton";
import { motion } from "framer-motion";


/* Scoped styles injected once */




export default function SeatSelectionPage() {
  useDocumentTitle("Select Your Seat");

  const { sections, selectedSeats, selectSeat, loading, error } = useSeatMap();
  const { user } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  function handleContinue() {
    if (!selectedSeats.length) return;
    navigate("/details", { state: { seats: selectedSeats } });
  }

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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

            {/* Floating Scroll Down button to bypass SVG map on mobile */}
            <motion.button
              onClick={scrollToBottom}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "fixed",
                bottom: "85px",
                right: "20px",
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 30px rgba(109, 40, 217, 0.45), 0 0 10px rgba(109, 40, 217, 0.2)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 99,
                outline: "none",
              }}
              title="Scroll to bottom"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </motion.button>
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
        <div ref={bottomRef} style={{ height: "1px" }} />
      </div>
    </div>
  );
}
