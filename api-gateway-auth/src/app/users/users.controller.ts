import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':uuid')
  @ApiOperation({ summary: 'Buscar usuário pelo user_id' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('uuid') uuid: string): Promise<User | null> {
    return this.userService.getUserById(uuid);
  }

  @Post()
  @ApiOperation({ summary: 'Criação de um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 422, description: 'Dados inválidos.' })
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.createUser(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos usuários' })
  @ApiResponse({ status: 200, description: 'Lista de Usuários' })
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Atualiza um usuário pelo user_id' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 422, description: 'Dados inválidos.' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('uuid') uuid: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(uuid, data);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Deleta um usuário pelo user_id' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('uuid') uuid: string): Promise<User> {
    return this.userService.deleteUser(uuid);
  }
}
