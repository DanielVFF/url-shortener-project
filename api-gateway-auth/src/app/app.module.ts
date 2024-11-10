import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { EnvironmentConfigModule } from '../infrastructure/config/environment-config/environment-config.module';
import { AuthModule } from './auth/auth.module';
import { RabbitMQModule } from 'src/infrastructure/rabbitmq/rabbitmq.module';
import { ClientsModule } from '@nestjs/microservices';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    EnvironmentConfigModule,
    AuthModule,
    ClientsModule,
    RabbitMQModule,
    UrlModule,
  ],
})
export class AppModule {}
