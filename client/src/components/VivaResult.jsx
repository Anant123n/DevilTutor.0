import { Link, Navigate, useLocation } from "react-router-dom";

export default function VivaResult() {
  const { state } = useLocation();
  if (!state?.topic) return <Navigate to="/viva" replace />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white grid place-items-center p-6">
      <section className="bg-gradient-to-br from-[#1b1b3a] to-[#2c2c5c] rounded-3xl shadow-2xl p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">🧾 Viva Results for “{state.topic}”</h1>
        <div className="bg-[#141414] border border-gray-700 rounded-2xl p-6 text-gray-200 whitespace-pre-wrap">{state.result}</div>
        <Link to="/viva" className="block text-center mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold">🔁 Start New Viva</Link>
      </section>
    </main>
  );
}
