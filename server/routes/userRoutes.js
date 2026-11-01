import express from "express";
import { getCurrentUser, loginUser, registerUser } from "../controllers/userController.js";
import authUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authUser, getCurrentUser);

export default router;
