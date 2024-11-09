import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService : EnvironmentConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getSecretKey(),  
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
