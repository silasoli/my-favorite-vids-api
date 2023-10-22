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
  Query,
} from '@nestjs/common';
import { CreateVideoDto } from '../dto/create-video.dto';
import { UpdateVideoDto } from '../dto/update-video.dto';
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
import { AdminVideosService } from '../services/admin-videos.service';
import { VideoResponseDto } from '../dto/response-video.dto';
import { VideoQueryDto } from '../dto/video-query.dto';
import { PaginatedResponseVideosDto } from '../dto/paginated-response-video.dto';

@ApiBearerAuth()
@ApiTags('Videos')
@Controller('videos')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminVideosController {
  constructor(private readonly adminVideosService: AdminVideosService) {}

  @ApiOperation({ summary: 'Criar video para um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video de usuário criado com sucesso',
    type: VideoResponseDto,
  })
  @ApiBody({ type: CreateVideoDto })
  @Post()
  @Role([Roles.ADMIN])
  create(@Body() dto: CreateVideoDto): Promise<VideoResponseDto> {
    return this.adminVideosService.create(dto);
  }

  @ApiOperation({ summary: 'Obter listagem de videos dos usuários' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de videos dos usuários retornada com sucesso',
    type: PaginatedResponseVideosDto,
  })
  @Get()
  @Role([Roles.ADMIN])
  findAll(@Query() query: VideoQueryDto): Promise<PaginatedResponseVideosDto> {
    return this.adminVideosService.findAll(query);
  }

  @ApiOperation({ summary: 'Obter video de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video do usuário retornado com sucesso',
    type: VideoResponseDto,
  })
  @Get(':id')
  @Role([Roles.ADMIN])
  findOne(@Param() params: IDQueryDTO): Promise<VideoResponseDto> {
    return this.adminVideosService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar video de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video do usuário editado com sucesso',
    type: VideoResponseDto,
  })
  @ApiBody({ type: UpdateVideoDto })
  @Patch(':id')
  @Role([Roles.ADMIN])
  update(
    @Param() params: IDQueryDTO,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.adminVideosService.update(params.id, updateVideoDto);
  }

  @ApiOperation({ summary: 'Deletar video de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Video do usuário deletado com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.ADMIN])
  remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.adminVideosService.remove(params.id);
  }
}
