import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UrlService } from './url.service';
import { Url, Prisma } from '@prisma/client';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @MessagePattern({ cmd : 'create-url'})
  async createUrl(@Payload() data: Prisma.UrlCreateInput): Promise<Url> {
    return this.urlService.createUrl(data);
  }

  @MessagePattern({ cmd : 'get-url-by-id'})
  async getUrlById(@Payload() url_id: string): Promise<Url | null> {
    return this.urlService.getUrlById(url_id);
  }

  @MessagePattern({ cmd : 'get-all-urls'})
  async getAllUrls(): Promise<Url[]> {
    return this.urlService.getAllUrls();
  }

  @MessagePattern({ cmd : 'update-url'})
  async updateUrl(@Payload() { url_id, data }: { url_id: string; data: Partial<Prisma.UrlUpdateInput> }): Promise<Url> {
    return this.urlService.updateUrl(url_id, data);
  }

  @MessagePattern({ cmd : 'delete-url'})
  async deleteUrl(@Payload() url_id: string): Promise<Url> {
    return this.urlService.deleteUrl(url_id);
  }

  @MessagePattern({ cmd : 'get-url-by-short-url'})
  async getUrlByShortUrl(@Payload() short_url: string): Promise<Url | null> {
    return this.urlService.getUrlByShortUrl(short_url);
  }

  @MessagePattern({ cmd : 'restore-url'})
  async restoreUrl(@Payload() url_id: string): Promise<Url> {
    return this.urlService.restoreUrl(url_id);
  }
}
