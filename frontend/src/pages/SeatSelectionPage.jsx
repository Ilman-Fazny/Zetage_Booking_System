// src/pages/SeatSelectionPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSeatMap } from "../lib/useSeatMap";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
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
  /* Emergency contact widget */
  .ssp-emergency {
    margin-top: 24px;
    padding: 13px 16px;
    background: linear-gradient(135deg, rgba(239,68,68,0.07) 0%, rgba(239,68,68,0.03) 100%);
    border: 1px solid rgba(239,68,68,0.22);
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ssp-emergency-icon {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.28);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 14px;
  }
  .ssp-emergency-text { flex: 1; }
  .ssp-emergency-label {
    font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(239,68,68,0.75); margin: 0 0 2px;
  }
  .ssp-emergency-name {
    font-size: 12.5px; font-weight: 600;
    color: rgba(224,214,255,0.9); margin: 0 0 1px;
  }
  .ssp-emergency-sub {
    font-size: 11px; color: rgba(156,163,175,0.5); margin: 0;
  }
  .ssp-emergency-link {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 7px;
    color: #fca5a5;
    font-size: 12.5px; font-weight: 600;
    font-family: monospace;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.2s, transform 0.15s;
  }
  .ssp-emergency-link:hover {
    background: rgba(239,68,68,0.18);
    transform: translateY(-1px);
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
  useDocumentTitle("Select Your Seat");

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

        {/* ── Emergency Support Contact ─────────────── */}
        <div className="ssp-emergency">
          <div className="ssp-emergency-icon">🆘</div>
          <div className="ssp-emergency-text">
            <p className="ssp-emergency-label">Need Help?</p>
            <p className="ssp-emergency-name">Ilman Fazny &mdash; Talent Show Co.</p>
            <p className="ssp-emergency-sub">Contact us for any booking issues</p>
          </div>
          <a
            id="ssp-emergency-call"
            href="tel:+94776702154"
            className="ssp-emergency-link"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            0776 702 154
          </a>
        </div>
      </div>
    </div>
  );
}
