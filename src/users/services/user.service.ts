import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileUserResponseDto } from '../dto/profile-user-response.dto';
import { UpdateProfileUserDto } from '../dto/update-profile-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { UsersService } from './users.service';
import { UploadProfilePictureDto } from '../dto/upload-profile-picture.dto';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private usersService: UsersService,
  ) {}

  public async findProfile(_id: string): Promise<ProfileUserResponseDto> {
    const user = await this.userModel.findOne({ _id });
    return new ProfileUserResponseDto(user);
  }

  public async updateProfile(
    _id: string,
    dto: UpdateProfileUserDto,
  ): Promise<ProfileUserResponseDto> {
    await this.userModel.updateOne({ _id }, dto);
    return this.findProfile(_id);
  }

  public async deleteUser(_id: string, dto: DeleteUserDto): Promise<void> {
    const user = await this.userModel.findOne({ _id }, ['+password']);

    const passMatch = await this.usersService.comparePass(
      dto.password,
      user.password,
    );

    if (!passMatch) throw new UnauthorizedException('Senha incorreta.');

    this.userModel.deleteOne({ _id });
  }

  private async getProfilePictureURL(_id: string): Promise<string | null> {
    const picture = await this.userModel.findOne({ _id }, ['profile_picture']);
    return picture.profile_picture;
  }

  private deleteProfilePicture(url: string) {
    const profilePicturePath = join(
      process.cwd(),
      'uploads/profile-picture/',
      url,
    );

    fs.unlink(profilePicturePath, (err) => {
      if (err) console.error(`Error deleting profile picture: ${err}`);
    });
  }

  public async updateProfilePicture(
    _id: string,
    dto: UploadProfilePictureDto,
  ): Promise<string | null> {
    const profilePicture = await this.getProfilePictureURL(_id);

    if (profilePicture) this.deleteProfilePicture(profilePicture);

    await this.userModel.updateOne(
      { _id },
      { profile_picture: dto.file.filename ? dto.file.filename : null },
    );

    return this.getProfilePictureURL(_id);
  }

  public async getProfilePicture(_id: string): Promise<string> {
    const user = await this.userModel.findOne({ _id });

    const profilePicture = user.profile_picture
      ? user.profile_picture
      : 'default-image.png';

    return join(process.cwd(), 'uploads/profile-picture/' + profilePicture);
  }
}
