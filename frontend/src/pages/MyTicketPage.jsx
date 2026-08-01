import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchMyBooking } from "../lib/bookings";
import { popVariants, fadeUpVariants, microSpring } from "../lib/motionVariants";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import TicketCard from "../components/shared/TicketCard";
import TicketSkeleton from "../components/shared/TicketSkeleton";

const EVENT = {
  name: "Zentage Talent Show",
  date: "September 6, 2026",
  time: "6:00 PM onwards",
  venue: "Elphinstone Theatre",
  location: "Maradana, Colombo",
  org: "Sasnaka Sansada Foundation",
};

/* ─── Injected scoped styles ─── */




export default function MyTicketPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useDocumentTitle("My Tickets");

  useEffect(() => {
    fetchMyBooking()
      .then((data) => {
        setBookings(data || []);
      })
      .catch((err) => {
        console.error(err);
        navigate("/", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);



  return (
    <div className="tp-root">
      <div className="tp-wrapper">
        {/* ── Header ─────────────────────────── */}
        <div className="tp-header">
          <div className="tp-check-ring">
            <span style={{ fontSize: "20px" }}><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline-block", verticalAlign: "middle"}}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg></span>
          </div>
          <h1 className="tp-title">Your E-Ticket{bookings.length > 1 ? "s" : ""}</h1>
          <p className="tp-subtitle">
            Present {bookings.length > 1 ? "these codes" : "this code"} at the entrance
          </p>
        </div>

        {!loading && bookings.some(b => b.status === "pending" || b.status === "PENDING") && (
          <div style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: "8px", padding: "12px", marginBottom: "20px", textAlign: "center", color: "#fb923c", fontSize: "13px", fontWeight: "500" }}>
            Your seat is held for 1 minute - complete payment quickly.
          </div>
        )}

        {/* ── Content ── */}
        <div className="tp-wrapper" style={{ marginTop: 24 }}>
          {loading ? (
            <>
              <TicketSkeleton />
              <TicketSkeleton />
            </>
          ) : error ? (
            <div style={{ textAlign: "center", maxWidth: 320, margin: "0 auto" }}>
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
          ) : !bookings || bookings.length === 0 ? (
            <div className="tp-card" style={{ padding: "40px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
              <div className="tp-check-ring" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: "20px" }}><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: "inline-block", verticalAlign: "middle"}}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg></span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#ede8ff" }}>
                No tickets booked yet
              </div>
              <Link
                to="/"
                style={{
                  fontSize: "14px",
                  color: "#a78bfa",
                  textDecoration: "none",
                  fontWeight: "600",
                  letterSpacing: "0.02em",
                  borderBottom: "1px solid rgba(167, 139, 250, 0.3)",
                  paddingBottom: 2,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#c084fc";
                  e.currentTarget.style.borderColor = "rgba(192, 132, 252, 0.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#a78bfa";
                  e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.3)";
                }}
              >
                Book a seat →
              </Link>
            </div>
          ) : (
            <div className="tp-tickets-list" style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 4, paddingBottom: 16 }}>
              {bookings.map((booking) => (
                <TicketCard key={booking.booking_ref} booking={booking} />
              ))}
            </div>
          )}
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
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={microSpring}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to seat map
          </motion.button>
        </motion.div>

        {/* ── Emergency Support Link ─────────────────── */}
        <div style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "11px",
          color: "rgba(156, 163, 175, 0.4)",
          letterSpacing: "0.02em"
        }}>
          Emergency support: <a href="tel:+94776702154" style={{ color: "rgba(239, 68, 68, 0.6)", textDecoration: "none", fontWeight: "500" }}>0776 702 154</a> (Ilman Fazny - Talent Show Co.)
        </div>
      </div>
    </div>
  );
}
