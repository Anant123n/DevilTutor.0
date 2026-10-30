import { generateSpeech, generateText } from "../services/geminiService.js";

const conversations = new Map();
const maxHistoryItems = 12;

export const askTutor = async (req, res) => {
  try {
    const question = req.body?.question?.trim();
    const sessionId = String(req.body?.sessionId || "default");

    if (!question) {
      return res.status(400).json({ error: "Please provide a question." });
    }

    const history = conversations.get(sessionId) || [];
    const answer = await generateText({
      systemInstruction:
        "You are DevilTutor, a friendly teacher. Explain the answer step by step in simple language. Keep it concise (about 80 words unless the student asks for more).",
      contents: [...history, { role: "user", parts: [{ text: question }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
    });

    conversations.set(
      sessionId,
      [...history, { role: "user", parts: [{ text: question }] }, { role: "model", parts: [{ text: answer }] }].slice(
        -maxHistoryItems,
      ),
    );

    let speech = null;
    try {
      speech = await generateSpeech(answer);
    } catch (speechError) {
      console.error("Human-like voice generation failed; using browser fallback:", speechError.message);
    }

    return res.json({
      question,
      answer_text: answer,
      ...(speech ? { answer_audio: speech.data, answer_audio_type: speech.mimeType } : {}),
    });
  } catch (error) {
    console.error("Tutor request failed:", error);
    return res.status(error.status || 500).json({ error: error.message || "Tutor request failed." });
  }
};
