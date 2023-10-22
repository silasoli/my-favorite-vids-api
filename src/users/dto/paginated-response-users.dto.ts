import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../common/dtos/paginate.dto';
import { ProfileUserResponseDto } from './profile-user-response.dto';

export class PaginatedResponseUsersDto {
  @ApiProperty({ type: () => PageMetaDto })
  meta?: PageMetaDto;

  @ApiProperty({ type: () => [ProfileUserResponseDto] })
  data: ProfileUserResponseDto[];

  constructor(data: ProfileUserResponseDto[], meta?: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
