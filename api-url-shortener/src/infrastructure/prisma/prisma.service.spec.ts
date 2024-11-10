import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    prismaService.$connect = jest.fn();
  });

  it('deve estar definido', () => {
    expect(prismaService).toBeDefined();
  });

  it('deve chamar $connect ao inicializar o módulo', async () => {
    await prismaService.onModuleInit();
    expect(prismaService.$connect).toHaveBeenCalled();
  });
});
