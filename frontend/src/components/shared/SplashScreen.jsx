// src/components/shared/SplashScreen.jsx
// ─── Full-screen cinematic loading splash using the Zentage logo ────────────
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/zentage-TS.png";

/* ─── Injected scoped styles ─────────────────────────────────────────────── */
const SPLASH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .splash-root {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #06080F;
    background-image:
      radial-gradient(ellipse 90% 60% at 50% -5%,  rgba(202,162,23,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 10% 100%, rgba(109,40,217,0.09) 0%, transparent 50%),
      radial-gradient(ellipse 50% 35% at 90% 80%,  rgba(59,130,246,0.06) 0%, transparent 50%);
    overflow: hidden;
    font-family: 'Inter', system-ui, sans-serif;
    user-select: none;
  }

  /* ── Grain texture overlay ── */
  .splash-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    background-size: 180px;
    opacity: 0.5;
    pointer-events: none;
  }

  /* ── Floating ambient orbs ── */
  .splash-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
    animation: splash-drift 16s ease-in-out infinite alternate;
  }
  .splash-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(202,162,23,0.12) 0%, transparent 65%);
    top: -140px; left: 50%;
    transform: translateX(-50%);
    animation-duration: 18s;
  }
  .splash-orb-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(109,40,217,0.11) 0%, transparent 65%);
    bottom: -80px; left: -60px;
    animation-duration: 14s;
    animation-delay: -6s;
  }
  .splash-orb-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 65%);
    bottom: -60px; right: -60px;
    animation-duration: 20s;
    animation-delay: -10s;
  }
  @keyframes splash-drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(24px, 18px) scale(1.06); }
  }

  /* ── Centre content ── */
  .splash-center {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* ── Gold horizontal rule lines ── */
  .splash-rule {
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(202,162,23,0.6), transparent);
    position: relative;
  }
  .splash-rule::before {
    content: '';
    position: absolute;
    top: -2px; left: 50%;
    transform: translateX(-50%);
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(202,162,23,0.7);
    box-shadow: 0 0 8px rgba(202,162,23,0.8);
  }

  /* ── Eyebrow label ── */
  .splash-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(202,162,23,0.65);
    margin: 16px 0 20px;
  }

  /* ── Logo container ── */
  .splash-logo-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Outer rotating ring */
  .splash-ring {
    position: absolute;
    width: 220px; height: 220px;
    border-radius: 50%;
    border: 1px solid transparent;
    border-top-color: rgba(202,162,23,0.4);
    border-right-color: rgba(202,162,23,0.15);
    animation: splash-spin 4s linear infinite;
    pointer-events: none;
  }
  .splash-ring-inner {
    position: absolute;
    width: 188px; height: 188px;
    border-radius: 50%;
    border: 1px solid transparent;
    border-bottom-color: rgba(139,92,246,0.3);
    border-left-color: rgba(139,92,246,0.12);
    animation: splash-spin 2.8s linear infinite reverse;
    pointer-events: none;
  }
  @keyframes splash-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* Gold bloom glow behind logo */
  .splash-bloom {
    position: absolute;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(202,162,23,0.18) 0%, transparent 70%);
    filter: blur(22px);
    animation: splash-pulse-bloom 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes splash-pulse-bloom {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.12); }
  }

  .splash-logo {
    position: relative;
    height: 130px;
    width: auto;
    object-fit: contain;
    filter:
      drop-shadow(0 0 28px rgba(202,162,23,0.55))
      drop-shadow(0 0 60px rgba(202,162,23,0.20))
      brightness(1.05);
    animation: splash-logo-float 3s ease-in-out infinite;
  }
  @keyframes splash-logo-float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }

  /* ── Bottom metadata ── */
  .splash-meta {
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11.5px;
    color: rgba(180,170,210,0.45);
    letter-spacing: 0.05em;
  }
  .splash-meta-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(202,162,23,0.45);
    flex-shrink: 0;
  }

  /* ── Progress bar ── */
  .splash-progress-wrap {
    margin-top: 36px;
    width: 180px;
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  .splash-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #92700a, #f0d060, #c9a220);
    box-shadow: 0 0 8px rgba(202,162,23,0.7), 0 0 16px rgba(202,162,23,0.3);
    animation: splash-bar 1.8s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  @keyframes splash-bar {
    from { width: 0%; }
    to   { width: 100%; }
  }

  /* ── Tagline under bar ── */
  .splash-tagline {
    margin-top: 10px;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(180,170,210,0.28);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .splash-dot-blink {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(202,162,23,0.6);
    animation: splash-blink 1.2s ease-in-out infinite;
  }
  @keyframes splash-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.15; }
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "zentage-splash-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
}

export default function SplashScreen({ onComplete }) {
  useInjectStyles(SPLASH_CSS);

  // Automatically dismiss after 2.4s (bar finishes at 1.8s + 0.6s hold)
  useEffect(() => {
    const t = setTimeout(onComplete, 2400);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="splash-root"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: "blur(8px)",
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {/* Ambient orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      <div className="splash-center">

        {/* Top rule */}
        <motion.div
          className="splash-rule"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />

        {/* Eyebrow */}
        <motion.p
          className="splash-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          Sasnaka Sansada Foundation
        </motion.p>

        {/* Logo with rings */}
        <motion.div
          className="splash-logo-wrap"
          initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {/* Outer spinning ring */}
          <div className="splash-ring" />
          {/* Inner counter-spinning ring */}
          <div className="splash-ring-inner" />
          {/* Gold bloom glow */}
          <div className="splash-bloom" />
          {/* Logo */}
          <img src={logo} alt="Zentage" className="splash-logo" />
        </motion.div>

        {/* Bottom rule */}
        <motion.div
          className="splash-rule"
          style={{ marginTop: 20 }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />

        {/* Event meta */}
        <motion.div
          className="splash-meta"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          <span>September 6, 2026</span>
          <span className="splash-meta-dot" />
          <span>Elphinstone Theatre</span>
          <span className="splash-meta-dot" />
          <span>Maradana, Colombo</span>
        </motion.div>

        {/* Gold progress bar */}
        <motion.div
          className="splash-progress-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          <div className="splash-progress-fill" />
        </motion.div>

        {/* Loading tagline */}
        <motion.div
          className="splash-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <span className="splash-dot-blink" />
          Loading your experience
          <span className="splash-dot-blink" style={{ animationDelay: "0.4s" }} />
        </motion.div>

      </div>
    </motion.div>
  );
}
