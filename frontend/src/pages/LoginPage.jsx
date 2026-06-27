import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginWithPassword, registerWithPassword, loginWithGoogle } from "../lib/auth";
import GoogleButton from "../components/shared/GoogleButton";
import MotionButton from "../components/shared/MotionButton";
import MotionInput from "../components/shared/MotionInput";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import logo from "../assets/zentage-TS.png";

/* ─────────────────────────────────────────────
   Scoped CSS injected once into <head>
   (keeps component self-contained, zero deps)
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .lp-root {
    min-height: 100svh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0D0D12;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139, 92, 246, 0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59, 130, 246, 0.10) 0%, transparent 55%),
      radial-gradient(ellipse 50% 35% at 10% 90%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
    padding: 24px 16px;
    font-family: 'Inter', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Subtle animated grain overlay */
  .lp-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 180px;
    opacity: 0.4;
    pointer-events: none;
  }

  /* Floating orbs animation */
  .lp-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: lp-drift 12s ease-in-out infinite alternate;
    pointer-events: none;
  }
  .lp-orb-1 {
    width: 340px; height: 340px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.22), transparent 70%);
    top: -80px; left: -60px;
    animation-duration: 14s;
  }
  .lp-orb-2 {
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.16), transparent 70%);
    bottom: -60px; right: -40px;
    animation-duration: 11s;
    animation-delay: -4s;
  }
  .lp-orb-3 {
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.12), transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation-duration: 16s;
    animation-delay: -8s;
  }
  @keyframes lp-drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, 20px) scale(1.08); }
  }

  .lp-card-wrapper {
    width: 100%;
    max-width: 400px;
    position: relative;
    z-index: 1;
  }

  /* ── Brand header ── */
  .lp-brand {
    text-align: center;
    margin-bottom: 28px;
  }
  .lp-brand-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(167, 139, 250, 0.7);
    margin-bottom: 14px;
  }
  .lp-logo-wrap {
    position: relative;
    display: inline-block;
  }
  .lp-logo-wrap::before {
    content: '';
    position: absolute;
    inset: -12px;
    background: radial-gradient(ellipse, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(16px);
    pointer-events: none;
  }
  .lp-logo {
    height: 80px;
    width: auto;
    object-fit: contain;
    position: relative;
    filter: drop-shadow(0 0 24px rgba(139, 92, 246, 0.5));
  }
  .lp-brand-meta {
    margin-top: 12px;
    font-size: 12px;
    color: rgba(156, 163, 175, 0.65);
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .lp-brand-meta-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.5);
    display: inline-block;
  }

  /* ── Glass card ── */
  .lp-card {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 28px 28px 32px;
    box-shadow:
      0 0 0 1px rgba(139, 92, 246, 0.06),
      0 24px 60px rgba(0, 0, 0, 0.55),
      0 4px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    position: relative;
  }
  /* Top edge glow */
  .lp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
    border-radius: 100%;
  }

  /* ── Tab switcher ── */
  .lp-tabs {
    display: flex;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 24px;
    position: relative;
  }
  .lp-tab-slider {
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: calc(50% - 4px);
    background: rgba(139, 92, 246, 0.18);
    border: 1px solid rgba(139, 92, 246, 0.35);
    border-radius: 9px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 14px rgba(139, 92, 246, 0.2);
  }
  .lp-tab-slider.to-register {
    transform: translateX(calc(100% + 0px));
  }
  .lp-tab-btn {
    flex: 1;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 0;
    border-radius: 9px;
    position: relative;
    z-index: 1;
    transition: color 0.25s ease;
    letter-spacing: 0.02em;
  }
  .lp-tab-btn.active  { color: #e2d9ff; }
  .lp-tab-btn.inactive { color: rgba(156, 163, 175, 0.55); }
  .lp-tab-btn:hover.inactive { color: rgba(156, 163, 175, 0.85); }

  /* ── Google button wrapper ── */
  .lp-google-wrap {
    margin-bottom: 20px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }
  /* Neon border pulse on the native Google iframe */
  .lp-google-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 1px solid rgba(139, 92, 246, 0.3);
    pointer-events: none;
    box-shadow: 0 0 16px rgba(139, 92, 246, 0.12), inset 0 0 16px rgba(139, 92, 246, 0.04);
    animation: lp-border-pulse 3s ease-in-out infinite;
  }
  @keyframes lp-border-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.55; }
  }

  /* ── Divider ── */
  .lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .lp-divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  }
  .lp-divider-label {
    font-size: 11px;
    color: rgba(156, 163, 175, 0.45);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* ── Form slide animation ── */
  .lp-form-wrap {
    overflow: hidden;
  }
  .lp-fields {
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: lp-slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes lp-slide-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Inputs ── */
  .lp-input {
    width: 100%;
    padding: 11px 14px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    color: #e2d9ff;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
    letter-spacing: 0.01em;
  }
  .lp-input::placeholder { color: rgba(156, 163, 175, 0.4); }
  .lp-input:focus {
    border-color: rgba(139, 92, 246, 0.55);
    background: rgba(139, 92, 246, 0.06);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12), 0 0 16px rgba(139, 92, 246, 0.08);
  }
  .lp-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 40px #1a1525 inset !important;
    -webkit-text-fill-color: #e2d9ff !important;
  }

  /* ── Error message ── */
  .lp-error {
    font-size: 12.5px;
    color: #f87171;
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.2);
    border-radius: 8px;
    padding: 8px 12px;
    text-align: center;
    letter-spacing: 0.01em;
  }

  /* ── Submit button ── */
  .lp-submit-btn {
    width: 100%;
    padding: 13px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #fff;
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #5b21b6 100%);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow:
      0 0 24px rgba(109, 40, 217, 0.45),
      0 4px 12px rgba(109, 40, 217, 0.35),
      inset 0 1px 0 rgba(255,255,255,0.12);
  }
  /* Shimmer sweep */
  .lp-submit-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -75%;
    width: 50%; height: 100%;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
    transform: skewX(-20deg);
    animation: lp-shimmer 3.5s ease-in-out infinite;
  }
  @keyframes lp-shimmer {
    0%   { left: -75%; opacity: 0; }
    30%  { opacity: 1; }
    60%  { left: 130%; opacity: 0; }
    100% { left: 130%; opacity: 0; }
  }
  .lp-submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      0 0 32px rgba(109, 40, 217, 0.6),
      0 6px 18px rgba(109, 40, 217, 0.45),
      inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .lp-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .lp-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Loading dots */
  .lp-loading {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .lp-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.8);
    animation: lp-bounce 1.2s ease-in-out infinite;
  }
  .lp-dot:nth-child(2) { animation-delay: 0.2s; }
  .lp-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes lp-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%           { transform: translateY(-5px); }
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "zentage-login-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
    return () => { /* leave styles for instant re-mount */ };
  }, []);
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldsKey, setFieldsKey] = useState(0); // re-triggers slide animation on tab switch

  useInjectStyles(STYLES);
  useDocumentTitle("Log In or Register");

  const { login } = useAuth();
  const navigate = useNavigate();

  function switchMode(next) {
    if (next === mode) return;
    setMode(next);
    setError("");
    setShowPassword(false);
    setFieldsKey((k) => k + 1);
  }

  function handleSuccess(data) {
    login(data.access_token, data.user);
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await loginWithPassword(email, password)
          : await registerWithPassword(email, password, name);
      handleSuccess(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(credential) {
    setError("");
    try {
      const data = await loginWithGoogle(credential);
      handleSuccess(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Google sign-in failed.");
    }
  }

  return (
    <div className="lp-root">
      {/* Ambient orbs */}
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />

      <div className="lp-card-wrapper">
        {/* ── Brand ── */}
        <div className="lp-brand">
          <p className="lp-brand-eyebrow">Sasnaka Sansada Foundation</p>
          <div className="lp-logo-wrap">
            <img src={logo} alt="Zentage Talent Show" className="lp-logo" />
          </div>
          <div className="lp-brand-meta">
            <span>September 6, 2026</span>
            <span className="lp-brand-meta-dot" />
            <span>Elphinstone Theatre, Maradana</span>
          </div>
        </div>

        {/* ── Glass card ── */}
        <div className="lp-card">
          {/* Animated tab switcher */}
          <div className="lp-tabs">
            <div className={`lp-tab-slider ${mode === "register" ? "to-register" : ""}`} />
            <button
              id="tab-login"
              type="button"
              className={`lp-tab-btn ${mode === "login" ? "active" : "inactive"}`}
              onClick={() => switchMode("login")}
            >
              Log in
            </button>
            <button
              id="tab-register"
              type="button"
              className={`lp-tab-btn ${mode === "register" ? "active" : "inactive"}`}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>

          {/* Google button */}
          <div className="lp-google-wrap">
            <GoogleButton onCredential={handleGoogleCredential} />
          </div>

          {/* Divider */}
          <div className="lp-divider">
            <div className="lp-divider-line" />
            <span className="lp-divider-label">or</span>
            <div className="lp-divider-line" />
          </div>

          {/* Form - key forces re-mount (re-runs slide animation) */}
          <form key={fieldsKey} onSubmit={handleSubmit}>
            <div className="lp-fields">
              {mode === "register" && (
                <MotionInput
                  id="input-name"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="lp-input"
                />
              )}
              <MotionInput
                id="input-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="lp-input"
              />
              <div style={{ position: "relative", width: "100%" }}>
                <MotionInput
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="lp-input"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(156, 163, 175, 0.6)",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none"
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {error && <p className="lp-error">{error}</p>}

              <MotionButton
                id="btn-submit"
                type="submit"
                disabled={loading}
                className="lp-submit-btn"
              >
                {loading ? (
                  <span className="lp-loading">
                    <span className="lp-dot" />
                    <span className="lp-dot" />
                    <span className="lp-dot" />
                  </span>
                ) : mode === "login" ? (
                  "Log in"
                ) : (
                  "Create account"
                )}
              </MotionButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
