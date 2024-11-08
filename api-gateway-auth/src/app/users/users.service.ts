import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository : UserRepository) {}

  async getUserById(user_id: string): Promise<User | null> {
    return await this.userRepository.getUserById(user_id);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.userRepository.createUser(data);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async updateUser(
    user_id: string,
    data: Partial<Prisma.UserCreateInput>,
  ): Promise<User> {
    return await this.userRepository.updateUser(user_id,data);
  }

  async deleteUser(user_id: string): Promise<User> {
    return await this.userRepository.deleteUser(user_id);
  }
}