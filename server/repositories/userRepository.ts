import prisma from "../utils/prisma.js";

export class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: any) {
    return await prisma.user.create({ data });
  }
}

export const userRepository = new UserRepository();
