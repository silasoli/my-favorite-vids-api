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
import { CreateCategoryToUserDto } from '../dto/create-category.dto';
import { UpdateCategoryOfUserDto } from '../dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { UserCategoriesService } from '../services/user-categories.service';
import { UserRequestDTO } from '../../common/dtos/user-request.dto';
import { UserRequest } from '../../auth/decorators/user-request.decorator';

@ApiBearerAuth()
@ApiTags('User Categories')
@Controller('categories/user')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UserCategoriesController {
  constructor(private readonly userCategoriesService: UserCategoriesService) {}

  @Post()
  @Role([Roles.USER])
  public async create(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: CreateCategoryToUserDto,
  ): Promise<CategoryResponseDto> {
    return this.userCategoriesService.createToUser(user._id, dto);
  }

  @Get()
  @Role([Roles.USER])
  public async findAll(
    @UserRequest() user: UserRequestDTO,
  ): Promise<CategoryResponseDto[]> {
    return this.userCategoriesService.findAllCategoriesOfUser(user._id);
  }

  @Get('/:id')
  @Role([Roles.USER])
  public async findOne(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<CategoryResponseDto> {
    return this.userCategoriesService.findOneCategoryOfUser(
      params.id,
      user._id,
    );
  }

  @Patch('/:id')
  @Role([Roles.USER])
  public async update(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateCategoryOfUserDto,
  ): Promise<CategoryResponseDto> {
    return this.userCategoriesService.updateCategoryOfUser(
      params.id,
      user._id,
      dto,
    );
  }

  @Delete('/:id')
  @Role([Roles.USER])
  public async remove(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<void> {
    return this.userCategoriesService.removeCategoryOfUser(params.id, user._id);
  }
}
