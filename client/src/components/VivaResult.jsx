import { Link, Navigate, useLocation } from "react-router-dom";

export default function VivaResult() {
  const { state } = useLocation();
  if (!state?.topic) return <Navigate to="/viva" replace />;

  return (
    <main className="grid min-h-[calc(100dvh-64px)] place-items-center bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 text-white sm:p-6">
      <section className="w-full max-w-3xl rounded-3xl bg-gradient-to-br from-[#1b1b3a] to-[#2c2c5c] p-5 shadow-2xl sm:p-10">
        <h1 className="mb-6 break-words text-center text-2xl font-bold sm:text-3xl">🧾 Viva Results for “{state.topic}”</h1>
        <div className="bg-[#141414] border border-gray-700 rounded-2xl p-6 text-gray-200 whitespace-pre-wrap">{state.result}</div>
        <Link to="/viva" className="block text-center mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold">🔁 Start New Viva</Link>
      </section>
    </main>
  );
}
