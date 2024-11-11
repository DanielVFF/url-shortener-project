import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

/**
 * Guarda de autenticação JWT opcional para proteger rotas onde a autenticação não é obrigatória.
 * 
 * @remarks Esse guard permite o acesso à rota mesmo que o token JWT não esteja presente,
 * mas realiza a validação do token se ele for fornecido. Ideal para rotas públicas que aceitam usuários autenticados e não autenticados.
 */
@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  /**
   * Injeta as dependências JwtService e EnvironmentConfigService.
   * 
   * @param {JwtService} jwtService - Serviço para manipulação de tokens JWT.
   * @param {EnvironmentConfigService} configService - Serviço para acessar a chave secreta JWT.
   */
  constructor(
    private jwtService: JwtService,
    private configService: EnvironmentConfigService,
  ) {}

  /**
   * Verifica o cabeçalho de autorização e valida o token JWT, se presente.
   *
   * @param {ExecutionContext} context - O contexto de execução, que permite acesso aos objetos de requisição e resposta.
   * @returns {Promise<boolean>} Retorna `true` se o token for válido ou se não houver token; caso contrário, lança uma exceção.
   * @throws {UnauthorizedException} Lança uma exceção se o token estiver presente mas for inválido.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return true;

    try {
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.getSecretKey(),
      });
      request.user = decoded;

      return true;
    } catch (_e) {
      console.error(_e);
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
