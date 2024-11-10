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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UrlIdDto } from './dto/validate-url-id.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';
import { Response } from 'express';
@Controller('url')
@ApiTags('Url')
export class UrlController {
  constructor(private brokerService: RabbitmqService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Criar um novo encurtador de URL' })
  @ApiResponse({ status: 201, description: 'URL criada com sucesso' })
  async createUrl(
    @Body() data: CreateUrlDto,
    @Request() req: any,
  ): Promise<Url> {
    const user_id = req.user?.user_id;
    return await this.brokerService.sendMessage('create-url', data, user_id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter todas as URLs' })
  @ApiResponse({ status: 200, description: 'Lista de URLs' })
  async getUrlById(@Request() req: any): Promise<Url[] | null> {
    const user_id = req.user?.user_id;
    return await this.brokerService.sendMessage(
      'get-url-by-user_id',
      {},
      user_id,
    );
  }

  @Get(':short_url')
  @ApiOperation({
    summary:
      'Obter URL pelo short URL, importante notar que swagger bloqueia esse redirecionamento',
  })
  @ApiResponse({ status: 200, description: 'URL encontrada' })
  @ApiParam({ name: 'short_url', description: 'O short URL da URL encurtada' })
  async getUrlByShortUrl(
    @Param('short_url') short_url: string,
    @Request() req: any,
    @Res() res: Response,
  ): Promise<void | null> {
    const user_id = req.user?.user_id;
    const brokerResult = await this.brokerService.sendMessage(
      'get-url-by-short-url',
      { short_url },
      user_id,
    );
    return res.redirect(brokerResult.original_url);
  }

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

  @Delete(':url_id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Excluir URL' })
  @ApiResponse({ status: 200, description: 'URL excluída com sucesso' })
  @ApiParam({ name: 'url_id', description: 'ID da URL a ser excluída' })
  async deleteUrl(
    @Param() params: UrlIdDto,
    @Request() req: any,
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
