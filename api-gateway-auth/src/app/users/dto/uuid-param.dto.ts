import { IsUUID } from 'class-validator';

export class UuidParamDto {
  @IsUUID('4', { message: 'UUID inválido' })
  uuid: string;
}
