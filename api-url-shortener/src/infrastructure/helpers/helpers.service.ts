import { Injectable } from '@nestjs/common';

/**
 * Serviço de utilidades que oferece funções auxiliares para o projeto.
 */
@Injectable()
export class HelpersService {
  /**
   * Gera uma URL encurtada com um comprimento especificado.
   * 
   * A URL gerada é composta por caracteres alfanuméricos aleatórios (maiúsculas, minúsculas e números).
   * O comprimento da URL pode ser configurado pelo parâmetro `length`, sendo 6 por padrão.
   * 
   * @param length - O comprimento da URL gerada (padrão é 6).
   * @returns Uma string contendo a URL gerada.
   */
  generateUrl(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ''; 
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result; // Retornando a URL gerada
  }
}
