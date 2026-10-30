import { generateJson } from "../services/geminiService.js";

export async function generateQuestions(req, res) {
  try {
    const topic = req.body?.topic?.trim();
    if (!topic) return res.status(400).json({ error: "Please provide a viva topic." });

    const questions = await generateJson({
      systemInstruction: "You create clear, academically useful oral-exam questions.",
      prompt: `Create exactly three short viva questions about ${topic}: one easy, one medium, and one hard. Return only the questions.`,
      schema: {
        type: "ARRAY",
        minItems: 3,
        maxItems: 3,
        items: { type: "STRING" },
      },
      generationConfig: { temperature: 0.7 },
    });

    return res.json({ topic, questions });
  } catch (error) {
    console.error("Viva question generation failed:", error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function evaluateAnswers(req, res) {
  try {
    const topic = req.body?.topic?.trim();
    const qaPairs = req.body?.qa_pairs;
    if (!topic || !Array.isArray(qaPairs) || qaPairs.length !== 3) {
      return res.status(400).json({ error: "Provide a topic and exactly three question-answer pairs." });
    }

    const evaluation = await generateJson({
      systemInstruction: "You are a strict but encouraging viva examiner.",
      prompt: `Evaluate these answers about ${topic}. Award one point per answer and provide concise, actionable feedback.\n${qaPairs
        .map(([question, answer], index) => `${index + 1}. Q: ${question}\nA: ${answer || "(no answer)"}`)
        .join("\n")}`,
      schema: {
        type: "OBJECT",
        required: ["score", "feedback"],
        properties: {
          score: { type: "INTEGER", minimum: 0, maximum: 3 },
          feedback: { type: "STRING" },
        },
      },
      generationConfig: { temperature: 0.3 },
    });

    const result = `Final Score: ${evaluation.score}/3\nFeedback: ${evaluation.feedback}`;
    return res.json({ topic, ...evaluation, result });
  } catch (error) {
    console.error("Viva evaluation failed:", error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}
