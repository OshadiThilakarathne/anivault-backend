import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import { register, login, getMe } from "../controllers/authController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Email/password routes
router.post("/register", register);
router.post("/login",    login);
router.get("/me",        protect, getMe);

// Google OAuth routes
router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get("/google/callback",
  passport.authenticate("google", {
    session:  false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect to frontend with token in URL
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

export default router;