import { IsOptional, MinLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'Url Original(A ser encurtada)',
    example: 'https://docs.nestjs.com',
  })
  @IsNotEmpty({ message: 'Informe a url original' })
  original_url: string;

  @ApiProperty({
    description: 'Url Original(A ser encurtada)',
    example: 'https://docs.nestjs.com',
  })
  @IsOptional()
  @MinLength(3, { message: 'Url encurtada deve ter no minimo 3 caracteres' })
  @MaxLength(6, { message: 'Url encurtada deve ter no máximo 6 caracteres' })
  short_url?: string;
}
