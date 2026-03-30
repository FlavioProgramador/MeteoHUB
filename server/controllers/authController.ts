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
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra mai√∫scula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra min√∫scula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um n√∫mero")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial");

const registerSchema = z.object({
  email: z.string().email("E-mail inv√°lido"),
  password: passwordSchema,
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional()
});

const loginSchema = z.object({
  email: z.string().email("E-mail inv√°lido"),
  password: z.string().min(1, "A senha √© obrigat√≥ria")
});

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
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
    sendSuccess(res, { user: result.user }, "Usu√°rio criado com sucesso", 201);
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
    throw new UnauthorizedError("Refresh token n√£o fornecido");
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
    throw new UnauthorizedError("Usu√°rio n√£o autenticado");
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

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) throw new Error("Email È obrigatÛrio");
  await authService.generatePasswordReset(email);
  sendSuccess(res, null, "Se o email existir, um link de recuperaÁ„o foi enviado.");
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) throw new Error("Token e nova senha s„o obrigatÛrios");
  await authService.resetPasswordByToken(token, newPassword);
  sendSuccess(res, null, "Senha atualizada com sucesso.");
};
