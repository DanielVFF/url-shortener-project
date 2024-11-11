import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  const mockUser: User = {
    user_id: '12345',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(mockUser),
              findMany: jest.fn().mockResolvedValue([mockUser]),
              create: jest.fn().mockResolvedValue(mockUser),
              update: jest.fn().mockResolvedValue(mockUser),
              delete: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve estar definido', () => {
    expect(repository).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('deve retornar um usuário pelo email', async () => {
      const result = await repository.getUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const result = await repository.getUserById('12345');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: '12345' },
      });
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar uma lista de usuários', async () => {
      const result = await repository.getAllUsers();
      expect(result).toEqual([mockUser]);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('deve criar um novo usuário', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashed_password',
      };

      const result = await repository.createUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: createUserDto });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário pelo ID', async () => {
      const updateData = { name: 'Updated User' };

      const result = await repository.updateUser('12345', updateData);
      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { user_id: '12345' },
        data: updateData,
      });
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário pelo ID', async () => {
      const result = await repository.deleteUser('12345');
      expect(result).toEqual(mockUser);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { user_id: '12345' },
      });
    });
  });
});
