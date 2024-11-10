import { Test, TestingModule } from '@nestjs/testing';
import { HelpersService } from './helpers.service';

describe('HelpersService', () => {
  let service: HelpersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpersService],
    }).compile();

    service = module.get<HelpersService>(HelpersService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('generateUrl', () => {
    it('deve gerar uma URL com o comprimento padrão de 6 caracteres', () => {
      const url = service.generateUrl();
      expect(url).toHaveLength(6);
    });

    it('deve gerar uma URL com o comprimento especificado', () => {
      const length = 10;
      const url = service.generateUrl(length);
      expect(url).toHaveLength(length);
    });

    it('deve gerar uma URL contendo apenas caracteres válidos', () => {
      const url = service.generateUrl();
      const validCharacters = /^[A-Za-z0-9]+$/;
      expect(validCharacters.test(url)).toBe(true);
    });

    it('deve gerar URLs diferentes em chamadas consecutivas', () => {
      const url1 = service.generateUrl();
      const url2 = service.generateUrl();
      expect(url1).not.toEqual(url2);
    });
  });
});
