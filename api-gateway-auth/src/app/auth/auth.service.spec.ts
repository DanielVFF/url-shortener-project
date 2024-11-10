import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../users/dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let helpersService: HelpersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserRepository = {
      getUserByEmail: jest.fn(),
    };
    const mockHelpersService = {
      comparePassword: jest.fn(),
    };
    const mockJwtService = {
      sign: jest.fn(),
      decode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: HelpersService, useValue: mockHelpersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    helpersService = module.get<HelpersService>(HelpersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve ser definido', () => {
    expect(authService).toBeDefined();
  });

  describe('authenticateUser', () => {
    it('deve retornar um token JWT quando as credenciais forem válidas', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'validpassword',
      };
      const mockUser = {
        email: 'user@example.com',
        password: 'hashedpassword',
        id: '123',
      };
      const mockToken = 'jwt-token';

      userRepository.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
      helpersService.comparePassword = jest.fn().mockResolvedValue(true);
      jwtService.sign = jest.fn().mockReturnValue(mockToken);

      const result = await authService.authenticateUser(loginDto);
      expect(result).toEqual({
        message: 'Autenticação realizada com sucesso!',
        access_token: mockToken,
      });
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(helpersService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith(mockUser);
    });

    it('deve lançar UnauthorizedException quando o usuário não for encontrado', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'validpassword',
      };

      userRepository.getUserByEmail = jest.fn().mockResolvedValue(null);

      try {
        await authService.authenticateUser(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response.message).toBe('Credenciais Inválidas');
      }
    });

    it('deve lançar UnauthorizedException quando a senha for inválida', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };
      const mockUser = {
        email: 'user@example.com',
        password: 'hashedpassword',
        id: '123',
      };

      userRepository.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
      helpersService.comparePassword = jest.fn().mockResolvedValue(false);

      try {
        await authService.authenticateUser(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response.message).toBe('Credenciais Inválidas');
      }
    });
  });

  describe('authDealing', () => {
    it('deve retornar o user_id quando o token for válido', () => {
      const mockToken = 'valid-jwt-token';
      const mockDecodedToken = { user_id: '123' };
      const authHeader = `Bearer ${mockToken}`;

      jwtService.decode = jest.fn().mockReturnValue(mockDecodedToken);

      const result = authService.authDealing(authHeader);
      expect(result).toBe('123');
      expect(jwtService.decode).toHaveBeenCalledWith(mockToken, { json: true });
    });

    it('deve lançar UnauthorizedException quando o token for inválido', () => {
      const authHeader = 'Bearer invalid-token';

      jwtService.decode = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      try {
        authService.authDealing(authHeader);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response.message).toBe('Credenciais Inválidas');
      }
    });

    it('deve lançar UnauthorizedException quando o token não contiver user_id', () => {
      const mockToken = 'valid-jwt-token';
      const authHeader = `Bearer ${mockToken}`;

      jwtService.decode = jest.fn().mockReturnValue({});

      try {
        authService.authDealing(authHeader);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response.message).toBe('Credenciais Inválidas');
      }
    });
  });
});
