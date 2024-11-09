import { Url, Prisma } from '@prisma/client';

export interface IUrlRepository {
  getUrlByUserId(url_id: string): Promise<Url[] | null>;
  createUrl(data: Prisma.UrlCreateInput): Promise<Url>;
  updateUrl(url_id: string, data: Partial<Prisma.UrlUpdateInput>): Promise<Url>;
  deleteUrl(data : { url_id: string, user_id : string}): Promise<Url>;
  getUrlByShortUrl(short_url: string): Promise<Url | null>;
  restoreUrl(url_id: string): Promise<Url>;
}
