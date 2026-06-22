import { useEffect, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import QRCode from "qrcode";

const EVENT = {
  name: "Zentage Talent Show",
  date: "September 6, 2026",
  venue: "Elphinstone Theatre, Maradana",
  price: "LKR 5,000",
};

export default function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const booking = location.state?.booking;

  // No booking in state — user refreshed or navigated directly.
  if (!booking) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, booking.booking_ref, {
      width: 180,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  }, [booking.booking_ref]);

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 flex items-start justify-center">
      <div className="w-full max-w-sm">

        {/* Success header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900">Booking confirmed</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Your ticket has been sent to your email
          </p>
        </div>

        {/* Ticket card */}
        <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm print-ticket">

          {/* Ticket top — dark header */}
          <div className="bg-neutral-900 px-5 py-4 text-center">
            <p className="text-xs font-semibold tracking-widest text-neutral-400 uppercase mb-1">
              Sasnaka Sansada Foundation
            </p>
            <p className="text-white font-semibold text-base">{EVENT.name}</p>
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center">
            <div className="absolute -left-3 w-6 h-6 bg-neutral-50 rounded-full border border-neutral-200" />
            <div className="flex-1 border-t border-dashed border-neutral-300 mx-3" />
            <div className="absolute -right-3 w-6 h-6 bg-neutral-50 rounded-full border border-neutral-200" />
          </div>

          {/* QR code */}
          <div className="flex justify-center pt-5 pb-3">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          <p className="text-center text-xs text-neutral-400 pb-4">
            Show this at the entrance
          </p>

          {/* Perforated divider */}
          <div className="relative flex items-center">
            <div className="absolute -left-3 w-6 h-6 bg-neutral-50 rounded-full border border-neutral-200" />
            <div className="flex-1 border-t border-dashed border-neutral-300 mx-3" />
            <div className="absolute -right-3 w-6 h-6 bg-neutral-50 rounded-full border border-neutral-200" />
          </div>

          {/* Ticket details */}
          <div className="px-5 py-4 space-y-3">
            <TicketRow label="Booking ref" value={booking.booking_ref} mono />
            <TicketRow label="Seat" value={booking.seat_code} />
            <TicketRow label="Section" value={booking.section} />
            <TicketRow label="Date" value={EVENT.date} />
            <TicketRow label="Venue" value={EVENT.venue} />
            <TicketRow label="Price" value={EVENT.price} />
          </div>

          {/* Bottom strip */}
          <div className="bg-neutral-50 border-t border-neutral-200 px-5 py-3 text-center">
            <p className="text-xs text-neutral-400">
              One ticket per person · Non-transferable
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2">
          <button
            onClick={() => window.print()}
            className="w-full text-sm font-medium py-2.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition text-neutral-700"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full text-sm text-neutral-400 py-2 hover:text-neutral-600 transition"
          >
            Back to seat map
          </button>
        </div>

      </div>
    </div>
  );
}

function TicketRow({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className={`text-sm font-medium text-neutral-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
