import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { floatingCardVariants } from "../lib/motionVariants";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .pcp-root {
    min-height: 100svh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0D0D12;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(239, 68, 68, 0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 35% at 50% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
    padding: 24px 16px;
    font-family: 'Inter', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
  }
  .pcp-root *, .pcp-root *::before, .pcp-root *::after { box-sizing: border-box; }

  .pcp-card {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.035);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    padding: 36px 28px;
    box-shadow:
      0 0 0 1px rgba(239, 68, 68, 0.05),
      0 24px 60px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    position: relative;
    text-align: center;
  }

  .pcp-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent);
  }

  .pcp-icon-wrap {
    width: 56px;
    height: 56px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
  }

  .pcp-icon {
    width: 24px;
    height: 24px;
    color: #f87171;
  }

  .pcp-title {
    font-size: 18px;
    font-weight: 700;
    color: #fca5a5;
    letter-spacing: -0.01em;
    margin: 0 0 12px;
  }

  .pcp-desc {
    font-size: 13.5px;
    color: rgba(156, 163, 175, 0.7);
    line-height: 1.5;
    margin: 0 0 28px;
  }

  .pcp-btn {
    width: 100%;
    padding: 12px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: #fff;
    background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .pcp-btn:hover {
    background: linear-gradient(135deg, #2e2a72 0%, #1e293b 100%);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    box-shadow:
      0 6px 16px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .pcp-btn:active {
    transform: translateY(0);
  }

  /* Emergency contact */
  .pcp-emergency {
    margin-top: 16px;
    padding: 12px 14px;
    background: rgba(239,68,68,0.06);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
  }
  .pcp-emergency-text { flex: 1; }
  .pcp-emergency-label {
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(239,68,68,0.7); margin: 0 0 2px;
  }
  .pcp-emergency-name {
    font-size: 12px; font-weight: 600;
    color: rgba(240,236,232,0.85); margin: 0 0 1px;
  }
  .pcp-emergency-link {
    font-size: 12.5px; font-weight: 700;
    font-family: monospace;
    color: #fca5a5;
    text-decoration: none;
    display: flex; align-items: center; gap: 4px;
  }
  .pcp-emergency-link:hover { color: #f87171; }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "zentage-pcp-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
}

export default function PaymentCancelledPage() {
  useInjectStyles(STYLES);
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
          Emergency support: <a href="tel:+94776702154" style={{ color: "rgba(239, 68, 68, 0.6)", textDecoration: "none", fontWeight: "500" }}>0776 702 154</a> (Ilman Fazny &mdash; Talent Show Co.)
        </div>
      </motion.div>
    </div>
  );
}
