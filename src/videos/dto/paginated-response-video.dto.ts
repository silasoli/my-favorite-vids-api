import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../common/dtos/paginate.dto';
import { VideoResponseDto } from './response-video.dto';

export class PaginatedResponseVideosDto {
  @ApiProperty({ type: () => PageMetaDto })
  meta?: PageMetaDto;

  @ApiProperty({ type: () => [VideoResponseDto] })
  data: VideoResponseDto[];

  constructor(data: VideoResponseDto[], meta?: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
