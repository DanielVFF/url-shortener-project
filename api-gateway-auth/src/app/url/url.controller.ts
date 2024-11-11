import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Url } from 'src/interfaces/url_model.interface';
import { RabbitmqService } from 'src/infrastructure/rabbitmq/rabbitmq.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UrlIdDto } from './dto/validate-url-id.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';
import { Response } from 'express';
import { CustomRequest } from 'src/interfaces/custom-request';

/**
 * Controlador para operações de URLs encurtadas.
 *
 * @remarks Permite criar, atualizar, excluir, e redirecionar URLs, com integração ao RabbitMQ.
 */
@Controller('url')
@ApiTags('Url')
@ApiBearerAuth()
export class UrlController {
  /**
   * Injeta o serviço RabbitmqService para comunicação com o broker.
   *
   * @param {RabbitmqService} brokerService - Serviço para envio de mensagens ao RabbitMQ.
   */
  constructor(private brokerService: RabbitmqService) {}

  /**
   * Cria uma nova URL encurtada.
   *
   * @param {CreateUrlDto} data - Dados para criação da URL encurtada.
   * @param {CustomRequest} req - Requisição customizada que pode conter o ID do usuário.
   * @returns {Promise<Url>} Retorna a URL criada.
   */
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Criar um novo encurtador de URL' })
  @ApiResponse({ status: 201, description: 'URL criada com sucesso' })
  async createUrl(
    @Body() data: CreateUrlDto,
    @Request() req: CustomRequest,
  ): Promise<Url> {
    const user_id = req.user?.user_id;
    return await this.brokerService.sendMessage('create-url', data, user_id);
  }

  /**
   * Obtém todas as URLs de um usuário autenticado.
   *
   * @param {CustomRequest} req - Requisição customizada com o ID do usuário autenticado.
   * @returns {Promise<Url[] | null>} Retorna uma lista de URLs ou nulo.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter todas as URLs' })
  @ApiResponse({ status: 200, description: 'Lista de URLs' })
  async getUrlById(@Request() req: CustomRequest): Promise<Url[] | null> {
    const user_id = req.user?.user_id;
    return await this.brokerService.sendMessage(
      'get-url-by-user_id',
      {},
      user_id,
    );
  }

  /**
   * Redireciona para a URL original com base no short URL.
   *
   * @param {string} short_url - Short URL da URL encurtada.
   * @param {CustomRequest} req - Requisição customizada que pode conter o ID do usuário.
   * @param {Response} res - Objeto de resposta para redirecionamento.
   * @returns {Promise<void | null>} Redireciona para a URL original ou retorna nulo se não encontrada.
   */
  @Get(':short_url')
  @ApiOperation({
    summary:
      'Obter URL pelo short URL, importante notar que swagger bloqueia esse redirecionamento',
  })
  @ApiResponse({ status: 200, description: 'URL encontrada' })
  @ApiParam({ name: 'short_url', description: 'O short URL da URL encurtada' })
  async getUrlByShortUrl(
    @Param('short_url') short_url: string,
    @Request() req: CustomRequest,
    @Res() res: Response,
  ): Promise<void | null> {
    const user_id = req.user?.user_id;
    const brokerResult: Url = await this.brokerService.sendMessage(
      'get-url-by-short-url',
      { short_url },
      user_id,
    );
    console.log(brokerResult);
    return res.redirect(brokerResult.original_url);
  }

  /**
   * Obtém o link completo da URL encurtada.
   *
   * @param {string} short_url - Short URL da URL encurtada.
   * @param {CustomRequest} req - Requisição customizada que pode conter o ID do usuário.
   * @returns {Promise<Partial<Url> | null>} Retorna um objeto parcial contendo o short URL completo.
   */
  @Get('link/:short_url')
  @ApiOperation({
    summary:
      'Obter Link de URL pelo short URL, *IMPORTANTE NOTAR QUE SWAGGER BLOQUEIA ESSE REDIRECIONAMENTO*',
  })
  @ApiResponse({ status: 200, description: 'URL encontrada' })
  @ApiParam({ name: 'short_url', description: 'O short URL da URL encurtada' })
  async getUrlLinkByShortUrl(
    @Param('short_url') short_url: string,
    @Request() req: CustomRequest,
  ): Promise<Partial<Url> | null> {
    const user_id = req.user?.user_id;
    const brokerResult: Url = await this.brokerService.sendMessage(
      'get-url-by-short-url',
      { short_url },
      user_id,
    );
    const hostUrl = `${req.protocol}://${req.get('host').split(':')[0]}/url/`;
    return { short_url: hostUrl + brokerResult.short_url };
  }

  /**
   * Atualiza uma URL existente.
   *
   * @param {UrlIdDto} params - Parâmetros contendo o ID da URL a ser atualizada.
   * @param {UpdateUrlDto} data - Dados para atualização da URL.
   * @param {CustomRequest} req - Requisição customizada com o ID do usuário autenticado.
   * @returns {Promise<Url>} Retorna a URL atualizada.
   */
  @Put(':url_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar URL' })
  @ApiResponse({ status: 200, description: 'URL atualizada com sucesso' })
  @ApiParam({ name: 'url_id', description: 'ID da URL a ser atualizada' })
  async updateUrl(
    @Param() params: UrlIdDto,
    @Body() data: UpdateUrlDto,
    @Request() req: { user: { user_id: string } } & Request,
  ): Promise<Url> {
    const { url_id } = params;
    const user_id = req.user?.user_id;
    return await this.brokerService.sendMessage(
      'update-url',
      { ...data, url_id },
      user_id,
    );
  }

  /**
   * Exclui uma URL existente.
   *
   * @param {UrlIdDto} params - Parâmetros contendo o ID da URL a ser excluída.
   * @param {CustomRequest} req - Requisição customizada com o ID do usuário autenticado.
   * @returns {Promise<Url>} Retorna a URL excluída.
   */
  @Delete(':url_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir URL' })
  @ApiResponse({ status: 200, description: 'URL excluída com sucesso' })
  @ApiParam({ name: 'url_id', description: 'ID da URL a ser excluída' })
  async deleteUrl(
    @Param() params: UrlIdDto,
    @Request() req: CustomRequest,
  ): Promise<Url> {
    const { url_id } = params;
    const user_id = req.user?.user_id;
    return await this.brokerService.sendMessage(
      'delete-url',
      { url_id },
      user_id,
    );
  }
}
