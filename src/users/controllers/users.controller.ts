import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../schemas/user.entity';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { QueryWithHelpers } from 'mongoose';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { RoleGuard } from '../../roles/guards/role.guard';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Role([Roles.ADMIN])
  public async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get()
  @Role([Roles.ADMIN])
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Role([Roles.ADMIN])
  public async findOne(@Param() params: IDQueryDTO): Promise<User> {
    return this.usersService.findOne(params.id);
  }

  @Patch(':id')
  @Role([Roles.ADMIN])
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateUserDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.usersService.update(params.id, dto);
  }

  @Delete(':id')
  @Role([Roles.ADMIN])
  public async remove(
    @Param() params: IDQueryDTO,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.usersService.remove(params.id);
  }
}
