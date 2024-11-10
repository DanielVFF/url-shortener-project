import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('deve ser definido', () => {
    expect(authController).toBeDefined();
  });

  it('deve chamar authenticateUser e retornar 200 para login bem-sucedido', async () => {
    const loginDto: LoginDto = { email: 'user', password: 'password' };
    const mockResponse = {
      access_token: 'fake-jwt-token',
      message: 'Autenticado com sucesso',
    };

    // Simula o comportamento do método authenticateUser para retornar sucesso
    jest.spyOn(authService, 'authenticateUser').mockResolvedValue(mockResponse);

    const result = await authController.login(loginDto);
    expect(result).toEqual(mockResponse);
    expect(authService.authenticateUser).toHaveBeenCalledWith(loginDto);
  });

  it('deve retornar 401 para credenciais inválidas', async () => {
    const loginDto: LoginDto = { email: 'user', password: 'wrongpassword' };

    jest
      .spyOn(authService, 'authenticateUser')
      .mockRejectedValue(new UnauthorizedException('Credenciais inválidas'));

    try {
      await authController.login(loginDto);
    } catch (error) {
      expect(error.response.statusCode).toBe(401);
      expect(error.response.message).toBe('Credenciais inválidas');
    }
  });
});
