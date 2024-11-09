import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, HelpersService, UserRepository],
})
export class UsersModule {}
