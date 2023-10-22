import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './paginate.dto';

export class PageDto<T> {
  @ApiProperty()
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta?: PageMetaDto;

  constructor(data: T[], meta?: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
