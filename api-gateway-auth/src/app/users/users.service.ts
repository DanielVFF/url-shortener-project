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

  /**
   * Busca um usuário pelo ID.
   * @param userId - ID do usuário a ser buscado.
   * @returns O usuário correspondente ao ID fornecido ou null, se não encontrado.
   */
  async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.getUserById(userId);
  }

  /**
   * Cria um novo usuário, verificando se o email já está cadastrado.
   * @param data - Dados para criação do usuário.
   * @returns O usuário criado.
   * @throws ConflictException - Se o email já estiver cadastrado.
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.userRepository.getUserByEmail(data?.email);
    if (user) {
      throw new ConflictException('Email já cadastrado');
    }
    data.password = await this.helpersService.hashPassword(data.password);
    return await this.userRepository.createUser(data);
  }

  /**
   * Retorna todos os usuários cadastrados.
   * @returns Uma lista de todos os usuários.
   */
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  /**
   * Atualiza as informações de um usuário específico.
   * @param userId - ID do usuário a ser atualizado.
   * @param updateData - Dados para atualização do usuário.
   * @returns O usuário atualizado.
   * @throws ConflictException - Se o novo email já estiver em uso por outro usuário.
   */
  async updateUser(
    userId: string,
    updateData: Partial<Prisma.UserCreateInput>,
  ): Promise<User> {
    if (updateData?.email) {
      const userByEmail = await this.userRepository.getUserByEmail(
        updateData?.email,
      );
      if (userByEmail) {
        throw new ConflictException('Email já cadastrado');
      }
    }
    if (updateData?.password) {
      updateData.password = await this.helpersService.hashPassword(
        updateData.password,
      );
    }
    return await this.userRepository.updateUser(userId, updateData);
  }

  /**
   * Deleta um usuário pelo ID.
   * @param userId - ID do usuário a ser deletado.
   * @returns O usuário deletado.
   */
  async deleteUser(userId: string): Promise<User> {
    return await this.userRepository.deleteUser(userId);
  }
}
