import bcrypt from 'bcryptjs'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import prisma from '../utils/prisma.js'
import { RegisterInput, LoginInput, UserPayload } from '../types/index.js'

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret-change-in-production'
const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60

export interface AuthResult {
  user: UserPayload
  token: string
}

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const { email, password, name } = input

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('Email já cadastrado')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
  })

  const token = generateToken({ id: user.id, email: user.email })

  return {
    user: { id: user.id, email: user.email },
    token,
  }
}

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Credenciais inválidas')
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isValidPassword) {
    throw new Error('Credenciais inválidas')
  }

  const token = generateToken({ id: user.id, email: user.email })

  return {
    user: { id: user.id, email: user.email },
    token,
  }
}

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
    },
  })
}

const generateToken = (payload: UserPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN_SECONDS }
  return jwt.sign(payload, JWT_SECRET, options)
}