import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

const mockClientProxy = {
  connect: jest.fn(),
  send: jest.fn(),
};

describe('RabbitmqService', () => {
  let rabbitmqService: RabbitmqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqService,
        { provide: 'RABBITMQ_SERVICE', useValue: mockClientProxy },
      ],
    }).compile();

    rabbitmqService = module.get<RabbitmqService>(RabbitmqService);
  });

  it('deve ser definido', () => {
    expect(rabbitmqService).toBeDefined();
  });

  it('deve se conectar ao cliente ao inicializar', async () => {
    await rabbitmqService.onModuleInit();
    expect(mockClientProxy.connect).toHaveBeenCalled();
  });

  it('deve enviar a mensagem com sucesso e retornar a resposta', async () => {
    const mockResponse = { statusCode: 200, message: 'Sucesso' };
    mockClientProxy.send.mockReturnValue(of(mockResponse));

    const response = await rabbitmqService.sendMessage(
      'test.command',
      { data: 'test' },
      'user123',
    );

    expect(mockClientProxy.send).toHaveBeenCalledWith(
      { cmd: 'test.command' },
      { data: 'test', user_id: 'user123' },
    );
    expect(response).toEqual(mockResponse);
  });

  it('deve lançar HttpException quando a resposta for diferente de sucesso', async () => {
    const mockResponse = { statusCode: 500, message: 'Erro interno' };
    mockClientProxy.send.mockReturnValue(of(mockResponse));

    try {
      await rabbitmqService.sendMessage(
        'test.command',
        { data: 'test' },
        'user123',
      );
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Erro interno');
      expect(error.getStatus()).toBe(500);
    }
  });

  it('deve lançar erro de timeout', async () => {
    mockClientProxy.send.mockReturnValue(
      throwError(() => new Error('timeout')),
    );

    try {
      await rabbitmqService.sendMessage(
        'test.command',
        { data: 'test' },
        'user123',
        1000,
      );
    } catch (error) {
      expect(error.message).toBe('falha ao enviar a mensagem');
    }
  });

  it('deve tentar reenviar a mensagem quando ocorrer falha e falhar após o número de tentativas', async () => {
    mockClientProxy.send
      .mockReturnValueOnce(throwError(() => new Error('erro')))
      .mockReturnValueOnce(throwError(() => new Error('erro')));

    try {
      await rabbitmqService.sendMessage(
        'test.command',
        { data: 'test' },
        'user123',
        5000,
        2,
      ); // 2 tentativas
    } catch (error) {
      expect(error.message).toBe('falha ao enviar a mensagem');
      expect(mockClientProxy.send).toHaveBeenCalledTimes(4); // 1 tentativa inicial + 3 tentativas(2 e o retry)
    }
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
