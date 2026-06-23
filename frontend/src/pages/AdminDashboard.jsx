import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchStats, fetchBookings, fetchAdmins, promoteUser, demoteUser, resendBookingEmail } from "../lib/admin";
import { DISTRICTS } from "../lib/districts";
import { listContainerVariants, listItemVariants, microSpring } from "../lib/motionVariants";
import logo from "../assets/zentage-TS.png";
import QrScannerModal from "../components/QrScannerModal";

/* ─────────────────────────────────────────────────────────────────────────────
   Scoped styles — self-contained, no Tailwind conflicts
───────────────────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  /* ── Root ── */
  .adm-root {
    min-height: 100svh;
    background-color: #0D0D12;
    background-image:
      radial-gradient(ellipse 80% 40% at 50% 0%, rgba(109,40,217,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 40% 30% at 100% 80%, rgba(59,130,246,0.06) 0%, transparent 50%);
    font-family: 'Inter', system-ui, sans-serif;
    color: #e2d9ff;
    text-align: left;
    box-sizing: border-box;
  }
  .adm-root *, .adm-root *::before, .adm-root *::after { box-sizing: border-box; }

  /* ── Top bar ── */
  .adm-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 28px;
    background: rgba(255,255,255,0.025);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .adm-topbar-left { display: flex; align-items: center; gap: 14px; }
  .adm-logo {
    height: 36px; width: auto;
    filter: drop-shadow(0 0 10px rgba(139,92,246,0.4));
  }
  .adm-topbar-divider {
    width: 1px; height: 28px;
    background: rgba(255,255,255,0.08);
  }
  .adm-back-btn {
    background: none; border: none;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    color: rgba(180,170,210,0.55);
    cursor: pointer;
    letter-spacing: 0.02em;
    padding: 0;
    transition: color 0.2s;
  }
  .adm-back-btn:hover { color: rgba(180,170,210,0.9); }
  .adm-topbar-title { margin: 0; }
  .adm-topbar-title h1 {
    font-size: 15px;
    font-weight: 600;
    color: #e2d9ff;
    margin: 0 0 1px;
    letter-spacing: -0.01em;
  }
  .adm-topbar-title p {
    font-size: 11px;
    color: rgba(180,170,210,0.45);
    margin: 0;
    letter-spacing: 0.04em;
  }
  .adm-admin-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(202,162,23,0.9);
    border: 1px solid rgba(202,162,23,0.25);
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(202,162,23,0.06);
  }

  /* ── Tab bar ── */
  .adm-tabs {
    display: flex;
    gap: 0;
    padding: 0 28px;
    background: rgba(255,255,255,0.015);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .adm-tab {
    position: relative;
    background: none;
    border: none;
    padding: 14px 20px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.03em;
    cursor: pointer;
    text-transform: capitalize;
    color: rgba(180,170,210,0.45);
    transition: color 0.25s;
    outline: none;
  }
  .adm-tab::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 12px; right: 12px;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 0 10px rgba(139,92,246,0.7);
  }
  .adm-tab.active {
    color: #e2d9ff;
  }
  .adm-tab.active::after {
    transform: scaleX(1);
  }
  .adm-tab:hover:not(.active) { color: rgba(180,170,210,0.75); }

  /* ── Main content ── */
  .adm-content {
    padding: 28px;
    max-width: 1100px;
    margin: 0 auto;
  }

  /* ── Loading ── */
  .adm-loading {
    color: rgba(167,139,250,0.6);
    font-size: 13px;
    letter-spacing: 0.06em;
    padding: 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .adm-loading-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(139,92,246,0.7);
    animation: adm-pulse 1.2s ease-in-out infinite;
  }
  @keyframes adm-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.3; transform: scale(0.6); }
  }

  /* ── Stat cards grid ── */
  .adm-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  @media (min-width: 640px) {
    .adm-cards-grid { grid-template-columns: repeat(4, 1fr); }
  }

  /* ── Glass card ── */
  .adm-glass-card {
    position: relative;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 18px 20px;
    backdrop-filter: blur(12px);
    overflow: hidden;
    transition: border-color 0.25s, transform 0.2s;
  }
  .adm-glass-card::before {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--card-glow, rgba(255,255,255,0.12)), transparent);
  }
  .adm-glass-card:hover {
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-1px);
  }
  .adm-card-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 15px;
  }
  .adm-card-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(180,170,210,0.4);
    margin: 0 0 5px;
  }
  .adm-card-value {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0;
    color: #f0ece8;
    line-height: 1;
  }
  .adm-card-value.sm { font-size: 18px; letter-spacing: -0.02em; }
  .adm-card-sub {
    font-size: 11px;
    color: rgba(180,170,210,0.35);
    margin: 4px 0 0;
  }

  /* Card accent variants */
  .adm-card-total   { --card-glow: rgba(139,92,246,0.4); }
  .adm-card-booked  { --card-glow: rgba(251,146,60,0.5); border-color: rgba(251,146,60,0.12); }
  .adm-card-avail   { --card-glow: rgba(52,211,153,0.5); border-color: rgba(52,211,153,0.12); }
  .adm-card-revenue { --card-glow: rgba(202,162,23,0.55); border-color: rgba(202,162,23,0.14); }

  .adm-card-booked .adm-card-value  { color: #fb923c; }
  .adm-card-avail .adm-card-value   { color: #34d399; }
  .adm-card-revenue .adm-card-value { color: #fbbf24; }
  .adm-card-revenue .adm-card-icon  { background: rgba(202,162,23,0.1); color: #fbbf24; }
  .adm-card-booked .adm-card-icon   { background: rgba(251,146,60,0.1); color: #fb923c; }
  .adm-card-avail .adm-card-icon    { background: rgba(52,211,153,0.1); color: #34d399; }
  .adm-card-total .adm-card-icon    { background: rgba(139,92,246,0.12); color: #a78bfa; }

  /* ── Section panel ── */
  .adm-panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 20px 22px;
    margin-bottom: 16px;
    backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
  }
  .adm-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent);
  }
  .adm-panel-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(180,170,210,0.45);
    margin: 0 0 16px;
  }

  /* ── Occupancy bar ── */
  .adm-occ-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
  }
  .adm-occ-label {
    font-size: 13px;
    font-weight: 600;
    color: #e2d9ff;
  }
  .adm-occ-pct {
    font-size: 22px;
    font-weight: 700;
    color: #a78bfa;
    letter-spacing: -0.03em;
    font-family: 'JetBrains Mono', monospace;
  }
  .adm-occ-track {
    width: 100%;
    height: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    overflow: visible;
    position: relative;
  }
  .adm-occ-fill {
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(90deg, #5b21b6, #7c3aed, #a78bfa);
    position: relative;
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
    box-shadow:
      0 0 10px rgba(139,92,246,0.7),
      0 0 22px rgba(139,92,246,0.35),
      0 0 40px rgba(109,40,217,0.2);
  }
  /* Glow head dot */
  .adm-occ-fill::after {
    content: '';
    position: absolute;
    right: -4px; top: 50%;
    transform: translateY(-50%);
    width: 12px; height: 12px;
    border-radius: 50%;
    background: #c4b5fd;
    box-shadow: 0 0 10px rgba(196,181,253,0.9), 0 0 20px rgba(139,92,246,0.7);
  }
  /* Track secondary grid lines */
  .adm-occ-ticks {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }
  .adm-occ-tick {
    font-size: 9.5px;
    color: rgba(180,170,210,0.25);
    letter-spacing: 0.04em;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Sasnaka member card inline ── */
  .adm-sasnaka-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .adm-sasnaka-count {
    font-size: 36px;
    font-weight: 700;
    color: #34d399;
    letter-spacing: -0.04em;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
  }
  .adm-sasnaka-of {
    font-size: 12px;
    color: rgba(180,170,210,0.4);
    margin-top: 4px;
  }
  .adm-sasnaka-badge {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(52,211,153,0.8);
    border: 1px solid rgba(52,211,153,0.2);
    padding: 3px 10px;
    border-radius: 20px;
    background: rgba(52,211,153,0.05);
  }

  /* ── Bar rows (district / section) ── */
  .adm-bars-list { display: flex; flex-direction: column; gap: 10px; }
  .adm-bar-row {
    display: grid;
    grid-template-columns: 148px 1fr 40px;
    align-items: center;
    gap: 12px;
  }
  .adm-bar-label {
    font-size: 12px;
    color: rgba(210,204,240,0.7);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.01em;
  }
  .adm-bar-track {
    height: 6px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    overflow: visible;
    position: relative;
  }
  .adm-bar-fill {
    height: 100%;
    border-radius: 6px;
    background: linear-gradient(90deg, #5b21b6, #8b5cf6);
    position: relative;
    transition: width 0.9s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 0 8px rgba(139,92,246,0.55), 0 0 18px rgba(109,40,217,0.25);
  }
  .adm-bar-fill::after {
    content: '';
    position: absolute;
    right: -3px; top: 50%;
    transform: translateY(-50%);
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #c4b5fd;
    box-shadow: 0 0 6px rgba(196,181,253,0.9);
  }
  .adm-bar-count {
    font-size: 12px;
    font-weight: 600;
    color: rgba(167,139,250,0.8);
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.02em;
  }

  /* Top bar rows get gold tint */
  .adm-bar-row.top-district .adm-bar-fill {
    background: linear-gradient(90deg, #92700a, #c9a220);
    box-shadow: 0 0 8px rgba(202,162,23,0.55), 0 0 18px rgba(180,140,20,0.25);
  }
  .adm-bar-row.top-district .adm-bar-fill::after {
    background: #fde68a;
    box-shadow: 0 0 6px rgba(253,230,138,0.9);
  }
  .adm-bar-row.top-district .adm-bar-count { color: rgba(202,162,23,0.8); }

  /* ── Bookings tab ── */
  .adm-filter-panel {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 18px 22px;
    margin-bottom: 16px;
  }
  .adm-filter-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(180,170,210,0.4);
    margin: 0 0 12px;
  }
  .adm-filter-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  @media (min-width: 640px) {
    .adm-filter-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .adm-select {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    color: rgba(210,204,240,0.8);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 9px 12px;
    outline: none;
    width: 100%;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .adm-select:focus { border-color: rgba(139,92,246,0.45); }
  .adm-select option { background: #1a1529; color: #e2d9ff; }
  .adm-apply-btn {
    margin-top: 12px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    border: none;
    border-radius: 10px;
    padding: 9px 20px;
    cursor: pointer;
    letter-spacing: 0.04em;
    box-shadow: 0 0 16px rgba(109,40,217,0.4), 0 4px 10px rgba(109,40,217,0.3);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .adm-apply-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 24px rgba(109,40,217,0.6), 0 6px 14px rgba(109,40,217,0.4);
  }

  .adm-results-count {
    font-size: 12px;
    color: rgba(180,170,210,0.38);
    letter-spacing: 0.04em;
    margin-bottom: 12px;
  }

  /* ── Bookings table ── */
  .adm-table-wrap {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
  }
  .adm-table-scroll { overflow-x: auto; }
  .adm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .adm-table thead tr {
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .adm-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(180,170,210,0.38);
    white-space: nowrap;
  }
  .adm-table td {
    padding: 11px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.035);
    color: rgba(210,204,240,0.7);
    vertical-align: middle;
  }
  .adm-table tbody tr:last-child td { border-bottom: none; }
  .adm-table tbody tr:hover td { background: rgba(255,255,255,0.02); }
  .adm-td-ref {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: rgba(202,162,23,0.85);
    font-weight: 500;
  }
  .adm-td-seat {
    font-weight: 600;
    color: #a78bfa;
    font-size: 13px;
  }
  .adm-td-email {
    font-size: 11.5px;
    color: rgba(180,170,210,0.45);
  }
  .adm-td-date {
    font-size: 11.5px;
    color: rgba(180,170,210,0.35);
    white-space: nowrap;
  }
  .adm-badge-member {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(52,211,153,0.85);
    border: 1px solid rgba(52,211,153,0.2);
    padding: 2px 8px;
    border-radius: 20px;
    background: rgba(52,211,153,0.06);
    white-space: nowrap;
  }
  .adm-badge-no {
    font-size: 10px;
    font-weight: 600;
    color: rgba(255, 251, 0, 0.3);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: 1px solid rgba(233, 217, 35, 0.2);
    padding: 2px 8px;
    border-radius: 20px;
    background: rgba(83, 72, 21, 0.06);
    white-space: nowrap;
  }
  .adm-no-results {
    padding: 32px;
    text-align: center;
    font-size: 13px;
    color: rgba(180,170,210,0.35);
    letter-spacing: 0.02em;
  }
  .adm-topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .adm-scan-btn {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border: none;
    border-radius: 20px;
    padding: 6px 14px;
    cursor: pointer;
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 0 12px rgba(37,99,235,0.3);
    transition: transform 0.15s, box-shadow 0.15s, background-color 0.2s;
    outline: none;
  }
  .adm-scan-btn:hover {
    box-shadow: 0 0 18px rgba(37,99,235,0.5);
  }
  .adm-scan-btn:active {
    transform: translateY(0);
  }

  /* ── Search Input ── */
  .adm-input-wrapper {
    position: relative;
    margin-bottom: 16px;
  }
  .adm-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(180, 170, 210, 0.4);
    font-size: 14px;
    pointer-events: none;
  }
  .adm-input {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    color: #ede8ff;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 10px;
    padding: 10px 14px 10px 38px;
    outline: none;
    width: 100%;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .adm-input::placeholder {
    color: rgba(180, 170, 210, 0.35);
  }
  .adm-input:focus {
    border-color: rgba(139, 92, 246, 0.45);
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.15);
  }

  .adm-email-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .adm-badge-delivered {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #34d399;
    border: 1px solid rgba(52, 211, 153, 0.2);
    padding: 2.5px 8px;
    border-radius: 20px;
    background: rgba(52, 211, 153, 0.06);
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 0 8px rgba(52, 211, 153, 0.12);
  }

  .adm-badge-failed {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    padding: 2.5px 8px;
    border-radius: 20px;
    background: rgba(239, 68, 68, 0.06);
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.12);
  }

  /* ── Resend Button ── */
  .adm-btn-resend {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #a78bfa;
    background: rgba(167, 139, 250, 0.06);
    border: 1px solid rgba(167, 139, 250, 0.2);
    padding: 3px 8px;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease-in-out;
    outline: none;
  }
  .adm-btn-resend:hover {
    background: rgba(167, 139, 250, 0.15);
    color: #ffffff;
    border-color: rgba(167, 139, 250, 0.45);
    box-shadow: 0 0 8px rgba(167, 139, 250, 0.3);
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "zentage-admin-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
}

const SECTIONS = [
  "Ground Floor Center",
  "Ground Floor Right Side",
  "Balcony Left Side",
  "Balcony Right Side",
  "Balcony Front Side",
  "Upper",
];

export default function AdminDashboard() {
  useInjectStyles(STYLES);

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [tab, setTab] = useState("overview");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterSasnaka, setFilterSasnaka] = useState("");
  const [filterSection, setFilterSection] = useState("");

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .finally(() => setLoadingStats(false));
  }, []);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const data = await fetchBookings({
        district: filterDistrict || undefined,
        isSasnakaMember: filterSasnaka === "" ? undefined : filterSasnaka === "yes",
        section: filterSection || undefined,
      });
      setBookings(data);
    } finally {
      setLoadingBookings(false);
    }
  }, [filterDistrict, filterSasnaka, filterSection]);

  useEffect(() => {
    if (tab === "bookings") loadBookings();
  }, [tab, loadBookings]);

  return (
    <div className="adm-root">
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="adm-topbar">
        <div className="adm-topbar-left">
          <img src={logo} alt="Zentage" className="adm-logo" />
          <div className="adm-topbar-divider" />
          <div>
            <button className="adm-back-btn" onClick={() => navigate("/")}>
              ← Seat Map
            </button>
            <div className="adm-topbar-title">
              <h1>Admin Panel</h1>
              <p>Zentage Talent Show · September 6, 2026</p>
            </div>
          </div>
        </div>
        <div className="adm-topbar-right">
          <motion.button
            className="adm-scan-btn"
            onClick={() => setShowScanner(true)}
            whileHover={{ scale: 1.03, y: -0.5 }}
            whileTap={{ scale: 0.97 }}
            transition={microSpring}
          >
            <span>📷</span> Scan Entrance
          </motion.button>
          <span className="adm-admin-badge">Admin</span>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div className="adm-tabs">
        {["overview", "bookings", "admins"].map((t) => (
          <button
            key={t}
            className={`adm-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "overview" ? "⬡ Overview" : t === "bookings" ? "⊞ Bookings" : "🛡 Admins"}
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="adm-content">
        {tab === "overview" && (
          <OverviewTab stats={stats} loading={loadingStats} />
        )}
        {tab === "bookings" && (
          <BookingsTab
            bookings={bookings}
            loading={loadingBookings}
            filterDistrict={filterDistrict}
            setFilterDistrict={setFilterDistrict}
            filterSasnaka={filterSasnaka}
            setFilterSasnaka={setFilterSasnaka}
            filterSection={filterSection}
            setFilterSection={setFilterSection}
            onApplyFilters={loadBookings}
          />
        )}
        {tab === "admins" && (
          <AdminsTab />
        )}
      </div>

      <AnimatePresence>
        {showScanner && (
          <QrScannerModal onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Overview tab ──────────────────────────────────────────────────────────── */
function OverviewTab({ stats, loading }) {
  if (loading) {
    return (
      <div className="adm-loading">
        <span className="adm-loading-dot" />
        Loading analytics…
      </div>
    );
  }
  if (!stats) return null;

  const occupancy = Math.round((stats.booked_seats / stats.total_seats) * 100);
  const maxDistrict = stats.by_district
    ? Math.max(...Object.values(stats.by_district))
    : 1;
  const maxSection = stats.by_section
    ? Math.max(...Object.values(stats.by_section))
    : 1;

  return (
    <div>
      {/* ── Stat cards ── */}
      <motion.div
        className="adm-cards-grid"
        variants={listContainerVariants}
        initial="initial"
        animate="animate"
      >
        <GlassCard variant="total"  icon="⬡" label="Total Seats" value={stats.total_seats}   sub="venue capacity"    />
        <GlassCard variant="booked" icon="◈" label="Booked"     value={stats.booked_seats}   sub="confirmed tickets" />
        <GlassCard variant="avail"  icon="◇" label="Available"  value={stats.available_seats} sub="seats remaining"   />
        <GlassCard variant="revenue" icon="✦" label="Revenue" value={`LKR ${stats.total_revenue.toLocaleString()}`} small sub="total collected" />
      </motion.div>

      {/* ── Occupancy bar ── */}
      <div className="adm-panel" style={{ marginBottom: 16 }}>
        <p className="adm-panel-title">Occupancy Rate</p>
        <div className="adm-occ-header">
          <span className="adm-occ-label">Seat fill</span>
          <span className="adm-occ-pct">{occupancy}%</span>
        </div>
        <div className="adm-occ-track">
          <div className="adm-occ-fill" style={{ width: `${occupancy}%` }} />
        </div>
        <div className="adm-occ-ticks">
          {["0%", "25%", "50%", "75%", "100%"].map((t) => (
            <span key={t} className="adm-occ-tick">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Sasnaka members ── */}
      <div className="adm-panel" style={{ marginBottom: 16 }}>
        <p className="adm-panel-title">Sasnaka Sansada Members</p>
        <div className="adm-sasnaka-row">
          <div>
            <div className="adm-sasnaka-count">{stats.sasnaka_member_count}</div>
            <div className="adm-sasnaka-of">of {stats.booked_seats} total bookings</div>
          </div>
          <span className="adm-sasnaka-badge">
            {stats.booked_seats > 0
              ? `${Math.round((stats.sasnaka_member_count / stats.booked_seats) * 100)}% members`
              : "0% members"}
          </span>
        </div>
      </div>

      {/* ── Two column panels ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Bookings by district */}
        <div className="adm-panel" style={{ marginBottom: 0 }}>
          <p className="adm-panel-title">By District</p>
          {!stats.by_district || Object.keys(stats.by_district).length === 0 ? (
            <p style={{ fontSize: 12, color: "rgba(180,170,210,0.3)" }}>No bookings yet</p>
          ) : (
            <div className="adm-bars-list">
              {Object.entries(stats.by_district)
                .sort((a, b) => b[1] - a[1])
                .map(([district, count], i) => (
                  <GlowBarRow
                    key={district}
                    label={district}
                    count={count}
                    max={maxDistrict}
                    gold={i === 0}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Bookings by section */}
        <div className="adm-panel" style={{ marginBottom: 0 }}>
          <p className="adm-panel-title">By Section</p>
          {!stats.by_section || Object.keys(stats.by_section).length === 0 ? (
            <p style={{ fontSize: 12, color: "rgba(180,170,210,0.3)" }}>No bookings yet</p>
          ) : (
            <div className="adm-bars-list">
              {Object.entries(stats.by_section)
                .sort((a, b) => b[1] - a[1])
                .map(([section, count], i) => (
                  <GlowBarRow
                    key={section}
                    label={section}
                    count={count}
                    max={maxSection}
                    gold={i === 0}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlassCard({ variant, icon, label, value, sub, small }) {
  return (
    <motion.div
      className={`adm-glass-card adm-card-${variant}`}
      variants={listItemVariants}
      whileHover={{ y: -3, scale: 1.02, transition: microSpring }}
    >
      <div className="adm-card-icon">{icon}</div>
      <p className="adm-card-label">{label}</p>
      <p className={`adm-card-value${small ? " sm" : ""}`}>{value}</p>
      {sub && <p className="adm-card-sub">{sub}</p>}
    </motion.div>
  );
}

function GlowBarRow({ label, count, max, gold }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className={`adm-bar-row${gold ? " top-district" : ""}`}>
      <span className="adm-bar-label" title={label}>{label}</span>
      <div className="adm-bar-track">
        <div className="adm-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="adm-bar-count">{count}</span>
    </div>
  );
}

/* ─── Bookings tab ──────────────────────────────────────────────────────────── */
function BookingsTab({
  bookings, loading,
  filterDistrict, setFilterDistrict,
  filterSasnaka, setFilterSasnaka,
  filterSection, setFilterSection,
  onApplyFilters,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (b.booking_ref && b.booking_ref.toLowerCase().includes(query)) ||
      (b.attendee_name && b.attendee_name.toLowerCase().includes(query)) ||
      (b.user_email && b.user_email.toLowerCase().includes(query)) ||
      (b.seat_code && b.seat_code.toLowerCase().includes(query)) ||
      (b.district && b.district.toLowerCase().includes(query)) ||
      (b.section && b.section.toLowerCase().includes(query))
    );
  });

  const onResendEmail = async (bookingId, email) => {
    try {
      await resendBookingEmail(bookingId);
      alert(`Email resent successfully to ${email}!`);
      onApplyFilters();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to resend email.";
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div>
      {/* Filter panel */}
      <div className="adm-filter-panel">
        <p className="adm-filter-title">⊟ Filters & Search</p>
        
        {/* Search bar input */}
        <div className="adm-input-wrapper">
          <span className="adm-input-icon">🔍</span>
          <input
            type="text"
            className="adm-input"
            placeholder="Search by name, email, booking ref, seat, section, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="adm-filter-grid">
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="adm-select"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select
            value={filterSasnaka}
            onChange={(e) => setFilterSasnaka(e.target.value)}
            className="adm-select"
          >
            <option value="">Sasnaka - All</option>
            <option value="yes">Members Only</option>
            <option value="no">Non-members Only</option>
          </select>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="adm-select"
          >
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <motion.button
          className="adm-apply-btn"
          onClick={onApplyFilters}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={microSpring}
        >
          Apply Filters →
        </motion.button>
      </div>

      {/* Results count */}
      <p className="adm-results-count">
        {loading
          ? "Loading…"
          : `${filteredBookings.length} booking${filteredBookings.length !== 1 ? "s" : ""} found${searchQuery ? ` matching "${searchQuery}"` : ""}`}
      </p>

      {/* Table */}
      {!loading && filteredBookings.length === 0 ? (
        <div className="adm-table-wrap">
          <p className="adm-no-results">
            {bookings.length === 0
              ? "No bookings match the current filters."
              : "No bookings match your search query."}
          </p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  {["Ref", "Name", "Email", "Seat", "Section", "District", "Sasnaka", "Email Status", "Attendance", "Date"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                variants={listContainerVariants}
                initial="initial"
                animate="animate"
              >
                {filteredBookings.map((b) => (
                  <motion.tr key={b.id} variants={listItemVariants}>
                    <td className="adm-td-ref">{b.booking_ref}</td>
                    <td>{b.attendee_name || "—"}</td>
                    <td className="adm-td-email">{b.user_email}</td>
                    <td className="adm-td-seat">{b.seat_code}</td>
                    <td style={{ fontSize: 11.5, whiteSpace: "nowrap" }}>{b.section}</td>
                    <td>{b.district}</td>
                    <td>
                      {b.is_sasnaka_member
                        ? <span className="adm-badge-member">Member</span>
                        : <span className="adm-badge-no">No</span>}
                    </td>
                    <td>
                      <div className="adm-email-cell">
                        {b.email_sent ? (
                          <span className="adm-badge-delivered">Delivered</span>
                        ) : (
                          <span className="adm-badge-failed">Failed</span>
                        )}
                        <button
                          onClick={() => onResendEmail(b.id, b.user_email)}
                          className="adm-btn-resend"
                          title="Resend ticket email"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          Resend
                        </button>
                      </div>
                    </td>
                    <td>
                      {b.is_entered ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span className="adm-badge-member">Checked In</span>
                          {b.entered_at && (
                            <span style={{ fontSize: "10px", color: "rgba(52, 211, 153, 0.7)" }}>
                              {new Date(b.entered_at).toLocaleTimeString("en-LK", {
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="adm-badge-no" style={{ color: "rgba(180, 170, 210, 0.45)", borderColor: "rgba(180, 170, 210, 0.15)", background: "rgba(180, 170, 210, 0.02)" }}>Pending</span>
                      )}
                    </td>
                    <td className="adm-td-date">
                      {new Date(b.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Admins tab ────────────────────────────────────────────────────────────── */
function AdminsTab() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handlePromote = async (e) => {
    e.preventDefault();
    if (!promoteEmail.trim()) return;

    setPromoting(true);
    setError("");
    setSuccess("");

    try {
      const res = await promoteUser(promoteEmail);
      setSuccess(`Successfully promoted ${res.email} to Admin!`);
      setPromoteEmail("");
      // Refetch
      const updatedAdmins = await fetchAdmins();
      setAdmins(updatedAdmins);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to promote user to Admin.";
      setError(msg);
    } finally {
      setPromoting(false);
    }
  };

  const handleDemote = async (email) => {
    const isSuperAdmin = email.toLowerCase() === "ilmanfazny123@gmail.com";
    if (isSuperAdmin) {
      alert("Cannot demote the superadmin user.");
      return;
    }

    if (!window.confirm(`Are you sure you want to dismiss ${email} from the administrator role?`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await demoteUser(email);
      setSuccess(`Successfully dismissed ${email} from Admin role.`);
      // Refetch
      const updatedAdmins = await fetchAdmins();
      setAdmins(updatedAdmins);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to dismiss administrator.";
      setError(msg);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Promote Form */}
        <div className="adm-panel">
          <p className="adm-panel-title">🛡 Promote User to Admin</p>
          <form onSubmit={handlePromote} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              <div className="adm-input-wrapper" style={{ flexGrow: 1, marginBottom: 0 }}>
                <span className="adm-input-icon">✉️</span>
                <input
                  type="email"
                  className="adm-input"
                  placeholder="Enter user email address..."
                  value={promoteEmail}
                  onChange={(e) => setPromoteEmail(e.target.value)}
                  disabled={promoting}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="adm-apply-btn"
                style={{ marginTop: 0, padding: "10px 24px" }}
                disabled={promoting}
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                transition={microSpring}
              >
                {promoting ? "Promoting..." : "Promote Admin 🛡"}
              </motion.button>
            </div>
            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: "500", margin: "4px 0 0" }}>
                ❌ {error}
              </p>
            )}
            {success && (
              <p style={{ color: "#34d399", fontSize: "13px", fontWeight: "500", margin: "4px 0 0" }}>
                ✅ {success}
              </p>
            )}
          </form>
        </div>

        {/* Admins List */}
        <div className="adm-panel">
          <p className="adm-panel-title">📋 Current Admins List</p>
          {loading ? (
            <div className="adm-loading">
              <span className="adm-loading-dot" />
              Loading administrators…
            </div>
          ) : admins.length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(180,170,210,0.35)", textAlign: "center", padding: "20px 0" }}>
              No admins found.
            </p>
          ) : (
            <div className="adm-table-wrap">
              <div className="adm-table-scroll">
                <table className="adm-table">
                  <thead>
                    <tr>
                      {["ID", "Name", "Email", "Role", "Actions"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={listContainerVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {admins.map((admin) => {
                      const isSuperAdmin = admin.email.toLowerCase() === "ilmanfazny123@gmail.com";
                      return (
                        <motion.tr key={admin.id} variants={listItemVariants}>
                          <td className="adm-td-ref">#{admin.id}</td>
                          <td>{admin.name || "—"}</td>
                          <td className="adm-td-email">{admin.email}</td>
                          <td>
                            {isSuperAdmin ? (
                              <span className="adm-admin-badge" style={{ fontSize: "9.5px", padding: "2px 8px", color: "#fbbf24", borderColor: "rgba(251, 191, 36, 0.35)", background: "rgba(251, 191, 36, 0.08)" }}>
                                Super Admin 👑
                              </span>
                            ) : (
                              <span className="adm-admin-badge" style={{ fontSize: "9.5px", padding: "2px 8px" }}>
                                Admin
                              </span>
                            )}
                          </td>
                          <td>
                            {!isSuperAdmin ? (
                              <motion.button
                                onClick={() => handleDemote(admin.email)}
                                className="adm-scan-btn"
                                style={{
                                  background: "rgba(239, 68, 68, 0.08)",
                                  border: "1px solid rgba(239, 68, 68, 0.25)",
                                  color: "#ef4444",
                                  padding: "4px 10px",
                                  fontSize: "11.5px",
                                  boxShadow: "none",
                                  borderRadius: "6px",
                                  display: "inline-flex"
                                }}
                                whileHover={{ scale: 1.03, background: "rgba(239, 68, 68, 0.15)" }}
                                whileTap={{ scale: 0.97 }}
                                transition={microSpring}
                              >
                                Dismiss ⛔
                              </motion.button>
                            ) : (
                              <span style={{ fontSize: "11.5px", color: "rgba(180, 170, 210, 0.35)", fontWeight: "500", letterSpacing: "0.02em" }}>🔒 Permanent</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
