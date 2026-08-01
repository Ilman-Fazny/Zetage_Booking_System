// src/components/shared/MotionButton.jsx
import { motion } from "framer-motion";
import { microSpring } from "../../lib/motionVariants";

/**
 * Drop-in animated wrapper for any <button>.
 * Scales up on hover (1.02) and presses inward on tap (0.98).
 * Forwards ALL native button props transparently - zero business logic inside.
 *
 * Usage:
 *   <MotionButton className="lp-submit-btn" type="submit" disabled={loading}>
 *     Log in
 *   </MotionButton>
 */
export default function MotionButton({ children, className, disabled, style, ...rest }) {
  return (
    <motion.button
      className={className}
      disabled={disabled}
      style={style}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled   ? { scale: 0.98, y: 0  } : {}}
      transition={microSpring}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
