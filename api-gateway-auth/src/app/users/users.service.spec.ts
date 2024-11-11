import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;
  let helpersService: HelpersService;

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
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            getUserById: jest.fn().mockResolvedValue(mockUser),
            createUser: jest.fn().mockResolvedValue(mockUser),
            getUserByEmail: jest.fn().mockResolvedValue(null),
            getAllUsers: jest.fn().mockResolvedValue([mockUser]),
            updateUser: jest.fn().mockResolvedValue(mockUser),
            deleteUser: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: HelpersService,
          useValue: {
            hashPassword: jest.fn().mockResolvedValue('hashed_password'),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    helpersService = module.get<HelpersService>(HelpersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const result = await service.getUserById('12345');
      expect(result).toEqual(mockUser);
      expect(userRepository.getUserById).toHaveBeenCalledWith('12345');
    });
  });

  describe('createUser', () => {
    it('deve criar um novo usuário com senha hash', async () => {
      const createUserDto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };
  
      const result = await service.createUser(createUserDto);
      expect(helpersService.hashPassword).toHaveBeenCalledWith('password');
      expect(result).toEqual(mockUser);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed_password',
      });
    });
  
    it('deve lançar erro se o email já estiver cadastrado', async () => {
      const createUserDto: Prisma.UserCreateInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      };
  
      userRepository.createUser = jest.fn().mockRejectedValue(new Error('Email já cadastrado'));
  
      try {
        await service.createUser(createUserDto);
      } catch (error) {
        expect(error.message).toBe('Email já cadastrado');
        expect(userRepository.createUser).toHaveBeenCalledWith({
          ...createUserDto,
          password: 'hashed_password',
        });
      }
    });
  });
  

  describe('getAllUsers', () => {
    it('deve retornar uma lista de usuários', async () => {
      const result = await service.getAllUsers();
      expect(result).toEqual([mockUser]);
      expect(userRepository.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário com senha hash', async () => {
      const updateUserDto: Partial<Prisma.UserCreateInput> = {
        name: 'Updated User',
        password: 'new_password',
      };

      const result = await service.updateUser('12345', updateUserDto);
      expect(helpersService.hashPassword).toHaveBeenCalledWith('new_password');
      expect(result).toEqual(mockUser);
      expect(userRepository.updateUser).toHaveBeenCalledWith('12345', {
        ...updateUserDto,
        password: 'hashed_password',
      });
    });

    it('deve atualizar um usuário sem modificar a senha se ela não for fornecida', async () => {
      const updateUserDto: Partial<Prisma.UserCreateInput> = {
        name: 'Updated User',
      };

      const result = await service.updateUser('12345', updateUserDto);
      expect(helpersService.hashPassword).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        '12345',
        updateUserDto,
      );
    });
  });

});
