import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../users/dto/login.dto';
import { LoginResponseInterface } from 'src/interfaces/responses/login_response.interface';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';

/**
 * Serviço de autenticação responsável pela autenticação de usuários.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helpersService: HelpersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Autentica o usuário com base nas credenciais fornecidas.
   * @param loginData Dados de login fornecidos pelo usuário.
   * @returns Um objeto com a mensagem de sucesso e o token de acesso gerado.
   * @throws UnauthorizedException Se as credenciais forem inválidas.
   */
  async authenticateUser(loginData: LoginDto): Promise<LoginResponseInterface> {
    const user = await this.userRepository.getUserByEmail(loginData.email);
    if (!user) throw new UnauthorizedException('Credenciais Inválidas');

    const isPasswordValid = await this.helpersService.comparePassword(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciais Inválidas');

    const accessToken = this.jwtService.sign(user);

    return {
      message: 'Autenticação realizada com sucesso!',
      access_token: accessToken,
    };
  }

  /**
   * Decodifica o token JWT e retorna as informações decodificadas.
   * @param token O token JWT a ser decodificado.
   * @returns Um objeto com os dados decodificados do token.
   * @throws UnauthorizedException Se ocorrer um erro ao decodificar o token.
   */
  private decodeToken(token: string): { user_id: string } {
    try {
      return this.jwtService.decode(token, { json: true });
    } catch (_e) {
      console.error(_e);
      throw new UnauthorizedException('Credenciais Inválidas');
    }
  }

  /**
   * Processa o cabeçalho de autorização para extrair o token e validar o usuário.
   * @param authHeader Cabeçalho de autorização contendo o token JWT.
   * @returns O ID do usuário extraído do token.
   * @throws UnauthorizedException Se o token for inválido ou o usuário não for encontrado.
   */
  public authDealing(authHeader: string): string {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    const decoded = this.decodeToken(token);
    const userId = decoded?.user_id;

    if (!userId) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }

    return userId;
  }
}
