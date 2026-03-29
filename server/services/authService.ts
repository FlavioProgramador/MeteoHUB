import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";
import { LoginInput, RegisterInput, UserPayload } from "../types/index.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";

const JWT_SECRET: Secret =
  process.env.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

export interface AuthResult {
  user: UserPayload;
  token: string;
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

  const token = generateToken({ id: user.id, email: user.email });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
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

  const token = generateToken({ id: user.id, email: user.email });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};

export const getUserById = async (id: string) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }
  return user;
};

const generateToken = (payload: UserPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN_SECONDS };
  return jwt.sign(payload, JWT_SECRET, options);
};
