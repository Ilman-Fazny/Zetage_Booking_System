import { motion } from "framer-motion";
import { useAvailability } from "../../lib/useAvailability";
import { useCountdown } from "../../lib/useCountdown";

export default function EventStatusBanner() {
  const { availability, loading, error } = useAvailability();
  const timeLeft = useCountdown("September 6, 2026");

  const formatTime = (value) => value.toString().padStart(2, "0");

  const isLowSeats = availability.available > 0 && availability.available <= 100;
  const isSoldOut = availability.total > 0 && availability.available === 0 && !loading && !error;

  return (
    <div className="lp-status-banner">
      <div className="lp-status-countdown">
        <span className="lp-status-label">Time to Showtime</span>
        <div className="lp-status-timer">
          <span>{formatTime(timeLeft.days)}</span><span className="dim">d</span>
          <span className="sep">:</span>
          <span>{formatTime(timeLeft.hours)}</span><span className="dim">h</span>
          <span className="sep">:</span>
          <span>{formatTime(timeLeft.minutes)}</span><span className="dim">m</span>
          <span className="sep">:</span>
          <span>{formatTime(timeLeft.seconds)}</span><span className="dim">s</span>
        </div>
      </div>

      <div className="lp-status-seats">
        <span className="lp-status-label">Availability</span>
        <div className="lp-seats-badge">
          {loading ? (
            <span className="lp-loading" style={{ gap: "4px" }}>
              <span className="lp-dot" />
              <span className="lp-dot" />
              <span className="lp-dot" />
            </span>
          ) : (
            <motion.div 
              className={`lp-seats-count ${isLowSeats ? "low" : ""} ${isSoldOut ? "sold-out" : ""}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {isSoldOut ? (
                <span>SOLD OUT</span>
              ) : error || availability.total === 0 ? (
                <span>-- seats left</span>
              ) : (
                <>
                  <span className={`lp-pulse-dot ${isLowSeats ? "urgent" : ""}`} />
                  <span><strong>{availability.available}</strong> seats left</span>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
