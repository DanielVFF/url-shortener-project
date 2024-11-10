import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';

//Auth Guard para quando a autênticação é opcional, no caso para a rota de post de url
@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: EnvironmentConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) return true;

        try {
            const token = authHeader.split(' ')[1];
            const decoded = this.jwtService.verify(token, { secret: this.configService.getSecretKey() });
            request.user = decoded;

            return true;
        } catch (e) {
            throw new UnauthorizedException("Credenciais inválidas");
        }
    }
}
