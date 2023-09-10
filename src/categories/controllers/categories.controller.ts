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
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';


@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Criar categoria.' })
  @ApiResponse({
    status: 200,
    description: 'Categoria criada com sucesso.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Valor de campo já em uso.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  @Role([Roles.ADMIN])
  public async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @ApiOperation({ summary: 'Obter categorias.' })
  @ApiResponse({
    status: 200,
    description: 'Categorias retornadas com sucesso.',
    type: [CategoryResponseDto],
  })
  @Get()
  @Role([Roles.ADMIN])
  public async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Obter categoria.' })
  @ApiResponse({
    status: 200,
    description: 'Categoria retornada com sucesso.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  @Get(':id')
  @Role([Roles.ADMIN])
  public async findOne(
    @Param() params: IDQueryDTO,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Atualizar categoria.' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Valor de campo já em uso.',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch(':id')
  @Role([Roles.ADMIN])
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Deletar categoria.' })
  @ApiResponse({
    status: 204,
    description: 'Categoria deletada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.ADMIN])
  public async remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.categoriesService.remove(params.id);
  }
}
