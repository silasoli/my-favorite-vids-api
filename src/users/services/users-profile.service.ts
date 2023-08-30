import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileUserResponseDto } from '../dto/profile-user-response.dto';
import { UpdateProfileUserDto } from '../dto/update-profile-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';
import { UsersService } from './users.service';

@Injectable()
export class UsersProfileService {
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
}
