// src/lib/pricing.js
// ─── Centralized pricing configuration ───────────────────────────────────────
// All tier-related constants, colors, and helpers live here.
// Backend sends `tier` and `price` per seat; this file provides
// display metadata and calculation utilities for the frontend.

export const TIER_CONFIG = {
  premium: {
    price: 800,
    label: "Premium",
    color: "#f59e0b",           // warm amber/gold
    borderColor: "rgba(245,158,11,0.55)",
    glowColor: "rgba(245,158,11,0.35)",
    bgHint: "rgba(245,158,11,0.08)",
  },
  standard: {
    price: 600,
    label: "Standard",
    color: "#06b6d4",           // teal/cyan
    borderColor: "rgba(6,182,212,0.5)",
    glowColor: "rgba(6,182,212,0.3)",
    bgHint: "rgba(6,182,212,0.08)",
  },
  normal: {
    price: 500,
    label: "Normal",
    color: "rgba(255,255,255,0.25)",   // default silver
    borderColor: "rgba(255,255,255,0.25)",
    glowColor: "transparent",
    bgHint: "transparent",
  },
};

/**
 * Get the tier config for a seat object (from API).
 * Falls back to "normal" if tier is missing.
 */
export function getTierConfig(seat) {
  return TIER_CONFIG[seat?.tier] || TIER_CONFIG.normal;
}

/**
 * Get the price for a single seat.
 * Prefers the `price` field from the API; falls back to tier lookup.
 */
export function getSeatPrice(seat) {
  if (seat?.price != null) return seat.price;
  return getTierConfig(seat).price;
}

/**
 * Calculate total price for an array of selected seats.
 */
export function calculateTotal(seats) {
  return seats.reduce((sum, s) => sum + getSeatPrice(s), 0);
}

/**
 * Group seats by tier and return a breakdown array.
 * e.g. [{ tier: "premium", count: 2, subtotal: 1500 }, ...]
 */
export function getTierBreakdown(seats) {
  const groups = {};
  for (const s of seats) {
    const tier = s.tier || "normal";
    if (!groups[tier]) {
      groups[tier] = { tier, label: TIER_CONFIG[tier]?.label || tier, count: 0, unitPrice: getSeatPrice(s), subtotal: 0 };
    }
    groups[tier].count += 1;
    groups[tier].subtotal += getSeatPrice(s);
  }
  // Sort: premium first, then standard, then normal
  const order = ["premium", "standard", "normal"];
  return order.filter(t => groups[t]).map(t => groups[t]);
}
