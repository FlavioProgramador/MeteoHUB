import { Response } from 'express'
import { AuthenticatedRequest } from '../types/index.js'
import prisma from '../utils/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, 'Usuário não autenticado', 401)
      return
    }

    const limit = parseInt(req.query.limit as string) || 10

    const history = await prisma.searchHistory.findMany({
      where: { userId: req.user.id },
      orderBy: { searchedAt: 'desc' },
      take: limit,
    })

    sendSuccess(res, history)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar histórico'
    sendError(res, message, 500)
  }
}

export const addToHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, 'Usuário não autenticado', 401)
      return
    }

    const { cityId, cityName, country, lat, lon } = req.body

    if (!cityId || !cityName || lat === undefined || lon === undefined) {
      sendError(res, 'Dados da cidade incompletos', 400)
      return
    }

    const historyEntry = await prisma.searchHistory.create({
      data: {
        userId: req.user.id,
        cityId,
        cityName,
        country,
        lat,
        lon,
      },
    })

    sendSuccess(res, historyEntry, 'Busca adicionada ao histórico', 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao adicionar ao histórico'
    sendError(res, message, 500)
  }
}

export const clearHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, 'Usuário não autenticado', 401)
      return
    }

    await prisma.searchHistory.deleteMany({
      where: { userId: req.user.id },
    })

    sendSuccess(res, null, 'Histórico limpo com sucesso')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao limpar histórico'
    sendError(res, message, 500)
  }
}