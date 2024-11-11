import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

/**
 * Estratégia JWT para autenticação com Passport.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Configura a estratégia JWT.
   * 
   * @param {EnvironmentConfigService} configService - Serviço para acessar a chave secreta JWT.
   */
  constructor(configService: EnvironmentConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getSecretKey(),
    });
  }

  /**
   * Valida o payload JWT extraído do token e retorna um objeto de usuário.
   *
   * @param {{ sub: string, username: string }} payload - O payload extraído do token JWT, contendo o ID e o nome de usuário.
   * @returns {{ userId: string, username: string }} Um objeto contendo o ID e o nome de usuário do usuário autenticado.
   */
  async validate(payload: { sub: string; username: string }): Promise<{ userId: string; username: string; }> {
    return { userId: payload.sub, username: payload.username };
  }
}
