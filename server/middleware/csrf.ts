import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors.js";

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://meteo-hub.vercel.app"
  ];
  const origin = req.headers.origin;

  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    if (origin && !allowedOrigins.includes(origin) && process.env.CORS_ORIGIN !== "*") {
      next(
        new UnauthorizedError(
          "Acesso negado: Falha na verificação de origem (CSRF)",
        ),
      );
      return;
    }
  }

  next();
};
