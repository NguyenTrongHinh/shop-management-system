import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {  // ✅ Sửa: Truyền user để thêm isAdmin vào token
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Đăng ký - CHO PHÉP TẠO ADMIN QUA SECRET KEY
export const register = async (req, res) => {
  const { username, email, password, adminSecret } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const usernameExists = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // ✅ CHO PHÉP TẠO ADMIN NẾU CÓ SECRET KEY ĐÚNG
    const isAdmin = adminSecret === process.env.ADMIN_SECRET_KEY;

    const user = await User.create({ 
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      isAdmin
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),  // ✅ Sửa: Truyền user để thêm isAdmin vào token
    });

  } catch (err) {
    console.error("Register error:", err);
    
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists` 
      });
    }

    res.status(500).json({ 
      message: "Server error during registration",
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

// Đăng nhập - ĐẢM BẢO TRẢ VỀ isAdmin
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
                          .select("+password");
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ TRẢ VỀ ĐẦY ĐỦ THÔNG TIN INCLUDING isAdmin
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),  // ✅ Sửa: Truyền user để thêm isAdmin vào token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error during login",
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
};

// Lấy thông tin user hiện tại - ĐẢM BẢO TRẢ VỀ isAdmin
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });

  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Đăng xuất
export const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};