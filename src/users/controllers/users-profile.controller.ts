import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { UploadProfilePictureDto } from '../dto/upload-profile-picture.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';

export const storage = diskStorage({
  destination: '/tmp/uploads/profile-picture/',
  filename: (req: any, file, cb) => {
    const userid = req.user._id;
    const filename: string =
      path.parse(file.originalname).name.replace(/\s/g, '') +
      userid +
      new Date().getTime();

    const extension: string = path.parse(file.originalname).ext;

    cb(null, `${filename}${extension}`);
  },
});

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

  @ApiOperation({ summary: 'Modificar foto de perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil atualizada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @Role([Roles.USER])
  @Patch('/user/picture')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadProfilePictureDto })
  @UseInterceptors(FileInterceptor('file', { storage }))
  public async updateProfilePicture(
    @UserRequest() user: UserRequestDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string | null> {
    return this.usersProfileService.updateProfilePicture(user._id, { file });
  }

  @ApiOperation({ summary: 'Buscar foto de perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil retornada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @Role([Roles.USER])
  @Get('/user/picture')
  public async getProfilePicture<T>(
    @UserRequest() user: UserRequestDTO,
    @Res() res,
  ): Promise<Observable<T>> {
    const fileUrl = await this.usersProfileService.getProfilePicture(user._id);

    return of(res.sendFile(fileUrl));
  }
}
