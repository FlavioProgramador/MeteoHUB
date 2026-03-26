import { Response } from 'express'
import { AuthenticatedRequest, RegisterInput, LoginInput } from '../types/index.js'
import { registerUser, loginUser, getUserById } from '../services/authService.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body as RegisterInput

    if (!email || !password) {
      sendError(res, 'Email e senha são obrigatórios', 400)
      return
    }

    if (password.length < 6) {
      sendError(res, 'Senha deve ter pelo menos 6 caracteres', 400)
      return
    }

    const result = await registerUser({ email, password, name })

    sendSuccess(res, result, 'Usuário criado com sucesso', 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar usuário'
    sendError(res, message, 400)
  }
}

export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput

    if (!email || !password) {
      sendError(res, 'Email e senha são obrigatórios', 400)
      return
    }

    const result = await loginUser({ email, password })

    sendSuccess(res, result, 'Login realizado com sucesso')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao fazer login'
    sendError(res, message, 401)
  }
}

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, 'Usuário não autenticado', 401)
      return
    }

    const user = await getUserById(req.user.id)

    if (!user) {
      sendError(res, 'Usuário não encontrado', 404)
      return
    }

    sendSuccess(res, user)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar perfil'
    sendError(res, message, 500)
  }
}