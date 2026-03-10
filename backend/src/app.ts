import express from "express";
import cors from "cors";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { config } from "./config/env.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: config.server.frontendUrl,
    credentials: true,
  })
);

// Welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 AI Feedback Classification API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      feedback: "/api/feedback",
      docs: "Check README.md for API documentation"
    }
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "✅ Server is running" });
});

// API Routes
app.use("/api/feedback", feedbackRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

export default app;
