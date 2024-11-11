import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../users/dto/login.dto';
import { AuthService } from './auth.service';
import { LoginResponseInterface } from 'src/interfaces/responses/login_response.interface';

/**
 * Controlador para operações de autenticação.
 */
@Controller('auth')
export class AuthController {
  /**
   * Injeta o serviço de autenticação.
   * @param {AuthService} authService - O serviço de autenticação.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Rota para autenticação de usuário.
   *
   * @param {LoginDto} data - Dados de login do usuário.
   * @returns {Promise<LoginResponseInterface>} O resultado da autenticação, incluindo token JWT em caso de sucesso.
   *
   * @remarks Retorna status 200 em caso de sucesso ou 401 se as credenciais forem inválidas.
   */
  @Post('/login')
  @ApiOperation({ summary: 'Login com seu usuário' })
  @ApiResponse({ status: 200, description: 'Logado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @HttpCode(200)
  async login(@Body() data: LoginDto): Promise<LoginResponseInterface> {
    return this.authService.authenticateUser(data);
  }
}
