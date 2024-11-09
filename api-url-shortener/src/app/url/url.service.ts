import { Injectable } from '@nestjs/common';
import { UrlRepository } from 'src/infrastructure/prisma/repositories/url.repository';
import { Url, Prisma } from '@prisma/client';
import { CreateUrlDto } from './dto/create-url.dto';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { DeleteUrlDto } from './dto/delete-url.dto';

@Injectable()
export class UrlService {
  constructor(private readonly urlRepository: UrlRepository, private readonly helperService: HelpersService) {}

  async createUrl(data: CreateUrlDto): Promise<Url> {
    if(!data?.short_url){
      let isUnique : boolean = false;
      let short_url : string;
      while(!isUnique){
        short_url = this.helperService.generateUrl()
        const url = await this.urlRepository.getUrlByShortUrl(short_url);
        if(!url){
          isUnique = true;
        }
      }
      data.short_url = short_url
    }
    return await this.urlRepository.createUrl(data as Prisma.UrlCreateInput );
  }

  async getUrlByUserId(user_id: string): Promise<Url[] | null> {
    return await this.urlRepository.getUrlByUserId(user_id);
  }


  async updateUrl(
    url_id: string,
    data: Partial<Prisma.UrlUpdateInput>,
  ): Promise<Url> {
    return await this.urlRepository.updateUrl(url_id, data);
  }

  async deleteUrl(data : DeleteUrlDto): Promise<Url> {
    return await this.urlRepository.deleteUrl(data);
  }

  async getUrlByShortUrl(short_url: string): Promise<Url | null> {
    const url =  await this.urlRepository.getUrlByShortUrl(short_url);

    await this.urlRepository.updateUrl(url?.url_id,{
      click_count : url?.click_count+1
    })

    return url;
  }
}
