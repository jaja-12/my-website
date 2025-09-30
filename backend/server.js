import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import contactRoutes from "./routes/contact.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/contact", contactRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
