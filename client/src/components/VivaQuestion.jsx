import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { apiRequest } from "../utils/api";

export default function VivaQuestion() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.topic || !state?.questions?.length) return <Navigate to="/viva" replace />;

  const recordAnswer = (index) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return window.alert("Speech recognition is not supported in this browser.");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setRecordingIndex(index);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setAnswers((current) => ({ ...current, [index]: `${current[index] || ""} ${text}`.trim() }));
    };
    recognition.onend = () => setRecordingIndex(null);
    recognition.onerror = () => setRecordingIndex(null);
    recognition.start();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const qaPairs = state.questions.map((question, index) => [question, answers[index] || ""]);
      const data = await apiRequest("/viva/evaluate", {
        method: "POST",
        body: JSON.stringify({ topic: state.topic, qa_pairs: qaPairs }),
      });
      navigate("/viva/result", { state: data });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-8">
      <section className="max-w-3xl mx-auto bg-gradient-to-br from-[#1b1b3a] to-[#2c2c5c] p-10 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">🧠 Viva on {state.topic}</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {state.questions.map((question, index) => (
            <div key={question} className="space-y-3">
              <p className="text-lg font-semibold">Question {index + 1}: {question}</p>
              <div className="flex gap-3 items-start">
                <textarea
                  rows="3"
                  value={answers[index] || ""}
                  onChange={(event) => setAnswers((current) => ({ ...current, [index]: event.target.value }))}
                  className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Your answer…"
                />
                <button type="button" onClick={() => recordAnswer(index)} className={`w-12 h-12 grid place-items-center rounded-full ${recordingIndex === index ? "bg-red-500 animate-pulse" : "bg-green-600"}`}>
                  {recordingIndex === index ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              </div>
            </div>
          ))}
          {error && <p className="text-red-300">{error}</p>}
          <button disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl text-lg font-semibold">
            {loading ? "Evaluating…" : "Submit Answers"}
          </button>
        </form>
      </section>
    </main>
  );
}
