import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Url, Prisma } from '@prisma/client';
import { IUrlRepository } from 'src/interfaces/url_repository.interface';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(private prisma: PrismaService) {}

  async getUrlByUserId(user_id: string): Promise<Url[] | []> {
    return await this.prisma.url.findMany({ where: { user_id } });
  }
  async createUrl(data: Prisma.UrlCreateInput): Promise<Url> {
    return await this.prisma.url.create({ data });
  }

  async updateUrl(
    url_id: string,
    data: Partial<Prisma.UrlUpdateInput>,
  ): Promise<Url> {
    return await this.prisma.url.update({
      where: { url_id },
      data,
    });
  }

  async deleteUrl(data: { url_id: string; user_id: string }): Promise<Url> {
    return await this.prisma.url.update({
      where: data,
      data: {
        deleted_at: new Date(),
        status: 0,
      },
    });
  }

  async getUrlByShortUrl(short_url: string): Promise<Url | null> {
    return await this.prisma.url.findUnique({
      where: { short_url, status: 1 },
    });
  }

  async getUrlById(url_id: string): Promise<Url | null> {
    return await this.prisma.url.findUnique({
      where: { url_id },
    });
  }
}
