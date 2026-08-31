import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Found@CVV backend is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Found@CVV server running on http://localhost:${PORT}`);
});