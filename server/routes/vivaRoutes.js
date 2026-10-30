import express from "express";
import { evaluateAnswers, generateQuestions } from "../controllers/vivaController.js";

const router = express.Router();

router.post("/questions", generateQuestions);
router.post("/evaluate", evaluateAnswers);

export default router;
