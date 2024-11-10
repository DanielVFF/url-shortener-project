import { Test, TestingModule } from '@nestjs/testing';
import { HelpersService } from './helpers.service';
import * as bcrypt from 'bcryptjs';

describe('HelpersService', () => {
  let service: HelpersService;
  const password = 'myPassword';
  let hash: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpersService],
    }).compile();

    service = module.get<HelpersService>(HelpersService);

    hash = await bcrypt.hash(password, 10);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('deve gerar um hash de senha', async () => {
      const hashedPassword = await service.hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });
  });

  describe('comparePassword', () => {
    it('deve retornar true quando a senha e o hash forem correspondentes', async () => {
      const isMatch = await service.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('deve retornar false quando a senha e o hash não forem correspondentes', async () => {
      const isMatch = await service.comparePassword('wrongPassword', hash);
      expect(isMatch).toBe(false);
    });
  });
});
