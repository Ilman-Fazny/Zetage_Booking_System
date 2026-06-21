import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginWithPassword, registerWithPassword, loginWithGoogle } from "../lib/auth";
import GoogleButton from "../components/shared/GoogleButton";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSuccess(data) {
    login(data.access_token, data.user);
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await loginWithPassword(email, password)
          : await registerWithPassword(email, password, name);
      handleSuccess(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(credential) {
    setError("");
    try {
      const data = await loginWithGoogle(credential);
      handleSuccess(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Google sign-in failed.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase mb-1">
            Sasnaka Sansada Foundation
          </p>
          <h1 className="text-xl font-semibold text-neutral-900">Zentage Talent Show</h1>
          <p className="text-sm text-neutral-500 mt-1">
            September 6, 2026 · Elphinstone Theatre, Maradana
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <div className="flex mb-6 rounded-lg bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition ${
                mode === "login" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition ${
                mode === "register" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
              }`}
            >
              Register
            </button>
          </div>

          <div className="mb-5">
            <GoogleButton onCredential={handleGoogleCredential} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
