import { IsUUID } from 'class-validator';

export class UrlIdDto {
  @IsUUID(4)
  url_id: string;
}
