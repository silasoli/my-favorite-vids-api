import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UsersProfileService } from '../services/users-profile.service';
import { ProfileUserResponseDto } from '../dto/profile-user-response.dto';
import { UpdateProfileUserDto } from '../dto/update-profile-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { UserRequestDTO } from '../../common/dtos/user-request.dto';

@ApiBearerAuth()
@ApiTags('Profile')
@Controller('profile')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UsersProfileController {
  constructor(private readonly usersProfileService: UsersProfileService) {}

  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    type: ProfileUserResponseDto,
  })
  @Get('/user')
  @Role([Roles.USER])
  public async findProfile(
    @UserRequest() user: UserRequestDTO,
  ): Promise<ProfileUserResponseDto> {
    return this.usersProfileService.findProfile(user._id);
  }

  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário atualizado com sucesso',
    type: ProfileUserResponseDto,
  })
  @ApiBody({ type: UpdateProfileUserDto })
  @Patch('/user')
  @Role([Roles.USER])
  public async updateProfile(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: UpdateProfileUserDto,
  ): Promise<ProfileUserResponseDto> {
    return this.usersProfileService.updateProfile(user._id, dto);
  }

  @ApiOperation({ summary: 'Deletar conta do usuário' })
  @ApiResponse({
    status: 204,
    description: 'Perfil do usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Senha incorreta',
  })
  @ApiBody({ type: DeleteUserDto })
  @HttpCode(204)
  @Delete('/user')
  @Role([Roles.USER])
  public async remove(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: DeleteUserDto,
  ): Promise<void> {
    return this.usersProfileService.deleteUser(user._id, dto);
  }
}
