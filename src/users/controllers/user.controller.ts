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
  Query,
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
import { ProfileUserResponseDto } from '../dto/profile-user-response.dto';
import { UpdateProfileUserDto } from '../dto/update-profile-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { UserRequestDTO } from '../../common/dtos/user-request.dto';
import {
  UploadProfilePictureByURLDto,
} from '../dto/upload-profile-picture.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { PaginatedResponseUsersDto } from '../dto/paginated-response-users.dto';
import { UsersQueryDto } from '../dto/users-query.dto';

// export const storage = diskStorage({
//   destination: './uploads/profile-picture/',
//   filename: (req: any, file, cb) => {
//     const userid = req.user._id;
//     const filename: string =
//       path.parse(file.originalname).name.replace(/\s/g, '') +
//       userid +
//       new Date().getTime();

//     const extension: string = path.parse(file.originalname).ext;

//     cb(null, `${filename}${extension}`);
//   },
// });

@ApiBearerAuth()
@ApiTags('User Profile')
@Controller('api-user')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    type: ProfileUserResponseDto,
  })
  @Get('/profile')
  @Role([Roles.USER])
  public async findProfile(
    @UserRequest() user: UserRequestDTO,
  ): Promise<ProfileUserResponseDto> {
    return this.userService.findProfile(user._id);
  }

  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário atualizado com sucesso',
    type: ProfileUserResponseDto,
  })
  @ApiBody({ type: UpdateProfileUserDto })
  @Patch('/profile')
  @Role([Roles.USER])
  public async updateProfile(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: UpdateProfileUserDto,
  ): Promise<ProfileUserResponseDto> {
    return this.userService.updateProfile(user._id, dto);
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
  @Delete('/profile')
  @Role([Roles.USER])
  public async remove(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: DeleteUserDto,
  ): Promise<void> {
    return this.userService.deleteUser(user._id, dto);
  }

  // @ApiOperation({ summary: 'Modificar foto de perfil do usuário' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Foto de perfil atualizada com sucesso',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Não autorizado',
  // })
  // @Role([Roles.USER])
  // @Patch('/profile/picture')
  // // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: UploadProfilePictureDto })
  // // @UseInterceptors(FileInterceptor('file', { storage }))
  // public async updateProfilePicture(
  //   @UserRequest() user: UserRequestDTO,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<string | null> {
  //   return this.userService.updateProfilePicture(user._id, { file });
  // }

  @ApiOperation({ summary: 'Modificar foto de perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Foto de perfil não encontrada.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @Role([Roles.USER])
  @Patch('/profile/picture')
  @ApiBody({ type: UploadProfilePictureByURLDto })
  public async updateProfilePicture(
    @UserRequest() user: UserRequestDTO,
    @Body() data: UploadProfilePictureByURLDto,
  ): Promise<string | null> {
    return this.userService.updateProfilePictureByURL(user._id, data);
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
  @Get('profile/picture')
  public async getProfilePicture<T>(
    @UserRequest() user: UserRequestDTO,
    @Res() res,
  ): Promise<Observable<T>> {
    const fileUrl = await this.userService.getProfilePicture(user._id);

    return of(res.sendFile(fileUrl));
  }

  @ApiOperation({ summary: 'Buscar fotos de perfils' })
  @ApiResponse({
    status: 200,
    description: 'Fotos de perfil retornadas com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @Role([Roles.USER])
  @Get('profile-pictures')
  public async getAllProfilePictures(): Promise<string[]> {
    return this.userService.getAllProfilePictures();
  }
}
