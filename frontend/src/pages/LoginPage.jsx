import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginWithPassword, registerWithPassword, loginWithGoogle } from "../lib/auth";
import GoogleButton from "../components/shared/GoogleButton";
import logo from "../assets/zentage-TS.png";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100/60 via-sky-50 to-indigo-100/50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold tracking-wide text-black-600/80 uppercase mb-1">
            Sasnaka Sansada Foundation
          </p>
          <img src={logo} alt="Zentage Talent Show" className="mx-auto h-20 w-auto object-contain my-3 drop-shadow-sm" />
          <p className="text-sm text-neutral-500 mt-1">
            September 6, 2026 · Elphinstone Theatre, Maradana
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-blue-100/80 rounded-2xl p-6 shadow-xl shadow-blue-900/5">
          <div className="flex mb-6 rounded-lg bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition ${mode === "login" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
                }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 text-sm font-medium py-1.5 rounded-md transition ${mode === "register" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500"
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
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-sm shadow-blue-500/10"
            >
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
