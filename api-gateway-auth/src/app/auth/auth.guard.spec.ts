import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { JwtAuthGuard } from './auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;
  let configService: EnvironmentConfigService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockConfigService = {
    getSecretKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: EnvironmentConfigService, useValue: mockConfigService },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<EnvironmentConfigService>(EnvironmentConfigService);
  });

  it('deve ser definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve lançar UnauthorizedException se nenhum cabeçalho de autorização for fornecido', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    try {
      await guard.canActivate(mockExecutionContext);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect(e.message).toBe('Credenciais inválidas');
    }
  });

  it('deve lançar UnauthorizedException se o token for inválido', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalidToken' },
        }),
      }),
    } as unknown as ExecutionContext;

    mockJwtService.verify.mockImplementation(() => {
      throw new Error();
    });

    try {
      await guard.canActivate(mockExecutionContext);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect(e.message).toBe('Credenciais inválidas');
    }
  });

  it('deve retornar true se o token for válido', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer validToken' },
        }),
      }),
    } as unknown as ExecutionContext;

    const decodedToken = { userId: 1 };
    mockJwtService.verify.mockReturnValue(decodedToken);
    mockConfigService.getSecretKey.mockReturnValue('test-secret-key');

    const result = await guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });
});
