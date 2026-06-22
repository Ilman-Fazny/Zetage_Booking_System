import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import AttendeeDetailsPage from "./pages/AttendeeDetailsPage";
import TicketPage from "./pages/TicketPage";

function Placeholder({ name }) {
  return <div className="p-8 text-center text-gray-500">{name} — coming next</div>;
}

export default function App() {
  return (
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
            <Placeholder name="Admin dashboard" />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}