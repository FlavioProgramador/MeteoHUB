import { Response } from "express"
import { AuthenticatedRequest, FavoriteCityInput } from "../types/index.js"
import { favoriteCityRepository } from "../repositories/favoriteCityRepository.js"
import { sendSuccess, sendError } from "../utils/response.js"

export const getFavorites = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.id) {
    sendError(res, "Usuário não autenticado", 401)
    return
  }

  try {
    const favorites = await favoriteCityRepository.findAllByUserId(req.user.id)
    sendSuccess(res, favorites)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar favoritos"
    sendError(res, message, 500)
  }
}

export const addFavorite = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.id) {
    sendError(res, "Usuário não autenticado", 401)
    return
  }

  const { cityId, cityName, country, lat, lon } = req.body as FavoriteCityInput

  if (!cityId || !cityName || lat === undefined || lon === undefined) {
    sendError(res, "Dados da cidade incompletos", 400)
    return
  }

  try {
    const existing = await favoriteCityRepository.findByIds(req.user.id, cityId)

    if (existing) {
      sendError(res, "Cidade já está nos favoritos", 400)
      return
    }

    const favorite = await favoriteCityRepository.create(req.user.id, {
      cityId,
      cityName,
      country,
      lat,
      lon,
    })

    sendSuccess(res, favorite, "Cidade adicionada aos favoritos", 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao adicionar favorito"
    sendError(res, message, 500)
  }
}

export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.id) {
    sendError(res, "Usuário não autenticado", 401)
    return
  }

  try {
    await favoriteCityRepository.deleteByIds(req.user.id, req.params.cityId as string)
    sendSuccess(res, null, "Cidade removida dos favoritos")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao remover favorito"
    sendError(res, message, 500)
  }
}
