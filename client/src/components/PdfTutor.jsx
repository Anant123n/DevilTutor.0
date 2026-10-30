import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, sessionId } from "../utils/api";

export default function PdfTutor() {
  const [filename, setFilename] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("pdf", file);
    form.append("sessionId", sessionId);
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/rag/upload", { method: "POST", body: form });
      setFilename(data.filename);
      setAnswer("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const ask = async (event) => {
    event.preventDefault();
    if (!question.trim() || !filename) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/rag/ask", {
        method: "POST",
        body: JSON.stringify({ question, sessionId }),
      });
      setAnswer(data.answer);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-6">
      <section className="max-w-3xl mx-auto bg-gradient-to-br from-[#1b1b3a] to-[#2c2c5c] rounded-3xl shadow-2xl p-10">
        <Link to="/" className="text-indigo-300 hover:text-indigo-200">← Home</Link>
        <h1 className="text-3xl font-bold my-6">📄 Ask your PDF</h1>
        <label className="block border-2 border-dashed border-indigo-400/60 rounded-2xl p-8 text-center cursor-pointer hover:bg-white/5">
          <span>{filename ? `Ready: ${filename}` : "Choose a PDF (up to 15 MB)"}</span>
          <input type="file" accept="application/pdf" onChange={upload} className="hidden" />
        </label>
        <form onSubmit={ask} className="mt-6 flex gap-3">
          <input value={question} onChange={(event) => setQuestion(event.target.value)} disabled={!filename} placeholder="Ask something from this document…" className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 disabled:opacity-50 outline-none" />
          <button disabled={!filename || loading} className="px-5 py-3 bg-indigo-600 rounded-xl font-semibold disabled:opacity-50">{loading ? "Working…" : "Ask"}</button>
        </form>
        {error && <p className="text-red-300 mt-5">{error}</p>}
        {answer && <div className="mt-6 bg-[#141414] border border-gray-700 rounded-2xl p-6 whitespace-pre-wrap">{answer}</div>}
      </section>
    </main>
  );
}
