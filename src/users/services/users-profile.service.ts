import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileUserResponseDto } from '../dto/profile-user-response.dto';

@Injectable()
export class UsersProfileService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  public async findProfile(_id: string): Promise<ProfileUserResponseDto> {
    const user = await this.userModel.findOne({ _id });
    return new ProfileUserResponseDto(user);
  }
}
