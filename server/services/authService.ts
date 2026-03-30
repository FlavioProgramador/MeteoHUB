import { prisma } from '../utils/prisma.js';
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
    throw new ConflictError("Email jÃ¡ cadastrado");
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
    throw new UnauthorizedError("Credenciais invÃ¡lidas");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError("Credenciais invÃ¡lidas");
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
    throw new NotFoundError("UsuÃ¡rio nÃ£o encontrado");
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
    throw new UnauthorizedError("Refresh token invÃ¡lido ou expirado");
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
import nodemailer from 'nodemailer';

export const generatePasswordReset = async (email: string) => {
  const user = await userRepository.findByEmail(email);
  if (!user) return; // NÃ£o envia erro para evitar name enumeration
  
  const resetToken = jwt.sign(
    { id: user.id }, 
    (process.env.JWT_SECRET || 'secret') + user.passwordHash, 
    { expiresIn: '1h' }
  );
  
  const resetLink = "http://localhost:5174/reset-password?token=${resetToken}&id=${user.id}";
  
  console.log('====== MOCK DE EMAIL DE RECUPERAÃ‡ÃƒO ======');
  console.log(Para recuperar a senha de ${email}, acesse:);
  console.log(resetLink);
  console.log('==========================================');

  // Caso tenha variÃ¡veis de env:
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
          from: "MeteoHUB" <>,
          to: email,
          subject: 'RecuperaÃ§Ã£o de Senha - MeteoHUB',
          text: Acesse este link para recriar sua senha:  \n\nVÃ¡lido por 1 hora.
      });
  }
};

export const resetPasswordByToken = async (token: string, newPassword: string) => {
  try {
     const decoded: any = jwt.decode(token);
     if (!decoded || !decoded.id) throw new Error('Token invÃ¡lido');
     const user = await userRepository.findById(decoded.id);
     if (!user) throw new Error('UsuÃ¡rio nÃ£o encontrado');

     // Verifica validade do token (hash Ã© anexado para garantir que a senha antiga ainda era a mesma quando o token foi emitido)
     jwt.verify(token, (process.env.JWT_SECRET || 'secret') + user.passwordHash) as unknown;

     const newPasswordHash = await bcrypt.hash(newPassword, 10);
     
     // Chamada via prisma direto por praticidade:
     
     await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash }
     });

  } catch (err) {
      throw new UnauthorizedError('Token de recuperaÃ§Ã£o invÃ¡lido ou expirado');
  }
};


