import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { UrlModule } from './url/url.module';

@Module({
  imports: [PrismaModule, UrlModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
