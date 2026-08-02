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




export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldsKey, setFieldsKey] = useState(0); // re-triggers slide animation on tab switch

  useDocumentTitle("Log In or Register");

  const { login } = useAuth();
  const navigate = useNavigate();

  function switchMode(next) {
    if (next === mode) return;
    setMode(next);
    setError("");
    setSuccess("");
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
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await loginWithPassword(email, password);
        handleSuccess(data);
      } else {
        await registerWithPassword(email, password, name);
        setSuccess("Account created successfully! Please log in.");
        setMode("login");
        setPassword("");
        setName("");
        setFieldsKey((k) => k + 1);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(credential) {
    setError("");
    setSuccess("");
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

              {success && <p className="lp-success">{success}</p>}
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
