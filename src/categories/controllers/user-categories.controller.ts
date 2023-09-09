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
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiBearerAuth()
@ApiTags('User Categories')
@Controller('categories/user')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UserCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('')
  @Role([Roles.USER])
  public async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @Get('')
  @Role([Roles.USER])
  public async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  @Get('/:id')
  @Role([Roles.USER])
  public async findOne(
    @Param() params: IDQueryDTO,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(params.id);
  }

  @Patch('/:id')
  @Role([Roles.USER])
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(params.id, dto);
  }

  @Delete('/:id')
  @Role([Roles.USER])
  public async remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.categoriesService.remove(params.id);
  }
}
