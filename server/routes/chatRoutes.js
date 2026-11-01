import express from "express";
import { askTutor } from "../controllers/chatController.js";
import authUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/chat", authUser, askTutor);

export default router;
