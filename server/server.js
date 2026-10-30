import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chatRoutes from "./routes/chatRoutes.js";
import vivaRoutes from "./routes/vivaRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5050;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(currentDir, "../client/dist");

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", chatRoutes);
app.use("/api/viva", vivaRoutes);
app.use("/api/rag", ragRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    runtime: "node",
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  });
});

app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  return res.sendFile(path.join(clientDist, "index.html"), (error) => {
    if (error) next();
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({ error: status === 500 ? "The server could not complete the request." : error.message });
});

app.listen(port, () => console.log(`DevilTutor API running on http://localhost:${port}`));
