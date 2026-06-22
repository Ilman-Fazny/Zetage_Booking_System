// src/lib/motionVariants.js
// ─── Shared Framer Motion variants for the Zentage design system ────────────

// ─── Page-level transitions ────────────────────────────────────────────────
// Cinematic expo-out: old page drifts up + fades, new page slides up + fades in.
export const pageVariants = {
  initial:    { opacity: 0, y: 15 },
  animate:    { opacity: 1, y: 0  },
  exit:       { opacity: 0, y: -8 },
  transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
};

// ─── Glassmorphic floating card ────────────────────────────────────────────
// Applies a perpetual soft-levitation loop after the entry animation completes.
// Use on: modal panels, info cards, SeatSummaryBar, TicketPage card.
export const floatingCardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: {
    opacity: 1,
    y: [0, -5, 0],
    scale: 1,
    transition: {
      opacity:  { duration: 0.5,  ease: [0.16, 1, 0.3, 1] },
      scale:    { duration: 0.5,  ease: [0.16, 1, 0.3, 1] },
      y: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay: 0.5,
      },
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.96,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Staggered list container ─────────────────────────────────────────────
// Apply to a <motion.ul>, <motion.tbody>, or any container element.
export const listContainerVariants = {
  initial:  {},
  animate:  { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  exit:     { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

// ─── Individual list item ─────────────────────────────────────────────────
// Apply to each <motion.tr>, <motion.li>, or row element.
export const listItemVariants = {
  initial: { opacity: 0, x: -14 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: 12,
    transition: { duration: 0.2 },
  },
};

// ─── Scale-pop reveal ─────────────────────────────────────────────────────
// Dramatic scale-from-small entry. Use on: ticket card, QR code container.
export const popVariants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.25 },
  },
};

// ─── Fade-up (generic section reveal) ────────────────────────────────────
// Lightweight entry for headers, dividers, secondary content.
export const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

// ─── Micro-interaction spring (button / input) ────────────────────────────
// Used directly via whileHover / whileTap on motion elements.
export const microSpring = {
  type: "spring",
  stiffness: 500,
  damping: 28,
};

export const softSpring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};
