import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already in use"
            : "Username already taken",
      });
    }

    const salt     = await bcrypt.genSalt(12);
    const hashed   = await bcrypt.hash(password, salt);
    const user     = await User.create({ username, email, password: hashed });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    id:       req.user._id,
    username: req.user.username,
    email:    req.user.email,
    avatar:   req.user.avatar || null,
  });
};
// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );
    res.json({
      id:       user._id,
      username: user.username,
      email:    user.email,
      avatar:   user.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};