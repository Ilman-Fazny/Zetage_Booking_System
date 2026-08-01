import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { initiatePayment } from "../lib/payments";
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
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  /* ── Page root ── */
  .adp-root {
    min-height: 100svh;
    background-color: #0B0F19;
    background-image:
      radial-gradient(ellipse 70% 45% at 50% 0%, rgba(109,40,217,0.11) 0%, transparent 55%),
      radial-gradient(ellipse 45% 35% at 5%  100%, rgba(59,130,246,0.07) 0%, transparent 50%),
      radial-gradient(ellipse 35% 25% at 95% 50%, rgba(236,72,153,0.05) 0%, transparent 50%);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 36px 16px 72px;
    font-family: 'Inter', system-ui, sans-serif;
    box-sizing: border-box;
  }
  .adp-root *, .adp-root *::before, .adp-root *::after { box-sizing: border-box; }

  .adp-inner {
    width: 100%;
    max-width: 460px;
    animation: adp-up 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes adp-up {
    from { opacity:0; transform: translateY(20px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* ── Back button ── */
  .adp-back {
    background: none;
    border: none;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12.5px;
    color: rgba(167,139,250,0.55);
    cursor: pointer;
    padding: 0;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .adp-back:hover { color: rgba(167,139,250,0.9); }

  /* ── Seat stub card ── */
  .adp-stub {
    position: relative;
    background: linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(79,30,157,0.12) 50%, rgba(30,20,60,0.3) 100%);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 12px;
    padding: 20px 22px;
    margin-bottom: 14px;
    overflow: hidden;
    backdrop-filter: blur(12px);
    box-shadow:
      0 0 0 1px rgba(139,92,246,0.06),
      0 20px 50px rgba(0,0,0,0.45),
      inset 0 1px 0 rgba(255,255,255,0.07);
  }
  /* Top violet edge glow */
  .adp-stub::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent);
  }
  /* Abstract background pattern */
  .adp-stub::after {
    content: '';
    position: absolute;
    right: -30px; top: -30px;
    width: 130px; height: 130px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .adp-stub-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }
  .adp-stub-logo {
    height: 22px; width: auto;
    filter: drop-shadow(0 0 6px rgba(139,92,246,0.4)) brightness(1.05);
    flex-shrink: 0;
  }
  .adp-stub-tag {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(167,139,250,0.6);
  }
  .adp-stub-main {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }
  .adp-stub-seat {
    font-size: 38px;
    font-weight: 800;
    color: #f0ece8;
    letter-spacing: -0.04em;
    line-height: 1;
    font-family: 'JetBrains Mono', monospace;
  }
  .adp-stub-section {
    font-size: 12px;
    color: rgba(180,170,210,0.55);
    font-weight: 500;
    text-align: right;
    line-height: 1.4;
    max-width: 160px;
  }
  /* Perforation line */
  .adp-stub-perf {
    display: flex;
    align-items: center;
    margin: 0 -22px;
    gap: 0;
    position: relative;
  }
  .adp-stub-notch {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #0B0F19;
    flex-shrink: 0;
  }
  .adp-stub-dash {
    flex: 1;
    border-top: 1.5px dashed rgba(167,139,250,0.18);
    height: 0;
  }
  .adp-stub-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
  }
  .adp-stub-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .adp-stub-meta-label {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(180,170,210,0.35);
    font-weight: 600;
  }
  .adp-stub-meta-val {
    font-size: 12.5px;
    color: rgba(210,204,240,0.75);
    font-weight: 500;
  }
  .adp-price-tag {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1px;
  }
  .adp-price-label {
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(202,162,23,0.55);
    font-weight: 600;
  }
  .adp-price-val {
    font-size: 20px;
    font-weight: 800;
    color: #fbbf24;
    letter-spacing: -0.03em;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
    text-shadow: 0 0 16px rgba(251,191,36,0.4);
  }

  /* ── Form card ── */
  .adp-card {
    position: relative;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 26px 26px 28px;
    backdrop-filter: blur(16px);
    box-shadow:
      0 0 0 1px rgba(139,92,246,0.04),
      0 24px 60px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.05);
    animation: adp-up 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }
  .adp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent);
  }

  /* ── Form heading ── */
  .adp-form-title {
    font-size: 17px;
    font-weight: 700;
    color: #e2d9ff;
    letter-spacing: -0.02em;
    margin: 0 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .adp-form-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(139,92,246,0.2), transparent);
  }

  /* ── Form field group ── */
  .adp-field { margin-bottom: 18px; }
  .adp-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(180,170,210,0.45);
    margin-bottom: 8px;
  }

  /* ── Inputs & Select ── */
  .adp-input,
  .adp-select {
    width: 100%;
    padding: 11px 14px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    color: #e2d9ff;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
    appearance: none;
  }
  .adp-input::placeholder { color: rgba(156,163,175,0.35); }
  .adp-input:focus,
  .adp-select:focus {
    border-color: rgba(139,92,246,0.6);
    background: rgba(109,40,217,0.06);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.13), 0 0 18px rgba(139,92,246,0.08);
  }
  .adp-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 40px #131825 inset !important;
    -webkit-text-fill-color: #e2d9ff !important;
  }
  .adp-select option { background: #1a1529; color: #e2d9ff; }

  /* Select wrapper for custom arrow */
  .adp-select-wrap {
    position: relative;
  }
  .adp-select-wrap::after {
    content: '';
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(167,139,250,0.45);
    pointer-events: none;
  }

  /* ── Sasnaka toggle ── */
  .adp-toggle-wrap {
    display: flex;
    gap: 10px;
  }
  .adp-toggle-btn {
    flex: 1;
    padding: 10px 0;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.09);
    background: rgba(255,255,255,0.035);
    color: rgba(180,170,210,0.45);
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
    position: relative;
    overflow: hidden;
  }
  .adp-toggle-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.22s;
  }
  /* YES active */
  .adp-toggle-btn.yes-active {
    background: rgba(52,211,153,0.12);
    border-color: rgba(52,211,153,0.4);
    color: #34d399;
    box-shadow: 0 0 18px rgba(52,211,153,0.18), 0 0 6px rgba(52,211,153,0.25), inset 0 1px 0 rgba(255,255,255,0.08);
    transform: translateY(-1px);
  }
  /* NO active */
  .adp-toggle-btn.no-active {
    background: rgba(248,113,113,0.10);
    border-color: rgba(248,113,113,0.35);
    color: #f87171;
    box-shadow: 0 0 18px rgba(248,113,113,0.15), 0 0 6px rgba(248,113,113,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
    transform: translateY(-1px);
  }
  .adp-toggle-btn:hover:not(.yes-active):not(.no-active) {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.14);
    color: rgba(180,170,210,0.8);
  }

  /* ── Phone hint ── */
  .adp-hint {
    font-size: 11px;
    color: rgba(180,170,210,0.3);
    margin-top: 6px;
    letter-spacing: 0.02em;
  }

  /* ── Error message ── */
  .adp-error {
    background: rgba(248,113,113,0.07);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #fca5a5;
    letter-spacing: 0.01em;
    margin-bottom: 16px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  .adp-error-icon { flex-shrink: 0; opacity: 0.7; margin-top: 1px; }

  /* ── Submit button ── */
  .adp-submit {
    width: 100%;
    padding: 10px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #fff;
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 45%, #5b21b6 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow:
      0 0 24px rgba(109,40,217,0.5),
      0 4px 14px rgba(109,40,217,0.4),
      inset 0 1px 0 rgba(255,255,255,0.13);
  }
  /* shimmer sweep */
  .adp-submit::before {
    content: '';
    position: absolute;
    top: 0; left: -80%; width: 55%; height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.18), transparent);
    transform: skewX(-20deg);
    animation: adp-shimmer 3.8s ease-in-out infinite;
  }
  @keyframes adp-shimmer {
    0%   { left: -80%; opacity: 0; }
    25%  { opacity: 1; }
    65%  { left: 130%; opacity: 0; }
    100% { left: 130%; }
  }
  .adp-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 0 36px rgba(109,40,217,0.65),
      0 8px 22px rgba(109,40,217,0.5),
      inset 0 1px 0 rgba(255,255,255,0.16);
  }
  .adp-submit:active:not(:disabled) { transform: translateY(0); }
  .adp-submit:disabled { opacity: 0.45; cursor: not-allowed; }

  /* Loading dots inside button */
  .adp-dots {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .adp-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.8);
    animation: adp-bounce 1.1s ease-in-out infinite;
  }
  .adp-dot:nth-child(2) { animation-delay: 0.18s; }
  .adp-dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes adp-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%           { transform: translateY(-5px); }
  }

  /* ── Divider ── */
  .adp-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 0;
  }
  .adp-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }
  .adp-divider-text {
    font-size: 10px;
    color: rgba(180,170,210,0.25);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 600;
  }

  /* ── Policy Checkbox ── */
  .adp-policy-checkbox-container {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 22px;
    padding: 6px 4px;
    cursor: pointer;
  }
  .adp-policy-checkbox {
    width: 17px;
    height: 17px;
    accent-color: #7c3aed;
    border-radius: 4px;
    border: 1.5px solid rgba(139,92,246,0.3);
    background: rgba(255,255,255,0.03);
    cursor: pointer;
    margin-top: 3px;
    flex-shrink: 0;
  }
  .adp-policy-label {
    font-size: 12.5px;
    line-height: 1.5;
    color: rgba(180,170,210,0.65);
    user-select: none;
  }
  .adp-policy-link {
    color: #a78bfa;
    text-decoration: underline;
    font-weight: 500;
    transition: color 0.2s;
  }
  .adp-policy-link:hover {
    color: #c4b9d8;
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "zentage-adp-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
}

export default function AttendeeDetailsPage() {
  useInjectStyles(STYLES);
  useDocumentTitle("Your Details");

  const location = useLocation();
  const navigate = useNavigate();
  const seats = location.state?.seats;

  const [district, setDistrict] = useState("");
  const [isSasnakaMember, setIsSasnakaMember] = useState(null);
  const [phone, setPhone] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!acceptedPolicies) {
      setError("Please agree to the Terms, Privacy Policy, and Return Policy to proceed.");
      return;
    }

    setLoading(true);
    try {
      const params = await initiatePayment({
        seatCodes: seats.map(s => s.seat_code),
        district,
        isSasnakaMember,
        phone,
      });

      // Build a hidden form and submit it to PayHere
      const form = document.createElement("form");
      form.method = "POST";
      form.action = import.meta.env.VITE_PAYHERE_URL;

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type  = "hidden";
        input.name  = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();   // user leaves your site, goes to PayHere's hosted page
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
