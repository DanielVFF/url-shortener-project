import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  Matches,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Daniel Vitor',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'O e-mail do usuário',
    example: 'daniel.faria@example.com',
  })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @ApiProperty({
    description: 'A senha do usuário',
    example: 'SenhaSegura123#',
  })
  @IsString()
  @MinLength(12, { message: 'Senha deve ter no mínimo 12 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
    {
      message:
        'Senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Número de telefone do usuário',
    example: '+55 64 99242-3763',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Telefone deve ser válido' })
  phone_number?: string;
}
