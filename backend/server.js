import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import contactRoutes from "./routes/contact.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "..");
const allowedOrigin = process.env.FRONTEND_ORIGIN;

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigin || origin === allowedOrigin) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"));
  }
}));
app.use(express.json({ limit: "20kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(express.static(frontendDir));

// Routes
app.use("/api/contact", contactRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
