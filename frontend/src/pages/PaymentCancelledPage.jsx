import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { floatingCardVariants } from "../lib/motionVariants";
import { useDocumentTitle } from "../lib/useDocumentTitle";





export default function PaymentCancelledPage() {
  useDocumentTitle("Payment Cancelled");
  const navigate = useNavigate();

  return (
    <div className="pcp-root">
      <motion.div
        className="pcp-card"
        variants={floatingCardVariants}
        initial="initial"
        animate="animate"
      >
        <div className="pcp-icon-wrap">
          <svg className="pcp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="pcp-title">Payment Cancelled</h1>
        <p className="pcp-desc">
          Your payment was not completed, and the seat hold has been released. 
          Please return to the seat map to choose another seat.
        </p>

        <button
          onClick={() => navigate("/")}
          className="pcp-btn"
        >
          ← Back to seat map
        </button>

        {/* Emergency contact */}
        <div style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "11px",
          color: "rgba(156, 163, 175, 0.4)",
          letterSpacing: "0.02em"
        }}>
          Emergency support: <a href="tel:+94776702154" style={{ color: "rgba(239, 68, 68, 0.6)", textDecoration: "none", fontWeight: "500" }}>0776 702 154</a> (Ilman Fazny - Talent Show Co.)
        </div>
      </motion.div>
    </div>
  );
}
