import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HelpersService {
  /**
   * Gera um hash para a senha fornecida, usando o número especificado de salt rounds.
   * @param password - A senha a ser criptografada.
   * @param saltRounds - Número de salt rounds a serem aplicados na criptografia (padrão: 10).
   * @returns Uma Promise que resolve com o hash gerado.
   */
  async hashPassword(password: string, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compara uma senha em texto simples com um hash para verificar se coincidem.
   * @param password - A senha em texto simples a ser verificada.
   * @param hash - O hash criptografado com o qual a senha deve ser comparada.
   * @returns Uma Promise que resolve com `true` se a senha corresponder ao hash, ou `false` caso contrário.
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
