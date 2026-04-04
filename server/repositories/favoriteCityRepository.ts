import prisma from "../utils/prisma.js";
import type { FavoriteCityInput } from "../types/index.js";

export class FavoriteCityRepository {
  async findAllByUserId(userId: string) {
    return await prisma.favoriteCity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIds(userId: string, cityId: string) {
    return await prisma.favoriteCity.findUnique({
      where: { userId_cityId: { userId, cityId } },
    });
  }

  async create(userId: string, data: FavoriteCityInput) {
    return await prisma.favoriteCity.create({
      data: { userId, ...data },
    });
  }

  async deleteByIds(userId: string, cityId: string) {
    return await prisma.favoriteCity.delete({
      where: { userId_cityId: { userId, cityId } },
    });
  }
}

export const favoriteCityRepository = new FavoriteCityRepository();
