const apiBase = "https://generativelanguage.googleapis.com/v1beta/models";

function apiKey() {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    const error = new Error("Missing GOOGLE_API_KEY in server/.env.");
    error.status = 503;
    throw error;
  }
  return key;
}

function responseText(payload) {
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    const reason = payload.promptFeedback?.blockReason || "No text was returned by the model.";
    const error = new Error(reason);
    error.status = 502;
    throw error;
  }

  return text;
}

export async function generateContent({ contents, systemInstruction, generationConfig = {} }) {
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const response = await fetch(`${apiBase}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey(),
    },
    body: JSON.stringify({
      contents,
      ...(systemInstruction
        ? { systemInstruction: { parts: [{ text: systemInstruction }] } }
        : {}),
      generationConfig,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || "Gemini API request failed.");
    error.status = response.status === 429 ? 429 : 502;
    throw error;
  }

  return payload;
}

export async function generateText(options) {
  return responseText(await generateContent(options));
}

function speechText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " Code example omitted from speech. ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export async function generateSpeech(markdown) {
  const model = process.env.GEMINI_TTS_MODEL || "gemini-3.8-flash-tts";
  const response = await fetch(`${apiBase}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey(),
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: speechText(markdown),
              speechMetadata: {
                style:
                  "Warm, natural and conversational Indian English teacher. Speak at a slow, relaxed pace, about 20 percent slower than normal. Articulate each word clearly, with gentle emphasis and longer pauses between sentences and numbered points. Never sound robotic or rushed.",
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          languageCode: "en-IN",
          voiceConfig: { voice: process.env.GEMINI_TTS_VOICE || "Kore" },
        },
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || "Gemini speech generation failed.");
    error.status = 502;
    throw error;
  }

  const audioPart = payload.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data);
  if (!audioPart) {
    const error = new Error("Gemini speech generation returned no audio.");
    error.status = 502;
    throw error;
  }

  return {
    data: audioPart.inlineData.data,
    mimeType: audioPart.inlineData.mimeType || "audio/wav",
  };
}

export async function generateJson({ prompt, schema, systemInstruction, generationConfig = {} }) {
  const text = await generateText({
    systemInstruction,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      ...generationConfig,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("The AI returned an invalid structured response.");
    error.status = 502;
    throw error;
  }
}
