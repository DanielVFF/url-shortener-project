import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentConfigService } from './environment-config.service';
import { ConfigService } from '@nestjs/config';

describe('EnvironmentConfigService', () => {
  let service: EnvironmentConfigService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          DATABASE_HOST: 'localhost',
          SECRET_KEY: 'my-secret-key',
          RABBITMQ_URL: 'amqp://localhost',
          RABBITMQ_QUEUE: 'my-queue',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentConfigService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EnvironmentConfigService>(EnvironmentConfigService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('getDatabaseHost', () => {
    it('deve retornar o host do banco de dados', () => {
      const result = service.getDatabaseHost();
      expect(result).toBe('localhost');
    });
  });

  describe('getRabbitMqUrl', () => {
    it('deve retornar a URL do RabbitMQ', () => {
      const result = service.getRabbitMqUrl();
      expect(result).toBe('amqp://localhost');
    });
  });

  describe('getRabbitMqQueue', () => {
    it('deve retornar a fila do RabbitMQ', () => {
      const result = service.getRabbitMqQueue();
      expect(result).toBe('my-queue');
    });
  });
});
