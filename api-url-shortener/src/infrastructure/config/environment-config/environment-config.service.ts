import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigInterface } from 'src/interfaces/enviroment-config.interface';

@Injectable()
export class EnvironmentConfigService implements EnvironmentConfigInterface {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    const dbHost = this.configService.get<string>('DATABASE_HOST');
    if (!dbHost) {
      throw new Error('DATABASE_HOST is not defined in environment variables');
    }
    return dbHost;
  }

  getRabbitMqUrl(): string {
    const rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL');
    if (!rabbitMqUrl) {
      throw new Error('RABBITMQ_URL is not defined in environment variables');
    }
    return rabbitMqUrl;
  }

  getRabbitMqQueue(): string {
    const rabbitMqQueue = this.configService.get<string>('RABBITMQ_QUEUE');
    if (!rabbitMqQueue) {
      throw new Error('RABBITMQ_QUEUE is not defined in environment variables');
    }
    return rabbitMqQueue;
  }
}
