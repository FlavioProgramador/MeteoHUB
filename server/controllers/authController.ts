import { Response } from "express";
import {
  getUserById,
  loginUser,
  registerUser,
} from "../services/authService.js";
import {
  AuthenticatedRequest,
  LoginInput,
  RegisterInput,
} from "../types/index.js";
import { UnauthorizedError, ValidationError } from "../utils/errors.js";
import { sendSuccess } from "../utils/response.js";

const setTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { email, password, name } = req.body as RegisterInput;

  if (!email || !password) {
    throw new ValidationError("Email e senha são obrigatórios");
  }

  if (password.length < 6) {
    throw new ValidationError("Senha deve ter pelo menos 6 caracteres");
  }

  const result = await registerUser({ email, password, name });

  setTokenCookie(res, result.token);

  sendSuccess(res, { user: result.user }, "Usuário criado com sucesso", 201);
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body as LoginInput;

  if (!email || !password) {
    throw new ValidationError("Email e senha são obrigatórios");
  }

  const result = await loginUser({ email, password });

  setTokenCookie(res, result.token);

  sendSuccess(res, { user: result.user }, "Login realizado com sucesso");
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
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), 
  });

  sendSuccess(res, null, "Logout realizado com sucesso");
};
