import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { IUserRepository } from 'src/interfaces/user_repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
  async getUserById(user_id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { user_id } });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async updateUser(
    user_id: string,
    data: Partial<Prisma.UserUpdateInput>,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { user_id },
      data,
    });
  }

  async deleteUser(user_id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { user_id },
    });
  }
}
