import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    HelpersService,
    UserRepository,
    JwtService,
  ],
})
export class UsersModule {}
