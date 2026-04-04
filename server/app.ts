import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { csrfProtection } from "./middleware/csrf.js";
import { errorBoundary } from "./middleware/errorBoundary.js";
import routes from "./routes/index.js";
import { swaggerSpec } from "./swagger.js";

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
    origin: (origin, callback) => {
      // Lista de origens permitidas (localhosts e domínios Vercel)
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://meteo-hub.vercel.app"
      ];
      
      // Permitir requisições sem origem (como do Postman) ou permitidas
      if (!origin || allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === "*") {
        callback(null, true);
      } else {
        callback(new Error("Bloqueado pelo CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(csrfProtection);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Rota do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

app.use(errorBoundary as express.ErrorRequestHandler);

export default app;
