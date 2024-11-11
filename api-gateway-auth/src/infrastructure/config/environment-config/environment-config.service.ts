import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigInterface } from 'src/interfaces/enviroment-config.interface';

@Injectable()
export class EnvironmentConfigService implements EnvironmentConfigInterface {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    const dbHost = this.configService.get<string>('DATABASE_HOST');
    if (!dbHost) {
      throw new Error('DATABASE_HOST não está definido no .env');
    }
    return dbHost;
  }

  getSecretKey(): string {
    const secretKey = this.configService.get<string>('SECRET_KEY');
    if (!secretKey) {
      throw new Error('SECRET_KEY não está definido no .env');
    }
    return secretKey;
  }

  getRabbitMqUrl(): string {
    const rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL');
    if (!rabbitMqUrl) {
      throw new Error('RABBITMQ_URL não está definido no .env');
    }
    return rabbitMqUrl;
  }

  getRabbitMqQueue(): string {
    const rabbitMqQueue = this.configService.get<string>('RABBITMQ_QUEUE');
    if (!rabbitMqQueue) {
      throw new Error('RABBITMQ_QUEUE não está definido no .env');
    }
    return rabbitMqQueue;
  }
}
