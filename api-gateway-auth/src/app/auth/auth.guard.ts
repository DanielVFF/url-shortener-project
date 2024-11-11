import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: EnvironmentConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    try {
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
