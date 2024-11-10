import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { AuthService } from 'src/app/auth/auth.service';
import { HelpersService } from '../helpers/helpers.service';
import { UserRepository } from '../prisma/repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RabbitmqService } from './rabbitmq.service';

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
  providers: [
    HelpersService,
    JwtService,
    PrismaService,
    UserRepository,
    AuthService,
    RabbitmqService,
  ],
})
export class RabbitMQModule {}
