import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest } from '../types/index.js'
import { sendError } from '../utils/response.js'

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'Token não fornecido', 401)
      return
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET

    if (!secret) {
      sendError(res, 'Configuração do servidor inválida', 500)
      return
    }

    const decoded = jwt.verify(token, secret) as { id: string; email: string }
    req.user = { id: decoded.id, email: decoded.email }
    next()
  } catch {
    sendError(res, 'Token inválido ou expirado', 401)
  }
}