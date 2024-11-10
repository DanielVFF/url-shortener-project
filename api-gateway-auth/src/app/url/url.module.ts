import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { RabbitmqService } from 'src/infrastructure/rabbitmq/rabbitmq.service';
import { RabbitMQModule } from 'src/infrastructure/rabbitmq/rabbitmq.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  imports: [RabbitMQModule],
  controllers: [UrlController],
  providers: [RabbitmqService, AuthService, JwtService, HelpersService, PrismaService, UserRepository, JwtService],
})
export class UrlModule {}
