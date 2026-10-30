import { useRef, useState } from "react";
import { apiRequest, sessionId } from "../utils/api";
import { AppContext } from "./AppContext";

export const AppContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    stopAudio();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const playGeneratedVoice = (base64Audio, mimeType) => {
    stopAudio();
    const audio = new Audio(`data:${mimeType};base64,${base64Audio}`);
    audioRef.current = audio;
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => {
      audioRef.current = null;
      setIsSpeaking(false);
    };
    audio.onerror = () => {
      audioRef.current = null;
      setIsSpeaking(false);
    };
    audio.play().catch(() => speak("I could not play the generated voice."));
  };

  const sendMessage = async (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || isLoading) return;

    setMessages((current) => [...current.filter((message) => !message.temp), { sender: "user", text: cleanQuestion }]);
    setIsLoading(true);
    try {
      const data = await apiRequest("/chat", {
        method: "POST",
        body: JSON.stringify({ question: cleanQuestion, sessionId }),
      });
      setMessages((current) => [...current, { sender: "ai", text: data.answer_text }]);
      if (data.answer_audio) playGeneratedVoice(data.answer_audio, data.answer_audio_type || "audio/wav");
      else speak(data.answer_text);
    } catch (error) {
      setMessages((current) => [...current, { sender: "ai", text: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (isRecording) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      window.alert("Speech recognition is not supported in this browser.");
      return;
    }

    stopAudio();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    let transcript = "";

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
        .trim();
      if (transcript) {
        setMessages((current) => [
          ...current.filter((message) => !message.temp),
          { sender: "user", text: transcript, temp: true },
        ]);
      }
    };
    recognition.onend = () => {
      setIsRecording(false);
      setMessages((current) => current.filter((message) => !message.temp));
      if (transcript) sendMessage(transcript);
    };
    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => recognitionRef.current?.stop();
  const interruptAI = () => {
    stopAudio();
    startVoiceInput();
  };

  const value = {
    messages,
    isRecording,
    isSpeaking,
    isLoading,
    startVoiceInput,
    stopVoiceInput,
    sendMessage,
    stopAudio,
    interruptAI,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
