import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { createBooking } from "../lib/bookings";
import { DISTRICTS } from "../lib/districts";

const EVENT_PRICE = 500;

export default function AttendeeDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const seat = location.state?.seat;

  const [district, setDistrict] = useState("");
  const [isSasnakaMember, setIsSasnakaMember] = useState(null); // null = unanswered
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // No seat in state - user landed here directly (refresh, back button, etc).
  // Send them back to pick a seat rather than letting them submit a broken form.
  if (!seat) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!district) {
      setError("Please select your district.");
      return;
    }
    if (isSasnakaMember === null) {
      setError("Please let us know if you're a Sasnaka Sansada Foundation member.");
      return;
    }

    setLoading(true);
    try {
      const booking = await createBooking({
        seatCode: seat.seat_code,
        district,
        isSasnakaMember,
        phone,
      });
      navigate("/ticket", { state: { booking } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 409) {
        // seat was taken in the gap between selection and submit
        setError(detail || "That seat was just taken. Please choose another seat.");
      } else {
        setError(detail || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    navigate("/", { state: { seat } });
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100/60 via-sky-50 to-indigo-100/50 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-neutral-600 mb-6 hover:text-neutral-900 flex items-center gap-1.5 transition"
        >
          <span>←</span> Change seat
        </button>

        <div className="bg-white/95 backdrop-blur-md border border-blue-100/80 rounded-2xl p-6 shadow-xl shadow-blue-900/5 mb-6">
          <p className="text-xs font-semibold tracking-wide text-neutral-400 uppercase mb-1">Selected Seat</p>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-2xl font-bold text-neutral-900">{seat.seat_code}</span>
            <span className="text-sm font-medium text-neutral-500">{seat.section}</span>
          </div>
          <div className="pt-3 border-t border-neutral-100 flex justify-between text-sm">
            <span className="text-neutral-500">Ticket Price</span>
            <span className="font-bold text-indigo-600">LKR {EVENT_PRICE.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-blue-100/80 rounded-2xl p-6 shadow-xl shadow-blue-900/5">
          <h1 className="text-lg font-bold text-neutral-900 mb-5">Your Details</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your district</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Are you a Sasnaka Sansada Foundation member?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSasnakaMember(true)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition ${isSasnakaMember === true
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-neutral-700 border-blue-200 hover:bg-neutral-50"
                    }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setIsSasnakaMember(false)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition ${isSasnakaMember === false
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-neutral-700 border-blue-200 hover:bg-neutral-50"
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Phone number <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07X XXX XXXX"
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-500/10"
            >
              {loading ? "Confirming..." : "Confirm booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
