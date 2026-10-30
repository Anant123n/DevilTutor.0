import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function VivaTopic() {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!topic.trim()) return;
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/viva/questions", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });
      navigate("/viva/questions", { state: data });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white grid place-items-center p-6">
      <section className="bg-gradient-to-br from-[#1b1b3a] to-[#2c2c5c] rounded-3xl shadow-2xl p-10 w-full max-w-lg">
        <Link to="/" className="text-indigo-300 hover:text-indigo-200">← Home</Link>
        <h1 className="text-3xl font-bold my-6 text-center">🎓 AI Viva Assistant</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-lg font-medium" htmlFor="topic">Enter your viva topic</label>
          <input
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g. Artificial Intelligence"
            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {error && <p className="text-red-300">{error}</p>}
          <button disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl font-semibold">
            {loading ? "Generating…" : "Start Viva"}
          </button>
        </form>
      </section>
    </main>
  );
}
