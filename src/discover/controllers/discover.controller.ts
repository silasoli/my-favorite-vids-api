import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { VideoResponseDto } from '../../videos/dto/response-video.dto';
import { DiscoverService } from '../services/discover.service';
import { UsernameQueryDTO } from '../../common/dtos/username-query.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { PaginatedResponseVideosDto } from '../../videos/dto/paginated-response-video.dto';
import { VideoQueryDto } from '../dto/video-query.dto';
import { UserIDQueryDTO } from '../../common/dtos/userid-query.dto';

@ApiTags('Discover')
@Controller('/discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @ApiOperation({ summary: 'Obter video de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Video do usuário retornado com sucesso',
    type: VideoResponseDto,
  })
  @Get('videos/:id')
  discoverPublicVideosByID(
    @Param() params: IDQueryDTO,
  ): Promise<VideoResponseDto> {
    return this.discoverService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Descobrir usuários na plataforma' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de usuários retornada com sucesso',
    type: UserResponseDto,
  })
  @Get('users/:username')
  discoverPublicUsers(
    @Param() params: UsernameQueryDTO,
  ): Promise<UserResponseDto> {
    return this.discoverService.discoverPublicUsersByUsername(params.username);
  }

  @ApiOperation({ summary: 'Descobrir videos na plataforma.' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de videos retornada com sucesso',
    type: PaginatedResponseVideosDto,
  })
  @Get('videos/users/:user_id')
  discoverPublicVideosByUserId(
    @Param() params: UserIDQueryDTO,
    @Query() query: VideoQueryDto,
  ): Promise<PaginatedResponseVideosDto> {
    return this.discoverService.discoverPublicVideosByUserId(
      params.user_id,
      query,
    );
  }
}
