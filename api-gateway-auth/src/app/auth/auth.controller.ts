import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../users/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login com seu usuário' })
  @ApiResponse({ status: 200, description: 'Logado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais invalidas' })
  @HttpCode(200)
  async login(@Body() data: LoginDto) {
    return this.authService.authenticateUser(data);
  }
}
