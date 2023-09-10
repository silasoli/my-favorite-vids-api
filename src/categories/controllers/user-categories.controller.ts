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
import { CreateCategoryToUserDto } from '../dto/create-category.dto';
import { UpdateCategoryOfUserDto } from '../dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
@ApiTags('User')
@Controller('user/categories')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UserCategoriesController {
  constructor(private readonly userCategoriesService: UserCategoriesService) {}

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
  @ApiBody({ type: CreateCategoryToUserDto })
  @Post()
  @Role([Roles.USER])
  public async create(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: CreateCategoryToUserDto,
  ): Promise<CategoryResponseDto> {
    return this.userCategoriesService.createToUser(user._id, dto);
  }

  @ApiOperation({ summary: 'Obter categorias do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Categorias do usuário retornadas com sucesso.',
    type: [CategoryResponseDto],
  })
  @Get()
  @Role([Roles.USER])
  public async findAll(
    @UserRequest() user: UserRequestDTO,
  ): Promise<CategoryResponseDto[]> {
    return this.userCategoriesService.findAllCategoriesOfUser(user._id);
  }

  @ApiOperation({ summary: 'Obter categoria do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Categoria do usuário retornada com sucesso.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
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

  @ApiOperation({ summary: 'Atualizar categoria do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Categoria do usuário atualizada com sucesso.',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Você não pode modificar a privacidade de uma Categoria Pública.',
  })
  @ApiResponse({
    status: 409,
    description: 'Valor de campo já em uso.',
  })
  @ApiBody({ type: UpdateCategoryOfUserDto })
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

  @ApiOperation({ summary: 'Deletar categoria do usuário.' })
  @ApiResponse({
    status: 204,
    description: 'Categoria do usuário deletada com sucesso.',
  })
  @ApiResponse({
    status: 403,
    description: 'Você não pode excluir uma Categoria Pública.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoria não encontrada.',
  })
  @HttpCode(204)
  @Delete('/:id')
  @Role([Roles.USER])
  public async remove(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<void> {
    return this.userCategoriesService.removeCategoryOfUser(params.id, user._id);
  }
}
