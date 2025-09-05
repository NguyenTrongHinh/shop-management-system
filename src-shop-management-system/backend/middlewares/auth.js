// middlewares/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const raw = req.header("Authorization")?.replace("Bearer ", "");
    if (!raw) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(raw, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ success: false, message: "Invalid token" });

    // tối ưu: dùng payload trước, nhưng để chắc chắn lấy dữ liệu mới nhất (nếu cần)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = { _id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin };    next();
  } catch (err) {
    console.error("Auth error:", err);
    if (err.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired" });
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }
};

// middleware kiểm tra role admin, dùng sau auth
export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
  if (!req.user.isAdmin) return res.status(403).json({ success: false, message: "Admin required" });
  next();
};

export default auth;
