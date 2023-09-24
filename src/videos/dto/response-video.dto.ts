import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../entities/video.entity';

export class VideoResponseDto {
  constructor(video: Video) {
    const { _id, url, user_id, title, privy, description } = video;

    return {
      _id: String(_id),
      user_id: String(user_id._id),
      url,
      title,
      description,
      privy,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  user_id: string;

  @ApiProperty({ required: true })
  url: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: true })
  privy: boolean;
}
