import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorBoundary } from "./middleware/errorBoundary.js";
import routes from "./routes/index.js";

const app = express();

// Security Headers
app.use(helmet());

// Rate limiting (Basic Brute Force Protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message:
    "Muitas requisições desta origem, por favor tente novamente mais tarde.",
});
app.use("/api/", limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

// Error handler (MUST be the last middleware)
app.use(errorBoundary as express.ErrorRequestHandler);

export default app;
