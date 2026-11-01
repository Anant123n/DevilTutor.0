import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AlakhSir() {
  const {
    messages,
    isRecording,
    isSpeaking,
    startVoiceInput,
    stopVoiceInput,
    sendMessage,
    stopAudio,
    isLoading,
  } = useContext(AppContext);

  const userVideoRef = useRef(null);
  const alakhVideoRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [inputText, setInputText] = useState("");

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    if (alakhVideoRef.current) {
      if (isSpeaking) alakhVideoRef.current.play();
      else alakhVideoRef.current.pause();
    }
  }, [isSpeaking]);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    startCamera();
  }, []);

  useEffect(() => {
    if (isSpeaking && isRecording) stopAudio();
  }, [isRecording, isSpeaking, stopAudio]);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      const container = messagesContainerRef.current;
      if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [messages, isLoading]);

  return (
    <main className="relative flex h-[calc(100dvh-64px)] min-h-0 flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 font-inter text-white md:flex-row">
      <div className="relative flex h-[clamp(220px,43dvh,340px)] w-full shrink-0 items-center justify-center border-b border-gray-800 p-3 md:h-full md:w-[60%] md:border-b-0 md:border-r md:p-6 lg:w-[65%]">
        <div className="flex h-full w-full max-w-5xl flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b1b3a] to-[#2c2c5c] p-3 shadow-2xl md:max-h-[80vh] md:gap-0 md:rounded-3xl md:p-8">
          <div className="flex h-[clamp(130px,25dvh,190px)] w-[clamp(130px,25dvh,190px)] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300 md:h-64 md:w-64 lg:h-80 lg:w-80 xl:h-96 xl:w-96">
            <video
              ref={alakhVideoRef}
              src="/video.mp4"
              className="w-full h-full object-cover rounded-full"
              autoPlay
              loop
              muted
            />
          </div>
          <div className="min-w-0 text-center">
            <h2 className="text-lg font-semibold leading-tight sm:text-xl md:mt-6 md:text-3xl lg:text-4xl">AI Tutor — Jenny Mam</h2>
            <p className="mt-2 hidden max-w-md text-sm text-gray-400 sm:block md:text-base">
              Your personalized, interactive AI learning companion.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 w-full flex-1 bg-[#0e0e0e] p-2 sm:p-4 md:w-[40%] md:p-6 lg:w-[35%]">
        <div className="flex min-h-0 min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-[#111111] to-[#1b1b1b] p-3 shadow-2xl sm:p-4 md:rounded-3xl md:p-6">
          <h3 className="mb-2 shrink-0 text-center text-base font-semibold text-gray-200 sm:text-lg md:mb-4">Chat with Jenny Mam</h3>

          <div
            ref={messagesContainerRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain rounded-lg border border-gray-700 bg-[#141414] p-3"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] break-words px-4 py-2 rounded-2xl text-sm md:max-w-[85%] md:text-base ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <div className="markdown-message">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start" role="status" aria-live="polite">
                <div className="generating-bubble max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-none bg-gray-700 text-gray-100">
                  <span className="text-sm md:text-base">Thinking</span>
                  <span className="generating-dots" aria-hidden="true">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                </div>
              </div>
            )}

          </div>

          <div className="mt-2 flex shrink-0 items-center gap-2 sm:mt-4 md:gap-3">
            <button
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-lg transition-all duration-200 sm:h-12 sm:w-12 ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-green-600 hover:bg-green-700"
              } text-white text-xl focus:outline-none`}
              onClick={() => {
                if (!isRecording) startVoiceInput();
                else stopVoiceInput();
              }}
              title={isRecording ? "Stop Recording" : "Start Speaking"}
            >
              {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            <input
              type="text"
              className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-800 p-2.5 text-sm text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500 sm:p-3"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or speak..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputText.trim()) {
                  sendMessage(inputText);
                  setInputText("");
                }
              }}
            />

            <button
              disabled={isLoading}
              className="w-16 shrink-0 rounded-xl bg-indigo-600 px-2 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-indigo-700 disabled:opacity-50 sm:w-24 sm:px-3 sm:py-3"
              onClick={() => {
                if (inputText.trim()) {
                  sendMessage(inputText);
                  setInputText("");
                }
              }}
            >
              {isLoading ? <><span className="sm:hidden">…</span><span className="hidden sm:inline">Thinking…</span></> : "Send"}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{ "--camera-top": `${position.y}px`, "--camera-left": `${position.x}px`, cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        className="camera-preview absolute z-10 transition-transform duration-200"
      >
        <div className="h-16 w-16 rounded-full border-2 border-gray-700 bg-black shadow-lg sm:h-20 sm:w-20 md:h-40 md:w-40 md:border-4">
          <video ref={userVideoRef} autoPlay muted className="w-full h-full rounded-2xl object-cover" />
        </div>
      </div>
    </main>
  );
}
