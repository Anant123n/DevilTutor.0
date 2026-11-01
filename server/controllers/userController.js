import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured on the server.");
    error.status = 500;
    throw error;
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

export async function registerUser(req, res) {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please enter your name, email, and password." });
    }
    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Name must be at least 2 characters." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0 })) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and include a letter and a number.",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userModel.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: createToken(user._id.toString()),
      user: publicUser(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }
    console.error("User registration failed:", error);
    return res.status(error.status || 500).json({ success: false, message: error.message || "Could not create account." });
  }
}

export async function loginUser(req, res) {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter your email and password." });
    }

    const user = await userModel.findOne({ email }).select("+password");
    const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.json({
      success: true,
      message: "Welcome back!",
      token: createToken(user._id.toString()),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("User login failed:", error);
    return res.status(error.status || 500).json({ success: false, message: error.message || "Could not log in." });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error("Loading user failed:", error);
    return res.status(500).json({ success: false, message: "Could not load your account." });
  }
}
