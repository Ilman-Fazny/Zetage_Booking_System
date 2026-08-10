import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import { DISTRICTS } from "../lib/districts";
import MotionButton from "../components/shared/MotionButton";
import MotionInput from "../components/shared/MotionInput";
import { floatingCardVariants, fadeUpVariants } from "../lib/motionVariants";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { calculateTotal, getTierBreakdown } from "../lib/pricing";
import logo from "../assets/zentage-TS.png";

/* ─────────────────────────────────────────────────────────────────────────────
   Scoped styles
───────────────────────────────────────────────────────────────────────────── */




export default function AttendeeDetailsPage() {
  useDocumentTitle("Your Details");

  const location = useLocation();
  const navigate = useNavigate();
  const seats = location.state?.seats;

  const [district, setDistrict] = useState("");
  const [isSasnakaMember, setIsSasnakaMember] = useState(null);
  const [phone, setPhone] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [slipFile, setSlipFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!seats || seats.length === 0) return <Navigate to="/" replace />;

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
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }
    if (phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!slipFile) {
      setError("Please upload your payment slip or ticket.");
      return;
    }
    if (!acceptedPolicies) {
      setError("Please agree to the Terms, Privacy Policy, and Return Policy to proceed.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("seat_codes", seats.map(s => s.seat_code).join(","));
      formData.append("district", district);
      formData.append("is_sasnaka_member", isSasnakaMember);
      formData.append("phone", phone);
      formData.append("file", slipFile);

      await api.post("/bookings/upload-slip-batch", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Navigate to My Ticket page after successful upload
      navigate("/my-ticket");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 409) {
        setError(detail || "That seat was just taken. Please choose another seat.");
      } else {
        setError(detail || "Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  }

  function handleBack() {
    navigate("/");
  }

  return (
    <div className="adp-root">
      <div className="adp-inner">

        {/* ── Back button ── */}
        <button className="adp-back" onClick={handleBack}>
          ← Change seat
        </button>

        {/* ── Seat stub ticket ── */}
        <motion.div
          className="adp-stub"
          variants={floatingCardVariants}
          initial="initial"
          animate="animate"
        >
          {/* Eyebrow */}
          <div className="adp-stub-eyebrow">
            <img src={logo} alt="Zentage" className="adp-stub-logo" />
            <span className="adp-stub-tag">Selected Seats</span>
          </div>

          {/* Seats list */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, position: "relative", zIndex: 1 }}>
            {seats.map((s) => (
              <span
                key={s.seat_code}
                style={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: "#e2d9ff",
                  background: "rgba(139,92,246,0.22)",
                  border: "1px solid rgba(139,92,246,0.4)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  display: "inline-block",
                  letterSpacing: "-0.01em",
                }}
              >
                {s.seat_code}
              </span>
            ))}
          </div>

          {/* Perforation */}
          <div className="adp-stub-perf">
            <div className="adp-stub-notch" />
            <div className="adp-stub-dash" />
            <div className="adp-stub-notch" />
          </div>

          {/* Footer details + price */}
          <div className="adp-stub-footer">
            <div className="adp-stub-meta">
              <span className="adp-stub-meta-label">Event</span>
              <span className="adp-stub-meta-val">Zentage Talent Show</span>
            </div>
            <div className="adp-stub-meta" style={{ textAlign: "center" }}>
              <span className="adp-stub-meta-label">Seats</span>
              <span className="adp-stub-meta-val">{seats.length} Ticket{seats.length > 1 ? "s" : ""}</span>
            </div>
            <div className="adp-price-tag">
              <span className="adp-price-label">Total Price</span>
              <span className="adp-price-val">LKR {calculateTotal(seats).toLocaleString()}</span>
              {getTierBreakdown(seats).length > 1 && (
                <span style={{
                  fontSize: 10,
                  color: "rgba(202,162,23,0.45)",
                  marginTop: 2,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}>
                  {getTierBreakdown(seats).map(b => `${b.count}×${b.label}`).join(" + ")}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Details form card ── */}
        <motion.div
          className="adp-card"
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.15 }}
        >
          <h1 className="adp-form-title">Your Details</h1>

          <form onSubmit={handleSubmit}>
            {/* District */}
            <div className="adp-field">
              <label className="adp-label">District</label>
              <div className="adp-select-wrap">
                <select
                  id="sel-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="adp-select"
                >
                  <option value="">Select your district…</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sasnaka membership */}
            <div className="adp-field">
              <label className="adp-label">
                Sasnaka Sansada Foundation Member?
              </label>
              <div className="adp-toggle-wrap">
                <button
                  id="toggle-yes"
                  type="button"
                  className={`adp-toggle-btn ${isSasnakaMember === true ? "yes-active" : ""}`}
                  onClick={() => setIsSasnakaMember(true)}
                >
                  {isSasnakaMember === true ? "✓ Yes" : "Yes"}
                </button>
                <button
                  id="toggle-no"
                  type="button"
                  className={`adp-toggle-btn ${isSasnakaMember === false ? "no-active" : ""}`}
                  onClick={() => setIsSasnakaMember(false)}
                >
                  {isSasnakaMember === false ? "✕ No" : "No"}
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="adp-field">
              <label className="adp-label">Phone Number</label>
              <MotionInput
                id="input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 0771234567"
                maxLength={10}
                required
                className="adp-input"
              />
              <p className="adp-hint">10-digit Sri Lankan mobile number</p>
            </div>

            {/* Slip Upload */}
            <div className="adp-field">
              <label className="adp-label">Upload Payment Slip or Ticket</label>
              <div 
                style={{
                  border: "2px dashed rgba(139, 92, 246, 0.4)",
                  borderRadius: 12,
                  padding: "24px",
                  textAlign: "center",
                  background: "rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => document.getElementById("slip-upload").click()}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.8)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)"}
              >
                <input 
                  type="file" 
                  id="slip-upload" 
                  style={{ display: "none" }} 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setSlipFile(e.target.files[0]);
                    }
                  }}
                />
                {slipFile ? (
                  <div style={{ color: "#a78bfa", fontWeight: 600 }}>
                    ✓ {slipFile.name} attached
                  </div>
                ) : (
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                    Click here to attach your bank transfer slip or ticket screenshot (JPG, PNG)
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Policies tickbox */}
            <label className="adp-policy-checkbox-container" htmlFor="chk-policies">
              <input
                id="chk-policies"
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(e) => setAcceptedPolicies(e.target.checked)}
                className="adp-policy-checkbox"
                required
              />
              <span className="adp-policy-label">
                I agree to the{" "}
                <a href="/terms" target="_blank" rel="noreferrer" className="adp-policy-link" onClick={(e) => e.stopPropagation()}>
                  Terms &amp; Conditions
                </a>
                ,{" "}
                <a href="/privacy-policy" target="_blank" rel="noreferrer" className="adp-policy-link" onClick={(e) => e.stopPropagation()}>
                  Privacy Policy
                </a>
                , and{" "}
                <a href="/return-policy" target="_blank" rel="noreferrer" className="adp-policy-link" onClick={(e) => e.stopPropagation()}>
                  Return Policy
                </a>
                . All ticket sales are final and non-refundable.
              </span>
            </label>

            {/* Error */}
            {error && (
              <div className="adp-error">
                <svg
                  className="adp-error-icon"
                  width="14" height="14"
                  fill="none" stroke="currentColor"
                  viewBox="0 0 24 24" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Confirm button */}
            <MotionButton
              id="btn-confirm"
              type="submit"
              disabled={loading || !acceptedPolicies}
              className="adp-submit"
            >
              {loading ? (
                <span className="adp-dots">
                  <span className="adp-dot" />
                  <span className="adp-dot" />
                  <span className="adp-dot" />
                </span>
              ) : (
                "Confirm Booking →"
              )}
            </MotionButton>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
