import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, openAuth } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) openAuth("login");
  }, [isAuthenticated, loading, openAuth]);

  if (loading) {
    return <main className="grid min-h-[calc(100dvh-64px)] place-items-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-indigo-300">Loading your account…</main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="grid min-h-[calc(100dvh-64px)] place-items-center bg-gradient-to-br from-gray-900 via-black to-gray-950 p-6 text-white">
        <section className="max-w-md rounded-3xl border border-gray-800 bg-gray-900/70 p-8 text-center shadow-2xl">
          <h1 className="text-2xl font-bold">Login required</h1>
          <p className="mt-3 text-gray-400">Please log in or create an account to use DevilTutor’s AI learning tools.</p>
          <button onClick={() => openAuth("login")} className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-700">Open login</button>
          <Link to="/" className="mt-4 block text-sm text-indigo-300 hover:text-indigo-200">Return home</Link>
        </section>
      </main>
    );
  }

  return children;
}
