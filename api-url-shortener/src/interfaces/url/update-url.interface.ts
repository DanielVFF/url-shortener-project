import { Prisma } from '@prisma/client';

export interface UpdateUrlInterface {
  url_id: string;
  data: Partial<Prisma.UrlUpdateInput>;
}
