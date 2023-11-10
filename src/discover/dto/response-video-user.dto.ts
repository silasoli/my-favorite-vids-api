import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../../videos/entities/video.entity';

export class ExternalUserDto {
  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  bio: string;

  @ApiProperty({ required: false })
  profile_picture: string;
}

export class VideoUserResponseDto {
  constructor(video: Video) {
    const {
      _id,
      url,
      user_id: { _id: userid, username, bio, profile_picture },
      title,
      privy,
      description,
      platform,
    } = video;

    return {
      _id: String(_id),
      user: { _id: String(userid), username, bio, profile_picture },
      url,
      title,
      description,
      privy,
      platform,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true, type: () => ExternalUserDto })
  user: ExternalUserDto;

  @ApiProperty({ required: true })
  url: string;

  @ApiProperty({ required: true })
  platform: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: true })
  privy: boolean;
}
