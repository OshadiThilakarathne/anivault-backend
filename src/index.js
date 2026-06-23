import "./env.js";
import express from "express";
import cors from "cors";
import passport from "./config/passport.js";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import libraryRoutes from "./routes/library.js";

const app = express();

app.use(cors({
  origin: [process.env.CLIENT_URL, "https://anivault-ochre.vercel.app"],
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

connectDB();

app.use("/api/auth",    authRoutes);
app.use("/api/library", libraryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "AniVault API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));