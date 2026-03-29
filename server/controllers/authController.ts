import { Response, Request } from "express";
import { z } from "zod";
import {
  getUserById,
  loginUser,
  registerUser,
  refreshTokens,
  revokeRefreshToken
} from "../services/authService.js";
import { AuthenticatedRequest } from "../types/index.js";
import { UnauthorizedError, ValidationError } from "../utils/errors.js";
import { sendSuccess } from "../utils/response.js";

const passwordSchema = z.string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial");

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: passwordSchema,
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional()
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória")
});

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === "production";
  
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerUser(validatedData);
    setTokenCookies(res, result.accessToken, result.refreshToken);
    sendSuccess(res, { user: result.user }, "Usuário criado com sucesso", 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message);
    }
    throw error;
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser({ email, password });
    setTokenCookies(res, result.accessToken, result.refreshToken);
    sendSuccess(res, { user: result.user }, "Login realizado com sucesso");
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors[0].message);
    }
    throw error;
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshTokenCookie = req.cookies?.refreshToken;
  
  if (!refreshTokenCookie) {
    throw new UnauthorizedError("Refresh token não fornecido");
  }

  const result = await refreshTokens(refreshTokenCookie);
  setTokenCookies(res, result.accessToken, result.refreshToken);
  
  sendSuccess(res, { user: result.user }, "Token renovado com sucesso");
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  if (!req.user?.id) {
    throw new UnauthorizedError("Usuário não autenticado");
  }

  const user = await getUserById(req.user.id);
  sendSuccess(res, user);
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const refreshTokenCookie = req.cookies?.refreshToken;
  if (refreshTokenCookie) {
    try {
      await revokeRefreshToken(refreshTokenCookie);
    } catch (e) {
      console.error(e);
    }
  }

  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  sendSuccess(res, null, "Logout realizado com sucesso");
};
