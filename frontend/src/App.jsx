import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

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
            <Placeholder name="Seat selection" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/details"
        element={
          <ProtectedRoute>
            <Placeholder name="Attendee details" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ticket"
        element={
          <ProtectedRoute>
            <Placeholder name="Ticket" />
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