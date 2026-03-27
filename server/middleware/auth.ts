import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/index.js";
import { UnauthorizedError } from "../utils/errors.js";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Busca o token primeiramente via cookie para segurança (HttpOnly)
    // ou via Authorization header (fallback para clientes não web)
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      throw new UnauthorizedError("Token não fornecido");
    }

    const secret =
      process.env.JWT_SECRET || "default-secret-change-in-production";

    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    next(new UnauthorizedError("Token inválido ou expirado"));
  }
};
