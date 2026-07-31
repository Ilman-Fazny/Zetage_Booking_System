// src/App.jsx
import { useState, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import SplashScreen from "./components/shared/SplashScreen";
import LoginPage from "./pages/LoginPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import AttendeeDetailsPage from "./pages/AttendeeDetailsPage";
import TicketPage from "./pages/TicketPage";
import MyTicketPage from "./pages/MyTicketPage";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentCancelledPage from "./pages/PaymentCancelledPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";

// ─── Cinematic page transition config ──────────────────────────────────────
const PAGE_TRANSITION = {
  initial:    { opacity: 0, y: 15 },
  animate:    { opacity: 1, y: 0  },
  exit:       { opacity: 0, y: -8 },
  transition: {
    duration: 0.48,
    ease: [0.16, 1, 0.3, 1],
  },
};

// ─── PageShell: wraps every route ─────────────────────────────────────────
function PageShell({ children }) {
  return (
    <motion.div
      style={{ width: "100%", willChange: "opacity, transform" }}
      {...PAGE_TRANSITION}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  const isFullScreen =
    ["/login", "/", "/ticket", "/my-ticket", "/admin", "/details", "/payment-cancelled",
      "/privacy-policy", "/terms", "/return-policy"]
      .includes(location.pathname);

  return (
    <>
      {/* ── Cinematic Splash Screen (shown once on app load) ─────────────── */}
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {/* ── Main App (mounts immediately, revealed after splash exits) ───── */}
      <div
        className="flex flex-col min-h-screen w-full"
        style={{ display: splashDone ? "flex" : "none" }}
      >
        <div className="flex-grow">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.key}>
              <Route
                path="/login"
                element={<PageShell><LoginPage /></PageShell>}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <PageShell><SeatSelectionPage /></PageShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/details"
                element={
                  <ProtectedRoute>
                    <PageShell><AttendeeDetailsPage /></PageShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ticket"
                element={
                  <ProtectedRoute>
                    <PageShell><TicketPage /></PageShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-ticket"
                element={
                  <ProtectedRoute>
                    <PageShell><MyTicketPage /></PageShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <PageShell><AdminDashboard /></PageShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-cancelled"
                element={
                  <ProtectedRoute>
                    <PageShell><PaymentCancelledPage /></PageShell>
                  </ProtectedRoute>
                }
              />
              {/* ── Public policy pages (no auth required) ─── */}
              <Route
                path="/privacy-policy"
                element={<PageShell><PrivacyPolicyPage /></PageShell>}
              />
              <Route
                path="/terms"
                element={<PageShell><TermsPage /></PageShell>}
              />
              <Route
                path="/return-policy"
                element={<PageShell><ReturnPolicyPage /></PageShell>}
              />
            </Routes>
          </AnimatePresence>
        </div>

        {!isFullScreen && (
          <footer className="py-4 text-center text-xs text-neutral-400 border-t border-neutral-200 bg-neutral-50 print:hidden select-none">
            <div>© Sasnaka Sansada Talent Show 2026 - Zentage</div>
            <div style={{ marginTop: "6px", display: "flex", justifyContent: "center", gap: "16px" }}>
              <a href="/privacy-policy" style={{ color: "#9ca3af", textDecoration: "none" }}>Privacy Policy</a>
              <a href="/terms" style={{ color: "#9ca3af", textDecoration: "none" }}>Terms &amp; Conditions</a>
              <a href="/return-policy" style={{ color: "#9ca3af", textDecoration: "none" }}>Return Policy</a>
            </div>
          </footer>
        )}
      </div>
    </>
  );
}