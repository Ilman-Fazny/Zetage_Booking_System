// src/pages/SeatSelectionPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSeatMap } from "../lib/useSeatMap";
import { useAuth } from "../context/AuthContext";
import TheatreMap from "../components/seat-map/TheatreMap";
import SeatLegend from "../components/seat-map/SeatLegend";
import SeatSummaryBar from "../components/seat-map/SeatSummaryBar";
import logo from "../assets/zentage-TS.png";

const EVENT_PRICE = 500; // LKR

/* Scoped styles injected once */
const SEAT_PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  .ssp-root {
    min-height: 100svh;
    background-color: #0B0F19;
    background-image:
      radial-gradient(ellipse 70% 40% at 50% 0%, rgba(109,40,217,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 40% 30% at 0% 100%, rgba(59,130,246,0.06) 0%, transparent 50%);
    padding: 20px 16px 110px;
    font-family: 'Inter', system-ui, sans-serif;
    box-sizing: border-box;
    width: 100%;
  }
  .ssp-inner {
    max-width: 820px;
    margin: 0 auto;
  }
  .ssp-loading {
    min-height: 100svh;
    background: #0B0F19;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(167,139,250,0.7);
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    letter-spacing: 0.05em;
  }
  .ssp-error {
    min-height: 100svh;
    background: #0B0F19;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f87171;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "zentage-ssp-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
}

export default function SeatSelectionPage() {
  useInjectStyles(SEAT_PAGE_STYLES);

  const { sections, selectedSeats, selectSeat, loading, error } = useSeatMap();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleContinue() {
    if (!selectedSeats.length) return;
    navigate("/details", { state: { seats: selectedSeats } });
  }

  if (loading) {
    return (
      <div className="ssp-loading">
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "rgba(139,92,246,0.8)",
            animation: "ssp-pulse 1.2s ease-in-out infinite",
            display: "inline-block",
          }} />
          Loading seat map…
        </span>
      </div>
    );
  }
  if (error) {
    return <div className="ssp-error">{error}</div>;
  }

  return (
    <div className="ssp-root">
      <div className="ssp-inner">

        {/* ── Top Bar Links ──────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: 8 }}>
          <Link
            to="/my-ticket"
            style={{
              fontSize: 11,
              color: "rgba(52, 211, 153, 0.75)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              fontWeight: 600,
              borderBottom: "1px solid rgba(52, 211, 153, 0.3)",
              paddingBottom: 1,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(52, 211, 153, 1)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(52, 211, 153, 0.75)"}
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
              Zentage Talent Show · September 6, 2026 · Elphinstone Theatre
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

        {/* ── Theatre Map ─────────────────────────────────────── */}
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
      </div>
    </div>
  );
}
