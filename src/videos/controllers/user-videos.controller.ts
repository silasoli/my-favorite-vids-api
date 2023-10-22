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
import { UserCreateVideoDto } from '../dto/create-video.dto';
import { UserUpdateVideoDto } from '../dto/update-video.dto';
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
import { VideoResponseDto } from '../dto/response-video.dto';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../common/dtos/user-request.dto';
import { UserVideosService } from '../services/user-videos.service';
import { VideoQueryDto } from '../../discover/dto/video-query.dto';
import { PaginatedResponseVideosDto } from '../dto/paginated-response-video.dto';

@ApiBearerAuth()
@ApiTags('User Videos')
@Controller('api-user/videos')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UserVideosController {
  constructor(private readonly userVideosService: UserVideosService) {}

  @ApiOperation({ summary: 'Criar video para usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video do usuário criado com sucesso',
    type: VideoResponseDto,
  })
  @ApiBody({ type: UserCreateVideoDto })
  @Post()
  @Role([Roles.USER])
  create(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: UserCreateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.userVideosService.createToUser(user._id, dto);
  }

  @ApiOperation({ summary: 'Obter listagem de videos de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de videos de um usuário retornada com sucesso',
    type: PaginatedResponseVideosDto,
  })
  @Get()
  @Role([Roles.USER])
  findAll(
    @UserRequest() user: UserRequestDTO,
    @Query() query: VideoQueryDto,
  ): Promise<PaginatedResponseVideosDto> {
    return this.userVideosService.findAllVideosOfUser(user._id, query);
  }

  @ApiOperation({
    summary: 'Obter listagem de plataformas videos de um usuário',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listagem de plataformas videos de um usuário retornada com sucesso',
    type: [String],
  })
  @Get('platforms')
  @Role([Roles.USER])
  getPlatformsFromUserVideos(
    @UserRequest() user: UserRequestDTO,
  ): Promise<string[]> {
    return this.userVideosService.getPlatformsFromUserVideos(user._id);
  }

  @ApiOperation({ summary: 'Obter um video do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video retornado com sucesso',
    type: VideoResponseDto,
  })
  @Get(':id')
  @Role([Roles.USER])
  findOne(
    @Param() params: IDQueryDTO,
    @UserRequest() user: UserRequestDTO,
  ): Promise<VideoResponseDto> {
    return this.userVideosService.findOneVideoOfUser(params.id, user._id);
  }

  @ApiOperation({ summary: 'Editar video do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Editar video do usuário com sucesso',
    type: VideoResponseDto,
  })
  @ApiBody({ type: UserUpdateVideoDto })
  @Patch(':id')
  @Role([Roles.USER])
  update(
    @Param() params: IDQueryDTO,
    @UserRequest() user: UserRequestDTO,
    @Body() dto: UserUpdateVideoDto,
  ): Promise<VideoResponseDto> {
    return this.userVideosService.updateVideoOfUser(params.id, user._id, dto);
  }

  @ApiOperation({ summary: 'Deletar video do usuário' })
  @ApiResponse({
    status: 204,
    description: 'Video do usuário deletado com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.USER])
  remove(
    @Param() params: IDQueryDTO,
    @UserRequest() user: UserRequestDTO,
  ): Promise<void> {
    return this.userVideosService.remove(params.id, user._id);
  }
}
