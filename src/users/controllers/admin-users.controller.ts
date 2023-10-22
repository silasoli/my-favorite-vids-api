import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { RoleGuard } from '../../roles/guards/role.guard';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiBearerAuth()
@ApiTags('Admin Users')
@Controller('api-admin/users')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Criar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta de usuário criada com sucesso',
    type: UserResponseDto,
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @Role([Roles.ADMIN])
  public async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Obter listagem de contas dos usuários' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de contas dos usuários retornada com sucesso',
    type: [UserResponseDto],
  })
  @Get()
  @Role([Roles.ADMIN])
  public async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obter conta do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta do usuário retornada com sucesso',
    type: UserResponseDto,
  })
  @Get(':id')
  @Role([Roles.ADMIN])
  public async findOne(@Param() params: IDQueryDTO): Promise<UserResponseDto> {
    return this.usersService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Editar conta de usuário com sucesso',
    type: UserResponseDto,
  })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  @Role([Roles.ADMIN])
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Deletar conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta do usuário deletada com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.ADMIN])
  public async remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.usersService.remove(params.id);
  }
}
