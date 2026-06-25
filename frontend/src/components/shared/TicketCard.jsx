import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { popVariants } from "../../lib/motionVariants";
import logo from "../../assets/zentage-TS.png";

const EVENT = {
  name: "Zentage Talent Show",
  date: "September 6, 2026",
  time: "6:00 PM onwards",
  venue: "Elphinstone Theatre",
  location: "Maradana, Colombo",
  price: "LKR 500",
  org: "Sasnaka Sansada Foundation",
};

export default function TicketCard({ booking }) {
  const canvasRef = useRef(null);
  const isPending = booking.status === "pending" || booking.status === "PENDING";

  useEffect(() => {
    if (!isPending && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, booking.booking_ref, {
        width: 180,
        margin: 1,
        color: { dark: "#0f1322", light: "#f8f6ff" },
      });
    }
  }, [booking.booking_ref, isPending]);

  return (
    <motion.div
      className="tp-card print-ticket"
      variants={popVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ marginBottom: 24 }}
    >
      {/* Gold confirmed banner */}
      <div className="tp-banner">
        <span className="tp-banner-dot" />
        <span className="tp-banner-text">
          {isPending ? "✦ Pending Payment ✦" : "✦ Confirmed ✦"}
        </span>
        <span className="tp-banner-dot" />
      </div>

      {/* Event header */}
      <div className="tp-ticket-head">
        <p className="tp-org">{EVENT.org}</p>
        <img
          src={logo}
          alt="Zentage"
          style={{
            height: 44,
            width: "auto",
            display: "block",
            margin: "0 auto 8px",
            filter: "drop-shadow(0 0 10px rgba(202,162,23,0.3)) brightness(1.05)",
          }}
        />
        <p className="tp-event-name">{EVENT.name}</p>
        <p className="tp-event-meta">{EVENT.date} · {EVENT.time}</p>
      </div>

      {/* Perforation 1 */}
      <Perforation />

      {/* QR code scanner zone */}
      {!isPending ? (
        <motion.div
          className="tp-qr-zone"
          initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.28, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="tp-qr-frame">
            <span className="tp-qr-corner-tr" />
            <span className="tp-qr-corner-bl" />
            <canvas ref={canvasRef} className="tp-qr-canvas" />
          </div>
          <p className="tp-qr-hint">⬡ Scan at entrance ⬡</p>
        </motion.div>
      ) : (
        <div className="tp-qr-zone">
          <div className="tp-qr-frame" style={{ background: "rgba(255,255,255,0.01)" }}>
            <div style={{
              width: 180,
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "rgba(180,170,210,0.35)",
              textAlign: "center",
              padding: "0 16px",
              fontFamily: "'Inter',system-ui,sans-serif",
            }}>
              QR code available after payment
            </div>
          </div>
        </div>
      )}

      {/* Perforation 2 */}
      <Perforation />

      {/* Ticket detail rows */}
      <div className="tp-details">
        <TicketRow label="Booking Ref" value={booking.booking_ref} mono />
        <TicketRow label="Seat" value={booking.seat_code} highlight />
        <TicketRow label="Section" value={booking.section} />
        <TicketRow label="Venue" value={EVENT.venue} />
        <TicketRow label="Location" value={EVENT.location} />
        <TicketRow label="Price" value={EVENT.price} />
      </div>

      {/* Bottom strip */}
      <div className="tp-foot">
        <span className="tp-foot-text">Non-transferable · 1 person</span>
        <span className="tp-foot-badge">{isPending ? "Pending" : "E-Ticket"}</span>
      </div>
    </motion.div>
  );
}

function Perforation() {
  return (
    <div className="tp-perf-wrap">
      <div className="tp-perf-notch left" />
      <div className="tp-perf-line" />
      <div className="tp-perf-notch right" />
    </div>
  );
}

function TicketRow({ label, value, mono, highlight }) {
  return (
    <div className={`tp-row${highlight ? " highlight" : ""}`}>
      <span className="tp-row-label">{label}</span>
      <span className={`tp-row-value${mono ? " mono" : ""}`}>{value}</span>
    </div>
  );
}
