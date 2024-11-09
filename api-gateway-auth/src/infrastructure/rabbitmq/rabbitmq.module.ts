import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { RabbitmqController } from './rabbitmq.controller';

@Module({
  imports: [
    EnvironmentConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [EnvironmentConfigModule],
        useFactory: async (configService: EnvironmentConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getRabbitMqUrl()],
            queue: configService.getRabbitMqQueue(),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [EnvironmentConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
  controllers: [RabbitmqController],
})
export class RabbitMQModule {}
