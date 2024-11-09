import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { EnvironmentConfigModule } from '../infrastructure/config/environment-config/environment-config.module';
import { AuthModule } from './auth/auth.module';
import { RabbitMQModule } from 'src/infrastructure/rabbitmq/rabbitmq.module';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    EnvironmentConfigModule,
    AuthModule,
    ClientsModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
