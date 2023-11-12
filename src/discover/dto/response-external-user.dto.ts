import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.entity';

export class ExternalUserResponseDto {
  constructor(user: User) {
    const { _id, username, bio, profile_picture } = user;

    return {
      _id: String(_id),
      username,
      bio,
      profile_picture,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  bio: string;

  @ApiProperty({ required: false })
  profile_picture: string;
}
