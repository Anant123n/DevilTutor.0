import { generateText } from "../services/geminiService.js";

const documents = new Map();

export function uploadPdf(req, res) {
  const sessionId = `${req.userId}:${String(req.body?.sessionId || "default")}`;
  if (!req.file) return res.status(400).json({ error: "Please upload a PDF in the 'pdf' field." });
  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({ error: "Only PDF files are supported." });
  }

  documents.set(sessionId, {
    data: req.file.buffer.toString("base64"),
    filename: req.file.originalname,
  });
  return res.json({ message: "PDF uploaded and ready for questions.", filename: req.file.originalname });
}

export async function askDocument(req, res) {
  try {
    const sessionId = `${req.userId}:${String(req.body?.sessionId || "default")}`;
    const question = req.body?.question?.trim();
    const document = documents.get(sessionId);
    if (!document) return res.status(400).json({ error: "Please upload a PDF first." });
    if (!question) return res.status(400).json({ error: "Please provide a question." });

    const answer = await generateText({
      systemInstruction:
        "Answer only from the supplied PDF. If the PDF does not contain the answer, say that clearly. Keep the answer concise.",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "application/pdf", data: document.data } },
            { text: `Document: ${document.filename}\nQuestion: ${question}` },
          ],
        },
      ],
      generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
    });

    return res.json({ question, answer });
  } catch (error) {
    console.error("Document question failed:", error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}
