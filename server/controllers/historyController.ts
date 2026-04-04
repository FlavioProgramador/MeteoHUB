import { Response } from "express"
import { AuthenticatedRequest } from "../types/index.js"
import { searchHistoryRepository } from "../repositories/searchHistoryRepository.js"
import { sendSuccess, sendError } from "../utils/response.js"

export const getHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.id) {
    sendError(res, "Usuário não autenticado", 401)
    return
  }

  try {
    const limit = parseInt(req.query.limit as string) || 10
    const history = await searchHistoryRepository.findAllByUserId(req.user.id, limit)
    sendSuccess(res, history)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar histórico"
    sendError(res, message, 500)
  }
}

export const addToHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.id) {
    sendError(res, "Usuário não autenticado", 401)
    return
  }

  const { cityId, cityName, country, lat, lon } = req.body

  if (!cityId || !cityName || lat === undefined || lon === undefined) {
    sendError(res, "Dados da cidade incompletos", 400)
    return
  }

  try {
    const historyEntry = await searchHistoryRepository.create(req.user.id, {
      cityId,
      cityName,
      country,
      lat,
      lon,
    })

    sendSuccess(res, historyEntry, "Busca adicionada ao histórico", 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao adicionar ao histórico"
    sendError(res, message, 500)
  }
}

export const clearHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.id) {
    sendError(res, "Usuário não autenticado", 401)
    return
  }

  try {
    await searchHistoryRepository.deleteAllByUserId(req.user.id)
    sendSuccess(res, null, "Histórico limpo com sucesso")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao limpar histórico"
    sendError(res, message, 500)
  }
}
