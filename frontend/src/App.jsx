import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import AttendeeDetailsPage from "./pages/AttendeeDetailsPage";
import TicketPage from "./pages/TicketPage";
import AdminDashboard from "./pages/AdminDashboard";

function Placeholder({ name }) {
  return <div className="p-8 text-center text-gray-500">{name} — coming next</div>;
}

export default function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isFullScreen = location.pathname === "/login" || location.pathname === "/" || location.pathname === "/ticket" || location.pathname === "/admin" || location.pathname === "/details";

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SeatSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/details"
            element={
              <ProtectedRoute>
                <AttendeeDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!isFullScreen && (
        <footer className="py-4 text-center text-xs text-neutral-400 border-t border-neutral-200 bg-neutral-50 print:hidden select-none">
          © Sasnaka Sansada Talent Show 2026 - Zentage
        </footer>
      )}
    </div>
  );
}