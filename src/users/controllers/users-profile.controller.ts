import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UsersProfileService } from '../services/users-profile.service';
import { ProfileUserResponseDto } from '../dto/profile-user-response.dto';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthUserJwtGuard)
export class UsersProfileController {
  constructor(private readonly usersProfileService: UsersProfileService) {}

  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
    type: ProfileUserResponseDto,
  })
  @Get('/user')
  public async findProfile(
    @UserRequest() user: any,
  ): Promise<ProfileUserResponseDto> {
    return this.usersProfileService.findProfile(user._id);
  }
}
