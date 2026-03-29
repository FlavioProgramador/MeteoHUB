import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors.js";

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  const origin = req.headers.origin;

  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    if (origin && origin !== allowedOrigin) {
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
