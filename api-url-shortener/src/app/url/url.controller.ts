import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UrlService } from './url.service';
import { Url } from '@prisma/client';
import { CreateUrlInterface } from 'src/interfaces/url/create-url.interface';
import { SearchByUserUrlInteface } from 'src/interfaces/url/search-by-user-url.interface';
import { UpdateUrlInterface } from 'src/interfaces/url/update-url.interface';
import { SearchByShortUrlInteface } from 'src/interfaces/url/search-by-short-url.interface';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @MessagePattern({ cmd: 'create-url' })
  async createUrl(@Payload() data: CreateUrlInterface): Promise<Url> {
    return this.urlService.createUrl(data);
  }

  @MessagePattern({ cmd: 'get-url-by-user_id' })
  async getUrlById(@Payload() data: SearchByUserUrlInteface): Promise<Url[] | null> {
    return this.urlService.getUrlByUserId(data.user_id);
  }

  @MessagePattern({ cmd: 'update-url' })
  async updateUrl(@Payload() data: UpdateUrlInterface): Promise<Url> {
    return this.urlService.updateUrl(data.url_id, data);
  }

  @MessagePattern({ cmd: 'delete-url' })
  async deleteUrl(@Payload() data: {url_id : string} & SearchByUserUrlInteface): Promise<Url> {
    return this.urlService.deleteUrl({ url_id: data.url_id, user_id : data.user_id});
  }

  @MessagePattern({ cmd: 'get-url-by-short-url' })
  async getUrlByShortUrl(@Payload() data: SearchByShortUrlInteface): Promise<Url | null> {
    return this.urlService.getUrlByShortUrl(data.short_url);
  }

}
