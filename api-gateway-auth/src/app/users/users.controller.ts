import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UuidParamDto } from './dto/uuid-param.dto';
import { CustomRequest } from 'src/interfaces/custom-request';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * Busca um usuário pelo ID.
   * @param uuid - Contém o UUID do usuário.
   * @returns O usuário correspondente ao UUID fornecido ou null, caso não seja encontrado.
   */
  @Get(':uuid')
  @ApiOperation({ summary: 'Buscar usuário pelo user_id' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({ name: 'uuid', description: 'ID do Usuario' })
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param() uuid: UuidParamDto): Promise<User | null> {
    return this.userService.getUserById(uuid?.uuid);
  }

  /**
   * Registra um novo usuário.
   * @param data - Contém os dados para criar o novo usuário.
   * @returns O usuário criado.
   */
  @Post()
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 422, description: 'Dados inválidos.' })
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.createUser(data);
  }

  /**
   * Lista todos os usuários.
   * @returns Uma lista de todos os usuários.
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos usuários' })
  @ApiResponse({ status: 200, description: 'Lista de Usuários' })
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  /**
   * Atualiza o próprio usuário.
   * @param data - Contém os dados para atualizar o usuário.
   * @param req - Request que contém o ID do usuário autenticado.
   * @returns O usuário atualizado.
   */
  @Put()
  @ApiOperation({ summary: 'Atualiza o próprio usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 422, description: 'Dados inválidos.' })
  @UseGuards(JwtAuthGuard)
  async updateOwnUser(
    @Body() data: UpdateUserDto,
    @Request() req: CustomRequest,
  ): Promise<User> {
    const user_id = req.user?.user_id;
    return this.userService.updateUser(user_id, data);
  }

  /**
   * Deleta o próprio usuário.
   * @param req - Request que contém o ID do usuário autenticado.
   * @returns O usuário deletado.
   */
  @Delete()
  @ApiOperation({ summary: 'Deleta o próprio usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req: CustomRequest): Promise<User> {
    const user_id = req.user?.user_id;
    return this.userService.deleteUser(user_id);
  }
}
