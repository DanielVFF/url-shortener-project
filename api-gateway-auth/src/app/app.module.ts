import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { EnvironmentConfigModule } from '../infrastructure/config/environment-config/environment-config.module';

@Module({
  imports: [UsersModule, PrismaModule, EnvironmentConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
