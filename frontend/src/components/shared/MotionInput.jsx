// src/components/shared/MotionInput.jsx
import { motion } from "framer-motion";
import { softSpring } from "../../lib/motionVariants";

/**
 * Drop-in animated wrapper for any <input>.
 * Lifts subtly on hover (scale 1.005) and on focus (scale 1.01).
 * Forwards ALL native input props transparently.
 *
 * Usage:
 *   <MotionInput className="lp-input" type="email" placeholder="Email address" ... />
 */
export default function MotionInput({ className, style, ...rest }) {
  return (
    <motion.input
      className={className}
      style={style}
      whileFocus={{ scale: 1.01 }}
      whileHover={{ scale: 1.005 }}
      transition={softSpring}
      {...rest}
    />
  );
}
