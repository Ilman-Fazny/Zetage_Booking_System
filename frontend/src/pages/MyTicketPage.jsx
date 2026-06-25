import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchMyBooking } from "../lib/bookings";
import { popVariants, fadeUpVariants, microSpring } from "../lib/motionVariants";
import TicketCard from "../components/shared/TicketCard";

const EVENT = {
  name: "Zentage Talent Show",
  date: "September 6, 2026",
  time: "6:00 PM onwards",
  venue: "Elphinstone Theatre",
  location: "Maradana, Colombo",
  price: "LKR 500",
  org: "Sasnaka Sansada Foundation",
};

/* ─── Injected scoped styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .tp-root {
    min-height: 100svh;
    background-color: #0B0F19;
    background-image:
      radial-gradient(ellipse 70% 50% at 50% -5%, rgba(180,130,40,0.09) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 100%, rgba(109,40,217,0.07) 0%, transparent 55%);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px 60px;
    font-family: 'Inter', system-ui, sans-serif;
    box-sizing: border-box;
    color: #ede8ff;
  }

  .tp-wrapper {
    width: 100%;
    max-width: 400px;
    animation: tp-fadeup 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes tp-fadeup {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .tp-header {
    text-align: center;
    margin-bottom: 28px;
    animation: tp-fadeup 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .tp-check-ring {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(167,139,250,0.18) 0%, rgba(167,139,250,0.06) 60%, transparent 100%);
    border: 1.5px solid rgba(167,139,250,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
    box-shadow: 0 0 18px rgba(167,139,250,0.2), 0 0 40px rgba(167,139,250,0.08);
    animation: tp-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
  }
  @keyframes tp-pop {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }
  .tp-title {
    font-size: 22px;
    font-weight: 700;
    color: #f0ece8;
    letter-spacing: -0.03em;
    margin: 0 0 6px;
  }
  .tp-subtitle {
    font-size: 13px;
    color: rgba(180,170,210,0.6);
    letter-spacing: 0.01em;
    margin: 0;
  }

  /* ── Ticket card shell ── */
  .tp-card {
    position: relative;
    background: linear-gradient(160deg, #161A28 0%, #111520 50%, #0F1322 100%);
    border-radius: 20px;
    overflow: visible;
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow:
      0 0 0 1px rgba(202,162,23,0.05),
      0 30px 70px rgba(0,0,0,0.65),
      0 8px 20px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.06);
    animation: tp-fadeup 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }

  /* Top-edge glow */
  .tp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(202,162,23,0.55), transparent);
    border-radius: 100%;
  }

  /* ── Gold confirmed banner ── */
  .tp-banner {
    background: linear-gradient(90deg, #92700a 0%, #c9a220 30%, #f0d060 55%, #c9a220 75%, #92700a 100%);
    padding: 9px 20px;
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }
  .tp-banner-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(15,19,34,0.5);
    flex-shrink: 0;
  }
  .tp-banner-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #0f1322;
    font-family: 'Inter', system-ui, sans-serif;
  }

  /* ── Ticket header ── */
  .tp-ticket-head {
    padding: 18px 22px 14px;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .tp-org {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(202,162,23,0.65);
    margin: 0 0 6px;
  }
  .tp-event-name {
    font-size: 18px;
    font-weight: 700;
    color: #ede8ff;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
  }
  .tp-event-meta {
    font-size: 11.5px;
    color: rgba(180,170,210,0.5);
    margin: 0;
    letter-spacing: 0.02em;
  }

  /* ── Perforated cut divider ── */
  .tp-perf-wrap {
    position: relative;
    padding: 14px 0;
    display: flex;
    align-items: center;
  }
  .tp-perf-notch {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #0B0F19;
    border: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    position: absolute;
    top: 50%; transform: translateY(-50%);
    z-index: 2;
  }
  .tp-perf-notch.left  { left: -11px; }
  .tp-perf-notch.right { right: -11px; }
  .tp-perf-line {
    flex: 1;
    border: none;
    border-top: 1.5px dashed rgba(255,255,255,0.09);
    margin: 0 16px;
    height: 1.5px;
  }

  /* ── QR scanner frame ── */
  .tp-qr-zone {
    padding: 4px 22px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .tp-qr-frame {
    position: relative;
    padding: 12px;
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .tp-qr-frame::before,
  .tp-qr-frame::after,
  .tp-qr-corner-tr,
  .tp-qr-corner-bl {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    border-color: rgba(202,162,23,0.6);
    border-style: solid;
  }
  .tp-qr-frame::before {
    top: -1px; left: -1px;
    border-width: 2px 0 0 2px;
    border-radius: 4px 0 0 0;
  }
  .tp-qr-frame::after {
    bottom: -1px; right: -1px;
    border-width: 0 2px 2px 0;
    border-radius: 0 0 4px 0;
  }
  .tp-qr-corner-tr {
    top: -1px; right: -1px;
    border-width: 2px 2px 0 0;
    border-radius: 0 4px 0 0;
  }
  .tp-qr-corner-bl {
    bottom: -1px; left: -1px;
    border-width: 0 0 2px 2px;
    border-radius: 0 0 0 4px;
  }
  .tp-qr-canvas {
    border-radius: 6px;
    display: block;
  }
  .tp-qr-hint {
    font-size: 10.5px;
    color: rgba(180,170,210,0.4);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    font-weight: 500;
  }

  /* ── Ticket detail rows ── */
  .tp-details {
    padding: 6px 22px 20px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .tp-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .tp-row:last-child { border-bottom: none; }
  .tp-row-label {
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(180,170,210,0.38);
  }
  .tp-row-value {
    font-size: 13px;
    font-weight: 600;
    color: rgba(230,225,255,0.85);
    text-align: right;
    max-width: 58%;
    word-break: break-word;
  }
  .tp-row-value.mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: rgba(202,162,23,0.9);
    letter-spacing: 0.04em;
  }
  .tp-row.highlight .tp-row-value {
    color: #a78bfa;
    font-size: 14px;
  }

  /* ── Bottom strip ── */
  .tp-foot {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 12px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 20px 20px;
    background: rgba(255,255,255,0.015);
  }
  .tp-foot-text {
    font-size: 10px;
    color: rgba(180,170,210,0.3);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .tp-foot-badge {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(202,162,23,0.55);
    border: 1px solid rgba(202,162,23,0.2);
    padding: 2px 8px;
    border-radius: 20px;
  }

  /* ── Action buttons ── */
  .tp-actions {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .tp-btn-primary {
    width: 100%;
    padding: 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: rgba(220,215,255,0.8);
    font-size: 13.5px;
    font-weight: 500;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: 0.02em;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .tp-btn-primary:hover {
    background: rgba(139,92,246,0.15);
    border-color: rgba(139,92,246,0.35);
    color: #e2d9ff;
  }
  .tp-btn-ghost {
    width: 100%;
    padding: 10px;
    background: none;
    border: none;
    color: rgba(180,170,210,0.38);
    font-size: 12.5px;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: color 0.2s;
    text-align: center;
  }
  .tp-btn-ghost:hover { color: rgba(180,170,210,0.7); }

  @media print {
    .tp-root { background: #fff; padding: 0; }
    .tp-actions { display: none; }
    .tp-header { display: none; }
    .tp-tickets-list {
      max-height: none !important;
      overflow-y: visible !important;
      padding-right: 0 !important;
    }
    .tp-card {
      border: 1px solid #ddd;
      box-shadow: none;
      border-radius: 12px;
      page-break-inside: avoid;
    }
    .tp-banner { background: #c9a220; }
    .tp-banner-text { color: #fff; }
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "zentage-ticket-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
}

export default function MyTicketPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useInjectStyles(STYLES);

  useEffect(() => {
    fetchMyBooking()
      .then((data) => {
        if (!data || data.length === 0) {
          navigate("/", { replace: true });
        } else {
          setBookings(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your tickets. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="tp-root">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "rgba(139,92,246,0.8)",
            animation: "tp-pulse 1.2s ease-in-out infinite",
            display: "inline-block",
          }} />
          <style>{`
            @keyframes tp-pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(0.6); opacity: 0.3; }
            }
          `}</style>
          Loading your tickets…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tp-root">
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <p style={{ color: "#f87171", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#ede8ff",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) return null;

  return (
    <div className="tp-root">
      <div className="tp-wrapper">
        {/* ── Header ─────────────────────────── */}
        <div className="tp-header">
          <div className="tp-check-ring">
            <span style={{ fontSize: "20px" }}>🎫</span>
          </div>
          <h1 className="tp-title">Your E-Ticket{bookings.length > 1 ? "s" : ""}</h1>
          <p className="tp-subtitle">
            Present {bookings.length > 1 ? "these codes" : "this code"} at the entrance
          </p>
        </div>

        {/* ── Ticket cards scroll list ────────────────── */}
        <div className="tp-tickets-list" style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 4, paddingBottom: 16 }}>
          {bookings.map((booking) => (
            <TicketCard key={booking.booking_ref} booking={booking} />
          ))}
        </div>

        {/* ── Actions ─────────────────────────────────── */}
        <motion.div
          className="tp-actions"
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.45 }}
        >
          <motion.button
            id="btn-print"
            onClick={() => window.print()}
            className="tp-btn-primary"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={microSpring}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / Save as PDF
          </motion.button>
          <motion.button
            id="btn-back"
            onClick={() => navigate("/")}
            className="tp-btn-ghost"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={microSpring}
          >
            ← Back to seat map
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
