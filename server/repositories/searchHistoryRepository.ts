import prisma from "../utils/prisma.js";

export class SearchHistoryRepository {
  async findAllByUserId(userId: string, limit: number = 10) {
    return await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { searchedAt: "desc" },
      take: limit,
    });
  }

  async create(userId: string, data: { cityId: string; cityName: string; country?: string | null; lat: number; lon: number }) {
    return await prisma.searchHistory.create({
      data: { userId, ...data },
    });
  }

  async deleteAllByUserId(userId: string) {
    return await prisma.searchHistory.deleteMany({
      where: { userId },
    });
  }
}

export const searchHistoryRepository = new SearchHistoryRepository();
