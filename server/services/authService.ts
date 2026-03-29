import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";
import { LoginInput, RegisterInput, UserPayload } from "../types/index.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";
import prisma from "../utils/prisma.js";

const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

export interface AuthResult {
  user: UserPayload;
  accessToken: string;
  refreshToken: string;
}

export const registerUser = async (
  input: RegisterInput,
): Promise<AuthResult> => {
  const { email, password, name } = input;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new ConflictError("Email já cadastrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    email,
    passwordHash,
    name,
  });

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Credenciais inválidas");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError("Credenciais inválidas");
  }

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  const refreshToken = await generateRefreshToken(user.id);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};

export const getUserById = async (id: string) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }
  return user;
};

const generateAccessToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = async (userId: string): Promise<string> => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

export const revokeRefreshToken = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};

export const refreshTokens = async (
  refreshToken: string,
): Promise<AuthResult> => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    }
    throw new UnauthorizedError("Refresh token inválido ou expirado");
  }

  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  const payload = {
    id: storedToken.user.id,
    email: storedToken.user.email,
    name: storedToken.user.name,
  };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = await generateRefreshToken(storedToken.user.id);

  return {
    user: payload,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
