import { Injectable } from '@nestjs/common';
import { UrlRepository } from 'src/infrastructure/prisma/repositories/url.repository';
import { Url, Prisma } from '@prisma/client';

@Injectable()
export class UrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  async createUrl(data: Prisma.UrlCreateInput): Promise<Url> {
    return await this.urlRepository.createUrl(data);
  }

  async getUrlById(url_id: string): Promise<Url | null> {
    return await this.urlRepository.getUrlById(url_id);
  }

  async getAllUrls(): Promise<Url[]> {
    return await this.urlRepository.getAllUrls();
  }

  async updateUrl(
    url_id: string,
    data: Partial<Prisma.UrlUpdateInput>,
  ): Promise<Url> {
    return await this.urlRepository.updateUrl(url_id, data);
  }

  async deleteUrl(url_id: string): Promise<Url> {
    return await this.urlRepository.deleteUrl(url_id);
  }

  async getUrlByShortUrl(short_url: string): Promise<Url | null> {
    return await this.urlRepository.getUrlByShortUrl(short_url);
  }

  async restoreUrl(url_id: string): Promise<Url> {
    return await this.urlRepository.restoreUrl(url_id);
  }
}
