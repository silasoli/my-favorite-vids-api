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

@ApiBearerAuth()
@ApiTags('User')
@Controller('user/videos')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UserVideosController {
  constructor(private readonly adminVideosService: AdminVideosService) {}

  @ApiOperation({ summary: 'Criar video para usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video do usuário criado com sucesso',
    type: VideoResponseDto,
  })
  @ApiBody({ type: CreateVideoDto })
  @Post()
  @Role([Roles.USER])
  create(@Body() dto: CreateVideoDto): Promise<VideoResponseDto> {
    return this.adminVideosService.create(dto);
  }

  @ApiOperation({ summary: 'Obter listagem de videos de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de videos de um usuário retornada com sucesso',
    type: [VideoResponseDto],
  })
  @Get()
  @Role([Roles.USER])
  findAll(): Promise<VideoResponseDto[]> {
    return this.adminVideosService.findAll();
  }

  @ApiOperation({ summary: 'Obter um video do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video retornado com sucesso',
    type: VideoResponseDto,
  })
  @Get(':id')
  @Role([Roles.USER])
  findOne(@Param() params: IDQueryDTO): Promise<VideoResponseDto> {
    return this.adminVideosService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar video do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Editar video do usuário com sucesso',
    type: VideoResponseDto,
  })
  @ApiBody({ type: UpdateVideoDto })
  @Patch(':id')
  @Role([Roles.USER])
  update(
    @Param() params: IDQueryDTO,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.adminVideosService.update(params.id, updateVideoDto);
  }

  @ApiOperation({ summary: 'Deletar video do usuário' })
  @ApiResponse({
    status: 204,
    description: 'Video do usuário deletado com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.USER])
  remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.adminVideosService.remove(params.id);
  }
}
