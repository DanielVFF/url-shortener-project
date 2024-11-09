import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { UrlRepository } from 'src/infrastructure/prisma/repositories/url.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [UrlController],
  providers: [UrlService, PrismaService,UrlRepository],
  exports: [UrlService]
})
export class UrlModule {}
