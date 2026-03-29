import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { csrfProtection } from "./middleware/csrf.js";
import { errorBoundary } from "./middleware/errorBoundary.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message:
    "Muitas requisições desta origem, por favor tente novamente mais tarde.",
});
app.use("/api/", limiter);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(csrfProtection);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

app.use(errorBoundary as express.ErrorRequestHandler);

export default app;
