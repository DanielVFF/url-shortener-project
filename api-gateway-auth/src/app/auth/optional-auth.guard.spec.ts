import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { OptionalJwtAuthGuard } from './optional-auth.guard';

describe('OptionalJwtAuthGuard', () => {
  let guard: OptionalJwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockJwtService = {
      verify: jest.fn(),
    };

    const mockConfigService = {
      getSecretKey: jest.fn().mockReturnValue('secret-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptionalJwtAuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: EnvironmentConfigService, useValue: mockConfigService },
      ],
    }).compile();

    guard = module.get<OptionalJwtAuthGuard>(OptionalJwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve ser definido', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('deve permitir o acesso quando não houver cabeçalho de autorização', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as unknown as ExecutionContext;

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('deve permitir o acesso quando o cabeçalho de autorização for válido', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer valid-token' },
          }),
        }),
      } as unknown as ExecutionContext;

      jwtService.verify = jest.fn().mockReturnValue({ userId: '123' });

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('deve lançar UnauthorizedException quando o cabeçalho de autorização for inválido', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer invalid-token' },
          }),
        }),
      } as unknown as ExecutionContext;

      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      try {
        await guard.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response.message).toBe('Credenciais inválidas');
      }
    });
  });
});
