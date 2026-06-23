import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { popVariants, microSpring } from "../lib/motionVariants";
import debounce from "lodash.debounce";

const SCANNER_ID = "qr-reader";

const STYLES = `
  .qsm-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(6, 6, 9, 0.85);
    backdrop-filter: blur(8px);
    padding: 16px;
    font-family: 'Inter', system-ui, sans-serif;
  }
  .qsm-modal {
    background: linear-gradient(160deg, #161A28 0%, #111520 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 0 0 1px rgba(59, 130, 246, 0.05),
      0 24px 60px rgba(0, 0, 0, 0.7);
    border-radius: 20px;
    width: 100%;
    max-width: 380px;
    overflow: hidden;
    color: #ede8ff;
    position: relative;
    text-align: left;
  }
  .qsm-modal::before {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
  }
  .qsm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .qsm-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #b4aad2;
    margin: 0;
  }
  .qsm-close-btn {
    background: none;
    border: none;
    color: rgba(180, 170, 210, 0.45);
    font-size: 18px;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
    padding: 0;
  }
  .qsm-close-btn:hover {
    color: #ede8ff;
  }
  .qsm-body {
    padding: 20px;
  }
  .qsm-hint {
    font-size: 11.5px;
    color: rgba(180, 170, 210, 0.5);
    text-align: center;
    margin: 0 0 16px;
    letter-spacing: 0.01em;
  }
  .qsm-viewfinder-wrapper {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(0, 0, 0, 0.3);
    position: relative;
  }
  .qsm-viewfinder {
    width: 100%;
    min-height: 280px;
  }
  .qsm-error {
    text-align: center;
    padding: 24px 16px;
  }
  .qsm-error-icon {
    font-size: 36px;
    margin-bottom: 12px;
    filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.4));
  }
  .qsm-error-title {
    font-size: 14px;
    font-weight: 600;
    color: #ef4444;
    margin: 0 0 8px;
  }
  .qsm-error-text {
    font-size: 12px;
    color: rgba(180, 170, 210, 0.55);
    line-height: 1.5;
    margin: 0;
  }
  .qsm-result {
    text-align: center;
    padding: 24px 16px;
  }
  .qsm-result-ring {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 24px;
    font-weight: bold;
  }
  .qsm-result-ring.success {
    background: rgba(52, 211, 153, 0.1);
    border: 1.5px solid rgba(52, 211, 153, 0.35);
    color: #34d399;
    box-shadow: 0 0 18px rgba(52, 211, 153, 0.2);
  }
  .qsm-result-ring.failure {
    background: rgba(239, 68, 68, 0.1);
    border: 1.5px solid rgba(239, 68, 68, 0.35);
    color: #ef4444;
    box-shadow: 0 0 18px rgba(239, 68, 68, 0.2);
  }
  .qsm-result-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 12px;
    letter-spacing: -0.02em;
  }
  .qsm-result-title.success { color: #34d399; }
  .qsm-result-title.failure { color: #ef4444; }
  
  .qsm-result-seat {
    font-size: 20px;
    font-weight: 700;
    color: #a78bfa;
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .qsm-result-section {
    font-size: 12px;
    color: rgba(180, 170, 210, 0.6);
    margin: 0 0 4px;
  }
  .qsm-result-time {
    font-size: 11px;
    color: rgba(180, 170, 210, 0.4);
    margin: 0;
  }
  .qsm-result-msg {
    font-size: 13.5px;
    color: rgba(210, 204, 240, 0.7);
    line-height: 1.5;
    margin: 0;
  }
  .qsm-footer {
    padding: 0 20px 20px;
    display: flex;
    gap: 10px;
  }
  .qsm-btn {
    flex: 1;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 10px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, background-color 0.2s;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .qsm-btn-primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: #fff;
    box-shadow: 0 0 14px rgba(59, 130, 246, 0.3);
  }
  .qsm-btn-primary:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  .qsm-btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(220, 215, 255, 0.8);
  }
  .qsm-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;

function useInjectStyles(css) {
  useEffect(() => {
    const id = "qsm-scanner-modal-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, []);
}

// Add pulse overlay CSS to existing styles
const PULSE_CSS = `
.scanner-pulse {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #00ffb3, #00d994);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { opacity:.2; transform:scaleY(1); }
  50% { opacity:.8; transform:scaleY(1.2); }
  100% { opacity:.2; transform:scaleY(1); }
}`;


export default function QrScannerModal({ onClose }) {
  useInjectStyles(`${STYLES}\n${PULSE_CSS}`);

  const [result, setResult] = useState(null); // { success, message, seat_code, section, attended_at }
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef(null);
  const didScan = useRef(false);

  const startScanner = () => {
    setError(null);
    setResult(null);
    setScanning(true);
    didScan.current = false;
    // Ensure any previous instance is cleared
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (_) {}
    }

    const html5QrCode = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        // Debounced scan handler to prevent duplicate calls
        debounce(async (decodedText) => {
          if (didScan.current) return;
          didScan.current = true;
          setScanning(false);
          // Pause scanner to avoid further frames
          try { await html5QrCode.pause(); } catch (_) {}
          try {
            const res = await api.post("/admin/scan", { booking_ref: decodedText });
            setResult({ success: true, ...res.data });
          } catch (err) {
            const detail = err.response?.data?.detail || "Scan failed";
            setResult({ success: false, message: detail });
          } finally {
            // Resume after short delay to allow next scan
            setTimeout(() => {
              didScan.current = false;
              html5QrCode.resume();
            }, 1200);
          }
        }, 200, { leading: true, trailing: false }),
        () => {} // suppress verbose camera frame-processing logs
      )
      .catch((err) => {
        setError("Camera access denied or no camera found. Please configure browser camera permissions.");
        setScanning(false);
        console.error(err);
      });
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
        // attempt to shut down the camera if open
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop()
            .then(() => {
              try {
                scannerRef.current.clear();
              } catch (_) {}
            })
            .catch((err) => {
              console.error("Error during scanning teardown:", err);
            });
        } else {
          try {
            scannerRef.current.clear();
          } catch (_) {}
        }
      }
    };
  }, []);

  const handleScanAgain = () => {
    startScanner();
  };

  return (
    <div className="qsm-overlay">
      <motion.div
        className="qsm-modal"
        variants={popVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <div className="qsm-header">
          <h2 className="qsm-title">🎫 Entrance Scanner</h2>
          <button onClick={onClose} className="qsm-close-btn">
            ✕
          </button>
        </div>

        {/* Viewfinder - kept in DOM to prevent html5-qrcode crash, but hidden when inactive/error */}
        <div
          className="qsm-body"
          style={{ display: scanning && !error ? "block" : "none" }}
        >
          <p className="qsm-hint">
            Align the attendee's ticket QR code inside the bounding box
          </p>
          <div className="qsm-viewfinder-wrapper" style={{ position: "relative" }}>
            <div id={SCANNER_ID} className="qsm-viewfinder" />
            <div className="scanner-pulse" />
          </div>
        </div>

        {/* Camera error state */}
        {error && (
          <div className="qsm-body qsm-error">
            <div className="qsm-error-icon">📷</div>
            <h3 className="qsm-error-title">Camera Error</h3>
            <p className="qsm-error-text">{error}</p>
          </div>
        )}

        {/* Result — check-in successful */}
        {result?.success && (
          <div className="qsm-body qsm-result">
            <div className="qsm-result-ring success">✓</div>
            <h3 className="qsm-result-title success">Checked In</h3>
            <p className="qsm-result-seat">{result.seat_code}</p>
            <p className="qsm-result-section">{result.section}</p>
            {result.attended_at && (
              <p className="qsm-result-time">
                Time:{" "}
                {new Date(result.attended_at).toLocaleTimeString("en-LK", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            )}
          </div>
        )}

        {/* Result — check-in failed */}
        {result && !result.success && (
          <div className="qsm-body qsm-result">
            <div className="qsm-result-ring failure">✕</div>
            <h3 className="qsm-result-title failure">Scan Failed</h3>
            <p className="qsm-result-msg">{result.message}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="qsm-footer">
          {result && (
            <motion.button
              onClick={handleScanAgain}
              className="qsm-btn qsm-btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={microSpring}
            >
              <span>📷</span> Scan Next
            </motion.button>
          )}
          <motion.button
            onClick={onClose}
            className="qsm-btn qsm-btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={microSpring}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
