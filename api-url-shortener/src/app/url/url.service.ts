import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlRepository } from 'src/infrastructure/prisma/repositories/url.repository';
import { Url, Prisma } from '@prisma/client';
import { HelpersService } from 'src/infrastructure/helpers/helpers.service';
import { CreateUrlInterface } from 'src/interfaces/url/create-url.interface';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly helperService: HelpersService,
  ) {}

  /**
   * Cria uma nova URL encurtada.
   * Caso o `short_url` não seja fornecido, gera automaticamente uma URL única.
   * @param data - Dados para criação da URL.
   * @returns A URL criada.
   * @throws ConflictException - Caso o `short_url` já exista.
   */
  async createUrl(data: CreateUrlInterface): Promise<Url> {
    if (!data?.short_url) {
      let isUnique: boolean = false;
      let short_url: string;
      while (!isUnique) {
        short_url = this.helperService.generateUrl();
        const url = await this.urlRepository.getUrlByShortUrl(short_url);
        if (!url) {
          isUnique = true;
        }
      }
      data.short_url = short_url;
    } else {
      const url = await this.urlRepository.getUrlByShortUrl(data?.short_url);
      if (url) {
        throw new ConflictException(
          'Url encurtada já existe, escreve uma nova ou deixe ser gerada automaticamente',
        );
      }
    }
    return await this.urlRepository.createUrl(data as Prisma.UrlCreateInput);
  }

  /**
   * Busca todas as URLs associadas a um usuário pelo ID do usuário.
   * @param user_id - ID do usuário para realizar a busca.
   * @returns Uma lista de URLs associadas ao usuário ou null, se nenhuma for encontrada.
   */
  async getUrlByUserId(user_id: string): Promise<Url[] | null> {
    return await this.urlRepository.getUrlByUserId(user_id);
  }

  /**
   * Atualiza as informações de uma URL específica.
   * @param url_id - ID da URL a ser atualizada.
   * @param data - Dados para atualizar a URL.
   * @returns A URL atualizada.
   * @throws NotFoundException - Caso a URL não seja encontrada.
   */
  async updateUrl(
    url_id: string,
    data: Partial<Prisma.UrlUpdateInput>,
  ): Promise<Url> {
    const url = await this.urlRepository.getUrlById(url_id);
    if (!url) {
      throw new NotFoundException(`Registro não encontrado`);
    }

    return await this.urlRepository.updateUrl(url_id, data);
  }

  /**
   * Exclui uma URL específica, validando o proprietário.
   * @param data - Objeto contendo o `url_id` e o `user_id` do proprietário.
   * @returns A URL excluída.
   * @throws NotFoundException - Caso a URL não seja encontrada ou não pertença ao usuário.
   */
  async deleteUrl(data: { url_id: string; user_id: string }): Promise<Url> {
    const url = await this.urlRepository.getUrlById(data.url_id);
    if (!url || url.user_id !== data.user_id) {
      throw new NotFoundException(`Registro não encontrado`);
    }

    return await this.urlRepository.deleteUrl(data);
  }

  /**
   * Busca uma URL pelo valor encurtado, incrementando o contador de cliques.
   * @param short_url - Valor encurtado da URL.
   * @returns A URL correspondente.
   * @throws NotFoundException - Caso a URL não seja encontrada.
   */
  async getUrlByShortUrl(short_url: string): Promise<Url | null> {
    const url = await this.urlRepository.getUrlByShortUrl(short_url);
    if (!url) {
      throw new NotFoundException(`Registro não encontrado`);
    }

    await this.urlRepository.updateUrl(url?.url_id, {
      click_count: url?.click_count + 1,
    });

    return url;
  }
}
