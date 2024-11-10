import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../users/dto/login.dto';
import { LoginResponseInterface } from 'src/interfaces/responses/login_response.interface';
import { UserRepository } from 'src/infrastructure/prisma/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly helpersService: HelpersService,
    private readonly jwtService: JwtService,
  ) {}

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

  private decodeToken(token: string): { user_id: string } {
    try {
      return this.jwtService.decode(token, { json: true });
    } catch (_e) {
      console.error(_e);
      throw new UnauthorizedException('Credenciais Inválidas');
    }
  }

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
