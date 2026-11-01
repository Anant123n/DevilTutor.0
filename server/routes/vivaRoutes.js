import express from "express";
import { evaluateAnswers, generateQuestions } from "../controllers/vivaController.js";
import authUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/questions", authUser, generateQuestions);
router.post("/evaluate", authUser, evaluateAnswers);

export default router;
