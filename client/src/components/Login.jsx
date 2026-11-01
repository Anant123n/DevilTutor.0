import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaXmark } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { authMode, setAuthMode, setShowAuth, login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = authMode === "login";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const switchMode = () => {
    setAuthMode(isLogin ? "signup" : "login");
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <form onSubmit={submit} className="relative my-auto w-full max-w-md rounded-3xl border border-indigo-400/25 bg-gradient-to-br from-[#1b1b3a] to-[#17172b] p-6 text-white shadow-2xl sm:p-8">
        <button type="button" onClick={() => setShowAuth(false)} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Close">
          <FaXmark />
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">DevilTutor</p>
        <h1 id="auth-title" className="mt-2 text-3xl font-bold">{isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm text-gray-400">{isLogin ? "Log in to continue learning with your AI tutors." : "Sign up to access tutors, PDF chat, and viva practice."}</p>

        <div className="mt-7 space-y-4">
          {!isLogin && (
            <label className="flex items-center gap-3 rounded-xl border border-gray-700 bg-black/25 px-4 focus-within:border-indigo-500">
              <FaUser className="text-gray-400" />
              <input value={name} onChange={(event) => setName(event.target.value)} type="text" autoComplete="name" placeholder="Full name" required className="w-full bg-transparent py-3 outline-none" />
            </label>
          )}
          <label className="flex items-center gap-3 rounded-xl border border-gray-700 bg-black/25 px-4 focus-within:border-indigo-500">
            <FaEnvelope className="text-gray-400" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="Email address" required className="w-full bg-transparent py-3 outline-none" />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-gray-700 bg-black/25 px-4 focus-within:border-indigo-500">
            <FaLock className="text-gray-400" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete={isLogin ? "current-password" : "new-password"} placeholder="Password" minLength={8} required className="w-full bg-transparent py-3 outline-none" />
          </label>
        </div>

        {!isLogin && <p className="mt-2 text-xs text-gray-500">Use at least 8 characters with a letter and a number.</p>}
        {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

        <button disabled={loading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 py-3 font-semibold shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Please wait…" : isLogin ? "Login" : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-400">
          {isLogin ? "New to DevilTutor?" : "Already have an account?"}{" "}
          <button type="button" onClick={switchMode} className="font-semibold text-indigo-300 hover:text-indigo-200">
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
