import { IsOptional, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'Url Original(A ser encurtada)',
    example: 'https://docs.nestjs.com',
  })
  @IsNotEmpty({ message: 'Informe a url original' })
  @IsUrl({},{message :"Tem que ser uma url válida"})
  original_url: string;

  @ApiProperty({
    description: 'Url Curta(Opcional)',
    example: 'nest',
  })
  @IsOptional()
  @MinLength(3, { message: 'Url encurtada deve ter no minimo 3 caracteres' })
  @MaxLength(6, { message: 'Url encurtada deve ter no máximo 6 caracteres' })
  short_url?: string;
}
