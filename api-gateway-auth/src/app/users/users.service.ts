import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helpersService: HelpersService,
  ) {}

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.getUserById(userId);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.userRepository.getUserByEmail(data?.email);
    if (user) {
      throw new ConflictException('Email já cadastrado');
    }
    data.password = await this.helpersService.hashPassword(data.password);
    return this.userRepository.createUser(data);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async updateUser(
    userId: string,
    updateData: Partial<Prisma.UserCreateInput>,
  ): Promise<User> {
    if (updateData?.email) {
      const user = await this.userRepository.getUserByEmail(updateData?.email);
      if (user) {
        throw new ConflictException('Email já cadastrado');
      }
    }
    if (updateData?.password) {
      updateData.password = await this.helpersService.hashPassword(
        updateData.password,
      );
    }
    return this.userRepository.updateUser(userId, updateData);
  }

  async deleteUser(userId: string): Promise<User> {
    return this.userRepository.deleteUser(userId);
  }
}
