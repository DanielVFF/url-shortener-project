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
    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await this.helpersService.comparePassword(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException();

    const accessToken = this.jwtService.sign(user);

    return {
      message: 'Autenticação realizada com sucesso!',
      access_token: accessToken,
    };
  }
}
