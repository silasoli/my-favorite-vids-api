import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { UserDiscoverService } from '../services/user-discover.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { PaginatedResponseVideosDto } from '../../videos/dto/paginated-response-video.dto';
import Roles from '../../roles/enums/role.enum';
import { Role } from '../../roles/decorators/roles.decorator';
import { VideoQueryDto } from '../dto/video-query.dto';
import { PaginatedResponseUsersDto } from '../../users/dto/paginated-response-users.dto';
import { UsersQueryDto } from '../../users/dto/users-query.dto';

@ApiBearerAuth()
@ApiTags('User Discover')
@Controller('api-user/discover')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UserDiscoverController {
  constructor(private readonly userDiscoverService: UserDiscoverService) {}

  @ApiOperation({ summary: 'Descobrir videos na plataforma.' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de videos retornada com sucesso',
    type: PaginatedResponseVideosDto,
  })
  @Get('videos')
  @Role([Roles.USER])
  discoverPublicVideos(
    @Query() query: VideoQueryDto,
  ): Promise<PaginatedResponseVideosDto> {
    return this.userDiscoverService.discoverPublicVideos(query);
  }

  @ApiOperation({ summary: 'Descobrir usuários na plataforma' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de usuários retornada com sucesso',
    type: PaginatedResponseUsersDto,
  })
  @Get('users')
  @Role([Roles.USER])
  discoverPublicUsers(
    @Query() query: UsersQueryDto,
  ): Promise<PaginatedResponseUsersDto> {
    return this.userDiscoverService.discoverPublicUsers(query);
  }
}
