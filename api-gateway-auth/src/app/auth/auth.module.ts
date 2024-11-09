import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [
    ConfigModule,
    EnvironmentConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: EnvironmentConfigService) => ({
        secret: configService.getSecretKey(),
        signOptions: { expiresIn: '3h' },
      }),
      inject: [EnvironmentConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, HelpersService, UserRepository, JwtStrategy],
})
export class AuthModule {}
