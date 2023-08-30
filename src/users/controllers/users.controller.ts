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

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(AuthUserJwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public async findOne(@Param() params: IDQueryDTO): Promise<User> {
    return this.usersService.findOne(params.id);
  }

  @Patch(':id')
  public async update(
    @Param() params: IDQueryDTO,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.usersService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  public async remove(
    @Param() params: IDQueryDTO,
  ): Promise<QueryWithHelpers<unknown, unknown>> {
    return this.usersService.remove(params.id);
  }
}
