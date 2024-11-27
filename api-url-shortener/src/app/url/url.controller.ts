import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UrlService } from './url.service';
import { Url } from '@prisma/client';
import { CreateUrlInterface } from 'src/interfaces/url/create-url.interface';
import { SearchByUserUrlInteface } from 'src/interfaces/url/search-by-user-url.interface';
import { UpdateUrlInterface } from 'src/interfaces/url/update-url.interface';
import { SearchByShortUrlInteface } from 'src/interfaces/url/search-by-short-url.interface';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  /**
   * Cria uma nova URL.
   * @param data - Dados necessários para criar a URL, conforme o `CreateUrlInterface`.
   * @returns A URL criada.
   */
  @MessagePattern({ cmd: 'create-url' })
  async createUrl(@Payload() data: CreateUrlInterface): Promise<Url> {
    return this.urlService.createUrl(data);
  }

  /**
   * Busca URLs associadas a um usuário pelo ID do usuário.
   * @param data - Objeto contendo o `user_id` para realizar a busca.
   * @returns Uma lista de URLs associadas ao usuário ou null se não encontrar.
   */
  @MessagePattern({ cmd: 'get-url-by-user_id' })
  async getUrlById(
    @Payload() data: SearchByUserUrlInteface,
  ): Promise<Url[] | null> {
    return this.urlService.getUrlByUserId(data.user_id);
  }

  /**
   * Atualiza informações de uma URL específica.
   * @param data - Objeto contendo o `url_id` da URL a ser atualizada e os dados de atualização.
   * @returns A URL atualizada.
   */
  @MessagePattern({ cmd: 'update-url' })
  async updateUrl(@Payload() data: UpdateUrlInterface): Promise<Url> {
    return this.urlService.updateUrl(data.url_id, data);
  }

  /**
   * Exclui uma URL específica.
   * @param data - Objeto contendo o `url_id` da URL a ser excluída e o `user_id` do proprietário.
   * @returns A URL excluída.
   */
  @MessagePattern({ cmd: 'delete-url' })
  async deleteUrl(
    @Payload() data: { url_id: string } & SearchByUserUrlInteface,
  ): Promise<Url> {
    return this.urlService.deleteUrl({
      url_id: data.url_id,
      user_id: data.user_id,
    });
  }

  /**
   * Busca uma URL pelo seu valor encurtado.
   * @param data - Objeto contendo o `short_url` da URL a ser buscada.
   * @returns A URL correspondente ou null se não encontrada.
   */
  @MessagePattern({ cmd: 'get-url-by-short-url' })
  async getUrlByShortUrl(
    @Payload() data: SearchByShortUrlInteface,
  ): Promise<Url | null> {
    return this.urlService.getUrlByShortUrl(data.short_url);
  }
}
