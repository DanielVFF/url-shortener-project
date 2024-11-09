import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UrlService } from './url.service';
import { Url } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUrlDto } from './dto/create-url.dto';
import { SearchUrlByUsedIdDto } from './dto/search-url-by-user.dto';
import { SearchUrlByShortDto } from './dto/search-url-by-short.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { DeleteUrlDto } from './dto/delete-url.dto';
import { RpcValidationFilter } from 'src/infrastructure/config/filters/rpcfilter';
import { CustomValidationPipe } from 'src/infrastructure/config/pipes/custom-validation.pipe';

@ApiTags('URLs')
@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiOperation({ summary: 'Cria uma nova Url Encurtada' })
  @MessagePattern({ cmd: 'create-url' })
  async createUrl(@Payload() data: CreateUrlDto): Promise<Url> {
    return this.urlService.createUrl(data);
  }

  @ApiOperation({ summary: 'Busca uma url encurtada pelo Id de Usuario' })

  @MessagePattern({ cmd: 'get-url-by-user_id' })
  async getUrlById(@Payload() data: SearchUrlByUsedIdDto): Promise<Url[] | null> {
    return this.urlService.getUrlByUserId(data.user_id);
  }

  @ApiOperation({ summary: 'Atualiza uma url encurtada' })
  @MessagePattern({ cmd: 'update-url' })
  async updateUrl(@Payload() data: { filter: string; data: UpdateUrlDto }): Promise<Url> {
    return this.urlService.updateUrl(data.filter, data.data);
  }

  @ApiOperation({ summary: 'Excluí uma url encurtada' })
  @MessagePattern({ cmd: 'delete-url' })
  async deleteUrl(@Payload() data: DeleteUrlDto): Promise<Url> {
    return this.urlService.deleteUrl(data);
  }

  @ApiOperation({ summary: 'Busca url encurtada para redirecionar' })
  @UseFilters(new RpcValidationFilter())
  @UsePipes(new CustomValidationPipe())
  @MessagePattern({ cmd: 'get-url-by-short-url' })
  async getUrlByShortUrl(@Payload() data: SearchUrlByShortDto): Promise<Url | null> {
    return this.urlService.getUrlByShortUrl(data.filter);
  }

}
