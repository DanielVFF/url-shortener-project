import { Url, Prisma } from '@prisma/client';

export interface IUrlRepository {
  getUrlById(url_id: string): Promise<Url | null>;
  getAllUrls(): Promise<Url[]>;
  createUrl(data: Prisma.UrlCreateInput): Promise<Url>;
  updateUrl(url_id: string, data: Partial<Prisma.UrlUpdateInput>): Promise<Url>;
  deleteUrl(url_id: string): Promise<Url>;
  getUrlByShortUrl(short_url: string): Promise<Url | null>;
  restoreUrl(url_id: string): Promise<Url>;
}
