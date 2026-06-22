import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../lib/api";

export default function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const booking = location.state?.booking;
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  async function handleCancelBooking() {
    if (!confirm("Are you sure you want to cancel this booking? This will release your seat.")) {
      return;
    }
    setCancelling(true);
    setError("");
    try {
      await api.delete("/bookings/me");
      navigate("/", { replace: true });
    } catch (err) {
      setError("Failed to cancel your booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100/60 via-sky-50 to-indigo-100/50 px-4 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm print:max-w-none print:shadow-none">
        
        {/* Back Button (Hidden in Print) */}
        <button
          onClick={() => navigate("/")}
          className="text-sm font-medium text-neutral-600 mb-6 hover:text-neutral-900 flex items-center gap-1.5 transition print:hidden"
        >
          <span>←</span> Back to Seat Map
        </button>

        {/* Ticket Wrapper */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border border-blue-100/60 relative">
          
          {/* Header stub */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Official Entry Ticket</p>
            <h2 className="text-xl font-bold mt-1">Zentage Talent Show</h2>
            <p className="text-xs text-indigo-150 mt-1 opacity-90">Sasnaka Sansada Foundation</p>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Date & Time</p>
                <p className="text-sm font-semibold text-neutral-800 mt-0.5">Sept 6, 2026</p>
                <p className="text-xs text-neutral-500">6:00 PM onwards</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Venue</p>
                <p className="text-sm font-semibold text-neutral-800 mt-0.5">Elphinstone Theatre</p>
                <p className="text-xs text-neutral-500">Maradana, Sri Lanka</p>
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-150 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Seat Allocation</p>
                <p className="text-2xl font-black text-indigo-600 mt-0.5">{booking.seat_code}</p>
                <p className="text-xs text-neutral-500 font-medium">{booking.section}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Ref Code</p>
                <p className="text-sm font-bold text-neutral-800 mt-1 font-mono">{booking.booking_ref}</p>
                <p className="text-xs text-green-600 font-semibold mt-0.5">✓ Confirmed</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Attendee Name</span>
                <span className="font-semibold text-neutral-800">{user?.name || "Attendee"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Email Address</span>
                <span className="font-semibold text-neutral-800 font-mono text-xs">{user?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">District</span>
                <span className="font-semibold text-neutral-800">{booking.district}</span>
              </div>
            </div>
          </div>

          {/* Dotted Ticket Stub Separator with side cuts */}
          <div className="relative flex items-center justify-between py-2 my-1">
            <div className="w-4 h-8 bg-gradient-to-r from-neutral-100 to-transparent border-r border-blue-100 rounded-r-full -left-0.5 absolute" />
            <div className="w-full border-t-2 border-dashed border-neutral-200 mx-6" />
            <div className="w-4 h-8 bg-gradient-to-l from-neutral-100 to-transparent border-l border-blue-100 rounded-l-full -right-0.5 absolute" />
          </div>

          {/* Ticket Barcode Stub */}
          <div className="p-6 pt-3 text-center space-y-4">
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Scan At Entrance</p>
            
            {/* Visual Barcode stub */}
            <div className="flex justify-center items-center h-12 gap-0.5 bg-neutral-50 p-2 rounded-xl border border-neutral-100">
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-1.5 h-full bg-neutral-850" />
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-2.5 h-full bg-neutral-850" />
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-1 h-full bg-neutral-850" />
              <div className="w-2.5 h-full bg-neutral-850" />
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-1.5 h-full bg-neutral-850" />
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-1 h-full bg-neutral-850" />
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-2 h-full bg-neutral-850" />
              <div className="w-1.5 h-full bg-neutral-850" />
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-1 h-full bg-neutral-850" />
              <div className="w-1.5 h-full bg-neutral-850" />
              <div className="w-0.5 h-full bg-neutral-850" />
              <div className="w-2.5 h-full bg-neutral-850" />
            </div>

            <p className="text-xs font-mono text-neutral-500 tracking-wider">{booking.booking_ref}</p>
          </div>
        </div>

        {/* Action Buttons (Hidden in Print) */}
        <div className="mt-6 flex flex-col gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
          >
            🖨️ Print Ticket
          </button>
          
          <button
            onClick={handleCancelBooking}
            disabled={cancelling}
            className="w-full bg-white text-red-600 border border-red-200 text-sm font-semibold py-2.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {cancelling ? "Releasing seat..." : "Cancel Reservation"}
          </button>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </div>

      </div>
    </div>
  );
}
