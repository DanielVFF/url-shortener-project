import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigInterface } from 'src/interfaces/enviroment-config.interface';

@Injectable()
export class EnvironmentConfigService implements EnvironmentConfigInterface {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getSecretKey(): string {
    return this.configService.get<string>('SECRET_KEY');
  }

  getRabbitMqUrl(): string {
    return this.configService.get<string>('RABBITMQ_URL');
  }

  getRabbitMqQueue(): string {
    return this.configService.get<string>('RABBITMQ_QUEUE');
  }
}
