import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { UrlModule } from './url/url.module';

@Module({
  imports: [PrismaModule, UrlModule],
  providers: [],
})
export class AppModule {}
