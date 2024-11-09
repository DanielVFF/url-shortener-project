  import { ApiProperty } from '@nestjs/swagger';
  import { IsNotEmpty, IsUUID } from 'class-validator';
  
  export class DeleteUrlDto {
  
    @ApiProperty({
      description: 'ID da URL',
      example: 'e5c5a857-9a83-42e9-8f67-19cf1f8a6c6b',
    })
    @IsUUID('4', { message: 'ID da URL inválido' })
    url_id: string;

    @IsNotEmpty()
    @IsUUID('4', { message: 'Usuário inválido, por favor contate o suporte' })
    user_id: string;
  }
  