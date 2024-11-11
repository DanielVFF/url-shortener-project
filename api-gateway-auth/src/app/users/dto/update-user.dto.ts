import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Daniel Vitor',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  name?: string;

  @ApiProperty({
    description: 'O e-mail do usuário',
    example: 'daniel.faria@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser válido' })
  email?: string;

  @ApiProperty({
    description: 'A senha do usuário',
    example: 'senhaSegura123#',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(12, { message: 'Senha deve ter no mínimo 12 caracteres' })
  password?: string;
}
