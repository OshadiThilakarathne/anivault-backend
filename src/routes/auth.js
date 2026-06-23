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
  (req, res, next) => {
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    }, (err, user, info) => {
      if (err) {
        console.error("Google OAuth error:", err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
      }
      if (!user) {
        console.error("No user returned:", info);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
      }
      const token = generateToken(user._id);
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    })(req, res, next);
  }
);

export default router;