import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import libraryRoutes from "./routes/library.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://anivault-ochre.vercel.app"],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "AniVault API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));