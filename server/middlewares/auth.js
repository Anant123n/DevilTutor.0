import jwt from "jsonwebtoken";

export default function authUser(req, res, next) {
  const authorization = req.get("authorization") || "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const token = bearerToken || req.get("token");

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: "Authentication is not configured on the server." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Your session is invalid or has expired. Please log in again." });
  }
}
