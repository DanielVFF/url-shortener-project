import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mockToken') },
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
        {
          provide: HelpersService,
          useValue: {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
          },
        },
        {
          provide: EnvironmentConfigService,
          useValue: {
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('deve retornar uma lista de usuários', async () => {
      jest.spyOn(service, 'getAllUsers').mockResolvedValue([mockUser]);
      const result = await controller.getAllUsers();
      expect(result).toEqual([mockUser]);
      expect(service.getAllUsers).toHaveBeenCalled();
    });
  });
});
