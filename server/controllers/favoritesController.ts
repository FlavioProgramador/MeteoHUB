import { Response } from 'express'
import { AuthenticatedRequest, FavoriteCityInput } from '../types/index.js'
import prisma from '../utils/prisma.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getFavorites = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, 'Usuário não autenticado', 401)
      return
    }

    const favorites = await prisma.favoriteCity.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })

    sendSuccess(res, favorites)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar favoritos'
    sendError(res, message, 500)
  }
}

export const addFavorite = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, 'Usuário não autenticado', 401)
      return
    }

    const { cityId, cityName, country, lat, lon } = req.body as FavoriteCityInput

    if (!cityId || !cityName || lat === undefined || lon === undefined) {
      sendError(res, 'Dados da cidade incompletos', 400)
      return
    }

    const existing = await prisma.favoriteCity.findUnique({
      where: {
        userId_cityId: {
          userId: req.user.id,
          cityId,
        },
      },
    })

    if (existing) {
      sendError(res, 'Cidade já está nos favoritos', 400)
      return
    }

    const favorite = await prisma.favoriteCity.create({
      data: {
        userId: req.user.id,
        cityId,
        cityName,
        country,
        lat,
        lon,
      },
    })

    sendSuccess(res, favorite, 'Cidade adicionada aos favoritos', 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao adicionar favorito'
    sendError(res, message, 500)
  }
}

export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendError(res, 'Usuário não autenticado', 401)
      return
    }

    const cityId = req.params.cityId as string

    await prisma.favoriteCity.delete({
      where: {
        userId_cityId: {
          userId: req.user.id,
          cityId,
        },
      },
    })

    sendSuccess(res, null, 'Cidade removida dos favoritos')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao remover favorito'
    sendError(res, message, 500)
  }
}