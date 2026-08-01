import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { fetchMyBooking } from "../lib/bookings";
import { motion } from "framer-motion";
import { fadeUpVariants, microSpring } from "../lib/motionVariants";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import TicketCard from "../components/shared/TicketCard";
import TicketSkeleton from "../components/shared/TicketSkeleton";

/* ─── Injected scoped styles ─── */




export default function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(location.state?.bookings || []);
  const [loading, setLoading] = useState(!location.state?.bookings);

  useDocumentTitle("Booking Confirmed");

  useEffect(() => {
    if (loading) {
      fetchMyBooking()
        .then((data) => {
          if (data && data.length > 0) {
            setBookings(data);
          } else {
            navigate("/", { replace: true });
          }
        })
        .catch(() => navigate("/", { replace: true }))
        .finally(() => setLoading(false));
    }
  }, [loading, navigate]);



  return (
    <div className="tp-root">
      <div className="tp-wrapper">

        {/* ── Success header ─────────────────────────── */}
        <div className="tp-header">
          <div className="tp-check-ring">
            <svg className="tp-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="tp-title">Booking Confirmed</h1>
          <p className="tp-subtitle">
            {bookings.length} ticket{bookings.length > 1 ? "s have" : " has"} been sent to your email
          </p>
        </div>

        {/* ── Ticket cards scroll list ────────────────── */}
        <div className="tp-tickets-list" style={{ maxHeight: "65vh", overflowY: "auto", paddingRight: 4, paddingBottom: 16 }}>
          {loading ? (
            <>
              <TicketSkeleton />
              <TicketSkeleton />
            </>
          ) : !bookings || bookings.length === 0 ? (
            <Navigate to="/" replace />
          ) : (
            bookings.map((booking) => (
              <TicketCard key={booking.booking_ref} booking={booking} />
            ))
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

      </div>
    </div>
  );
}
