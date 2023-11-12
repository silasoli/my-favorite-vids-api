import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { DiscoverService } from '../services/discover.service';
import { UsernameQueryDTO } from '../../common/dtos/username-query.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { PaginatedResponseVideosDto } from '../../videos/dto/paginated-response-video.dto';
import { VideoQueryDto } from '../dto/video-query.dto';
import { UserIDQueryDTO } from '../../common/dtos/userid-query.dto';
import { VideoUserResponseDto } from '../dto/response-video-user.dto';
import { ExternalUserResponseDto } from '../dto/response-external-user.dto';

@ApiTags('Discover')
@Controller('/discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @ApiOperation({ summary: 'Descobrir usuários na plataforma pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário retornado com sucesso',
    type: ExternalUserResponseDto,
  })
  @Get('users/:id')
  discoverPublicUsersID(
    @Param() params: IDQueryDTO,
  ): Promise<ExternalUserResponseDto> {
    return this.discoverService.discoverPublicUsersID(params.id);
  }

  @ApiOperation({ summary: 'Descobrir usuários na plataforma pelo username' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de usuários retornada com sucesso',
    type: UserResponseDto,
  })
  @Get('users/profile/:username')
  discoverPublicUsersByUsername(
    @Param() params: UsernameQueryDTO,
  ): Promise<ExternalUserResponseDto> {
    return this.discoverService.discoverPublicUsersByUsername(params.username);
  }

  @ApiOperation({ summary: 'Descobrir videos de um usuario na plataforma.' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de videos retornada com sucesso',
    type: PaginatedResponseVideosDto,
  })
  @Get('users/videos/:user_id')
  discoverPublicVideosByUserId(
    @Param() params: UserIDQueryDTO,
    @Query() query: VideoQueryDto,
  ): Promise<PaginatedResponseVideosDto> {
    return this.discoverService.discoverPublicVideosByUserId(
      params.user_id,
      query,
    );
  }

  @ApiOperation({ summary: 'Descobrir plataformas dos videos de um usuario' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de plataformas de videos retornada com sucesso',
    type: [String],
  })
  @Get('users/platforms/:user_id')
  discoverPlatforms(@Param() params: UserIDQueryDTO): Promise<string[]> {
    return this.discoverService.getPlatformsFromUserVideos(params.user_id);
  }

  @ApiOperation({ summary: 'Obter video publico por ID' })
  @ApiResponse({
    status: 200,
    description: 'Video retornado com sucesso',
    type: VideoUserResponseDto,
  })
  @Get('videos/:id')
  discoverPublicVideosByID(
    @Param() params: IDQueryDTO,
  ): Promise<VideoUserResponseDto> {
    return this.discoverService.findOne(params.id);
  }
}
